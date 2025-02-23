import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from './services/apiService';
import * as SecureStore from 'expo-secure-store';
import useStore from './store/useStore';

export default function Checkout() {
  const [selectedPayment, setSelectedPayment] = useState('cash');
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { isAuthenticated, user } = useStore();

  if (!isAuthenticated) {
    router.replace('/auth');
    return null;
  }

  // check have shipping address
  if (!user.shipping_first_name || !user.shipping_last_name || !user.shipping_phone || !user.shipping_address || !user.shipping_city || !user.shipping_state || !user.shipping_postal_code) {
    router.replace('/edit-address');
    return null;
  }

  const handleBack = () => {
    router.back();
  };

  const getCart = async () => {
    try {
      const res = await apiService.getCart();
      setCart(res.product);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const handlePlaceOrder = async () => {
    try {
      setPlacingOrder(true);
      // Call your order placement API here
      const response = await apiService.placeOrder({
        'fist_name': user.shipping_first_name,
        'last_name': user.shipping_last_name,
        'email': user.email,
        'phone': user.shipping_phone,
        'address': user.shipping_address,
        'address2': user.shipping_address2,
        'city': user.shipping_city,
        'state': user.shipping_state,
        'postal_code': user.shipping_postal_code
      });

      if (response.success) {
        setShowSuccessModal(true);
        // Wait for 2 seconds before redirecting
        setTimeout(() => {
          setShowSuccessModal(false);
          router.replace('/(tabs)');
        }, 2000);
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
          <Text style={styles.headerTitle}>Check out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={24} color="#2C3639" />
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>
          <Text style={styles.addressText}>123 Main Street, City</Text>
          <TouchableOpacity>
            <Link href="/edit-address" style={styles.changeLink}>Change</Link>
          </TouchableOpacity>
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
            <Text style={styles.summaryValue}>OMR {cart?.sub_total}</Text>
          </View>

          {cart?.discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={styles.summaryValue}>-OMR {cart?.discount}</Text>
            </View>
          )}

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>OMR {cart?.grand_total}</Text>
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
        disabled={placingOrder}
      >
        {placingOrder ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.placeOrderText}>PLACE ORDER</Text>
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
            <Text style={styles.successModalText}>Order placed successfully!</Text>
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
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
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
    padding: 20,
    borderRadius: 10,
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
  },
  successModalText: {
    fontSize: 16,
    color: '#2C3639',
    textAlign: 'center',
    fontWeight: '500',
  },
});