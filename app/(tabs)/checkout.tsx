import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Modal, Alert } from 'react-native';
import { Link, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '@/app/services/apiService';
import useStore from '@/app/store/useStore';

export default function Checkout() {
  const { orderId } = useLocalSearchParams();
  const [selectedPayment, setSelectedPayment] = useState('cash');
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('Order placed successfully!');
  const { isAuthenticated, setBasket } = useStore();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);

  // Check authentication
  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated) {
        router.replace('/auth');
      }
    }, [isAuthenticated])
  );

  // Load data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        if (orderId) {
          loadOrderDetails();
        } else {
          getCart();
        }
        loadAddresses();
      }
    }, [isAuthenticated, orderId])
  );

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOrderDetails(orderId);
      if (response.success) {
        setCart(response.data);
        setSuccessMessage('Your order will be recreated');
      } else {
        console.error('Failed to load order details:', response.message);
        Alert.alert('Error', 'Failed to load order details');
      }
    } catch (error) {
      console.error('Error loading order details:', error);
      Alert.alert('Error', 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const loadAddresses = async () => {
    try {
      const response = await apiService.getAddresses();

      if (response.success) {
        setAddresses(response.addresses || []);

        if (response.addresses.length === 0) {
          // Redirect to add address if no addresses exist
          Alert.alert(
            "No Delivery Address",
            "You need to add a delivery address before checkout.",
            [
              { text: "Add Address", onPress: () => router.push('/add-address') }
            ]
          );
          return;
        }

        // Set default address as selected if available
        const defaultAddress = response.addresses.find(addr => addr.is_default);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        } else if (response.addresses.length > 0) {
          setSelectedAddress(response.addresses[0]);
        }
      } else {
        console.error('Failed to load addresses:', response.message);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const formatAddressDetails = (address) => {
    if (!address) return "No address selected";

    const parts = [];

    if (address.is_apartment) {
      if (address.building_name) parts.push(address.building_name);
      if (address.apartment_number) parts.push(`Apt. ${address.apartment_number}`);
      if (address.floor) parts.push(`Floor ${address.floor}`);
    } else {
      if (address.house_number) parts.push(`House ${address.house_number}`);
    }

    if (address.street) parts.push(address.street);
    if (address.block) parts.push(`Block ${address.block}`);
    if (address.way) parts.push(`Way ${address.way}`);

    return parts.join(', ');
  };

  const handleBack = () => {
    router.back();
  };

  const getCart = async () => {
    try {
      setLoading(true);
      const res = await apiService.getCart();
      setCart(res.product);
    } catch (error) {
      console.error('Error fetching cart:', error);
      Alert.alert('Error', 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert("Error", "Please select a delivery address");
      return;
    }

    try {
      setPlacingOrder(true);
      let response;

      if (orderId) {
        // Reorder existing order
        response = await apiService.orderAgain({
          order_id: orderId,
          address_id: selectedAddress.id.toString(),
        });
      } else {
        // Place new order
        response = await apiService.placeOrder({
          address_id: selectedAddress.id.toString(),
        });
      }

      if (response.success) {
        // Update success message based on order type
        setSuccessMessage(orderId ? 'Order recreated successfully!' : 'Order placed successfully!');
        setShowSuccessModal(true);

        // Reset basket count
        setBasket(0);

        // Wait for 2 seconds before redirecting
        setTimeout(() => {
          setShowSuccessModal(false);
          // Redirect to order details if we have an order ID, otherwise to orders list
          if (response.order?.id) {
            router.replace(`/order/${response.order.id}`);
          } else {
            router.replace('/orders');
          }
        }, 2000);
      } else {
        Alert.alert("Error", response.message || "Failed to place order");
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2C3639" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#2C3639" />
          <Text style={styles.headerTitle}>{orderId ? 'Reorder' : 'Check out'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={24} color="#2C3639" />
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>
          {selectedAddress ? (
            <>
              <Text style={styles.addressTitle}>{selectedAddress.address || 'Delivery Address'}</Text>
              <Text style={styles.addressText}>{formatAddressDetails(selectedAddress)}</Text>
              <Text style={styles.addressPhone}>Phone: {selectedAddress.phone}</Text>
              <TouchableOpacity>
                <Link href="/addresses" style={styles.changeLink}>Change</Link>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={() => router.push('/addresses')}>
              <Text style={styles.noAddressText}>No address selected. Tap to select an address.</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pay with</Text>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              selectedPayment === 'cash' && styles.paymentOptionSelected
            ]}
            onPress={() => setSelectedPayment('cash')}
          >
            <Text style={styles.paymentText}>Cash on Delivery</Text>
            <View style={styles.radio}>
              {selectedPayment === 'cash' && <View style={styles.radioSelected} />}
            </View>
          </TouchableOpacity>
        </View>

        {/* Payment Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>OMR {cart?.sub_total || '0.000'}</Text>
          </View>

          {cart?.discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={styles.discountValue}>-OMR {cart?.discount}</Text>
            </View>
          )}

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>OMR {cart?.grand_total || '0.000'}</Text>
          </View>
        </View>

        {/* Terms */}
        <View style={styles.termsSection}>
          <Text style={styles.termsText}>
            By placing this order you agree to the credit card{' '}
            <Text style={styles.termsLink}>terms & Conditions</Text>
          </Text>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <TouchableOpacity
        style={[styles.placeOrderButton, placingOrder && styles.buttonDisabled]}
        onPress={handlePlaceOrder}
        disabled={placingOrder || !selectedAddress}
      >
        {placingOrder ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.placeOrderText}>{orderId ? 'REORDER' : 'PLACE ORDER'}</Text>
        )}
      </TouchableOpacity>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.successModalContainer}>
          <View style={styles.successModalContent}>
            <Ionicons name="checkmark-circle" size={50} color="#4CAF50" />
            <Text style={styles.successModalText}>{successMessage}</Text>
            {orderId && (
              <Text style={styles.successModalSubtext}>
                Based on order #{orderId}
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3639',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3639',
    marginBottom: 16,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3639',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  addressPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  noAddressText: {
    fontSize: 14,
    color: '#E97777',
    marginBottom: 8,
    textDecorationLine: 'underline',
  },
  changeLink: {
    color: '#E97777',
    fontSize: 14,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 12,
  },
  paymentOptionSelected: {
    borderColor: '#2C3639',
  },
  paymentText: {
    fontSize: 14,
    color: '#2C3639',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2C3639',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2C3639',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#2C3639',
  },
  discountValue: {
    fontSize: 14,
    color: '#E97777',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
    marginTop: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3639',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E97777',
  },
  termsSection: {
    padding: 16,
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  termsLink: {
    color: '#E97777',
    textDecorationLine: 'underline',
  },
  placeOrderButton: {
    backgroundColor: '#E97777',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  successModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  successModalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: '80%',
  },
  successModalText: {
    fontSize: 18,
    color: '#2C3639',
    textAlign: 'center',
    fontWeight: '600',
  },
  successModalSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});