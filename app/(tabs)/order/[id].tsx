import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '@/app/services/apiService';

export default function OrderDetails() {
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderDetails();
  }, [id]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOrderDetails(id);
      if (response.success) {
        setOrder(response.data);
      }
    } catch (error) {
      console.error('Error loading order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/orders');
  };

  const formatAddressDetails = (address) => {
    if (!address) return "No address information";

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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return styles.statusCompleted;
      case 'processing':
        return styles.statusProcessing;
      case 'pending':
        return styles.statusPending;
      case 'cancelled':
        return styles.statusCancelled;
      case 'refunded':
        return styles.statusRefunded;
      case 'failed':
        return styles.statusFailed;
      case 'payment_pending':
        return styles.statusPaymentPending;
      default:
        return styles.statusDefault;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2C3639" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
        <Text style={styles.errorText}>Order not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#2C3639" />
          <Text style={styles.headerTitle}>Order Details</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Status */}
        <View style={styles.section}>
          <View style={styles.orderHeader}>
            <Text style={[styles.orderStatus, getStatusColor(order.status)]}>
              {order.status?.toUpperCase()}
            </Text>
            <Text style={styles.orderDate}>
              {new Date(order.created_at).toLocaleDateString()}
            </Text>
          </View>
          <Text style={styles.orderId}>Order ID: #{order.id}</Text>
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={24} color="#2C3639" />
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>
          <View style={styles.addressDetails}>
            <Text style={styles.addressName}>
              {order?.address?.address || 'Delivery Address'}
            </Text>
            <Text style={styles.addressText}>{formatAddressDetails(order.address)}</Text>
            {order?.address?.phone && (
              <Text style={styles.addressText}>Phone: {order.address.phone}</Text>
            )}
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cart-outline" size={24} color="#2C3639" />
            <Text style={styles.sectionTitle}>Order Items</Text>
          </View>
          {order.items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <Image
                source={{ uri: item.image }}
                style={styles.itemImage}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                <View style={styles.itemPriceRow}>
                  <Text style={styles.itemPrice}>OMR {item.price}</Text>
                  {item.discount > 0 && (
                    <Text style={styles.itemDiscount}>-OMR {item.discount}</Text>
                  )}
                </View>
                <Text style={styles.itemSubtotal}>
                  Subtotal: OMR {item.sub_total}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="receipt-outline" size={24} color="#2C3639" />
            <Text style={styles.sectionTitle}>Order Summary</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>OMR {order.sub_total}</Text>
            </View>
            {parseFloat(order.discount) > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount</Text>
                <Text style={styles.discountValue}>-OMR {order.discount}</Text>
              </View>
            )}
            {parseFloat(order.shipping_cost) > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>OMR {order.shipping_cost}</Text>
              </View>
            )}
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>OMR {order.grand_total}</Text>
            </View>
          </View>
        </View>

        {/* Payment Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="card-outline" size={24} color="#2C3639" />
            <Text style={styles.sectionTitle}>Payment Information</Text>
          </View>
          <View style={styles.paymentDetails}>
            <Text style={styles.paymentMethod}>
              Payment Method: {order.payment_method || 'Cash on Delivery'}
            </Text>
            {order.payment_reference && (
              <Text style={styles.paymentReference}>
                Reference: {order.payment_reference}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.supportButton}
          onPress={() => router.push('/contact')}
        >
          <Text style={styles.supportButtonText}>CONTACT SUPPORT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.reorderButton}
          onPress={() => router.push(`/checkout?orderId=${order.id}`)}
        >
          <Text style={styles.reorderButtonText}>REORDER</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    marginBottom: 24,
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
  backButtonText: {
    color: '#E97777',
    fontSize: 16,
    fontWeight: '600',
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusCompleted: {
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
  },
  statusProcessing: {
    backgroundColor: '#E3F2FD',
    color: '#1976D2',
  },
  statusPending: {
    backgroundColor: '#FFF3E0',
    color: '#F57C00',
  },
  statusCancelled: {
    backgroundColor: '#FFEBEE',
    color: '#C62828',
  },
  statusRefunded: {
    backgroundColor: '#F3E5F5',
    color: '#7B1FA2',
  },
  statusFailed: {
    backgroundColor: '#FFEBEE',
    color: '#C62828',
  },
  statusPaymentPending: {
    backgroundColor: '#FFF3E0',
    color: '#F57C00',
  },
  statusDefault: {
    backgroundColor: '#F5F5F5',
    color: '#666',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  orderId: {
    fontSize: 14,
    color: '#666',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3639',
  },
  addressDetails: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3639',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemCard: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3639',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  itemPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#2C3639',
  },
  itemDiscount: {
    fontSize: 12,
    color: '#E97777',
  },
  itemSubtotal: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3639',
  },
  summaryCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
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
    borderTopColor: '#ddd',
    paddingTop: 12,
    marginTop: 12,
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
  paymentDetails: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
  },
  paymentMethod: {
    fontSize: 14,
    color: '#2C3639',
    marginBottom: 4,
  },
  paymentReference: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  supportButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C3639',
    borderRadius: 8,
  },
  supportButtonText: {
    color: '#2C3639',
    fontSize: 14,
    fontWeight: '600',
  },
  reorderButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#E97777',
    borderRadius: 8,
  },
  reorderButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});