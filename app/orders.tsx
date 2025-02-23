import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Modal, Image } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '@/app/services/apiService';
import useStore from '@/app/store/useStore';

export default function OrderHistory() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingOrderId, setProcessingOrderId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { isAuthenticated } = useStore();
  const [ratingOrder, setRatingOrder] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
      return;
    }
    loadOrders();
  }, [isAuthenticated]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleOrderAgain = async (orderId) => {
    try {
      setProcessingOrderId(orderId);
      const response = await apiService.reorder(orderId);
      if (response.success) {
        setSuccessMessage('Order placed successfully!');
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          router.push('/basket');
        }, 2000);
      }
    } catch (error) {
      console.error('Error reordering:', error);
    } finally {
      setProcessingOrderId(null);
    }
  };


  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
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

  if (orders.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="#2C3639" />
            <Text style={styles.headerTitle}>MY ORDERS</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No orders found</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => router.push('/(tabs)/main-shop')}
          >
            <Text style={styles.shopButtonText}>START SHOPPING</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#2C3639" />
          <Text style={styles.headerTitle}>MY ORDERS</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            {/* Order Header */}
            <View style={styles.orderHeader}>
              <Text style={styles.orderDate}>
                {new Date(order.created_at).toLocaleDateString()}
              </Text>
              <Text style={[styles.orderStatus, getStatusColor(order.status)]}>
                {order.status.toUpperCase()}
              </Text>
            </View>

            {/* Order Details */}

            {/* Order Details */}
            <View style={styles.orderDetails}>
              <Text style={styles.orderId}>Order ID: #{order.id}</Text>
              <Text style={styles.itemCount}>Items: {order.count}</Text>
              <View style={styles.priceDetails}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Subtotal:</Text>
                  <Text style={styles.priceValue}>OMR {order.sub_total}</Text>
                </View>
                {parseFloat(order.discount) > 0 && (
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Discount:</Text>
                    <Text style={styles.discountValue}>-OMR {order.discount}</Text>
                  </View>
                )}
                <View style={[styles.priceRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValue}>OMR {order.grand_total}</Text>
                </View>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.orderActions}>
              <TouchableOpacity
                style={styles.viewDetailsButton}
                onPress={() => router.push(`/order/${order.id}`)}
              >
                <Text style={styles.viewDetailsText}>View details</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.orderAgainButton}
                onPress={() => handleOrderAgain(4)}
              >
                <Text style={styles.orderAgainText}>Order again</Text>
              </TouchableOpacity>
            </View>

            {/* Rating */}
            {/* <View style={styles.ratingContainer}>
              <Text style={styles.rateText}>Rate</Text>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => handleRate(order.id, star)}
                  >
                    <Ionicons
                      name="star-outline"
                      size={24}
                      color="#E97777"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View> */}
          </View>
        ))}
      </ScrollView>
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
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E07C7D',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: '#E97777',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
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
  orderDetails: {
    marginBottom: 16,
  },
  orderId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  priceDetails: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
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
    paddingTop: 8,
    marginTop: 8,
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
  itemsContainer: {
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    color: '#2C3639',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 14,
    color: '#E97777',
    fontWeight: '500',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  viewDetailsButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C3639',
    borderRadius: 4,
  },
  viewDetailsText: {
    color: '#2C3639',
    fontSize: 14,
    fontWeight: '500',
  },
  orderAgainButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#2C3639',
    borderRadius: 4,
  },
  orderAgainText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  rateText: {
    fontSize: 14,
    color: '#666',
    marginRight: 16,
  },
  stars: {
    flexDirection: 'row',
    gap: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3639',
    marginBottom: 20,
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C3639',
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#2C3639',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#2C3639',
    borderColor: '#2C3639',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
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
