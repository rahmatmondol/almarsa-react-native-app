import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Mock data for orders
const ORDERS = [
  {
    id: '536378282929',
    date: '2024-02-15',
    status: 'Delivered',
    type: 'Groceries',
    items: 5,
    total: 25.500,
  },
  {
    id: '536378282930',
    date: '2024-02-10',
    status: 'Delivered',
    type: 'Groceries',
    items: 3,
    total: 15.750,
  },
  {
    id: '536378282931',
    date: '2024-02-05',
    status: 'Delivered',
    type: 'Groceries',
    items: 4,
    total: 20.250,
  },
];

export default function OrderHistory() {
  const handleBack = () => {
    router.back();
  };

  const handleOrderAgain = (orderId: string) => {
    // Handle order again logic
    console.log('Order again:', orderId);
  };

  const handleRate = (orderId: string, rating: number) => {
    // Handle rating logic
    console.log('Rate order:', orderId, rating);
  };

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
        {ORDERS.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            {/* Order Header */}
            <View style={styles.orderHeader}>
              <Text style={styles.orderDate}>
                {new Date(order.date).toLocaleDateString()}
              </Text>
              <Text style={styles.orderStatus}>{order.status}</Text>
            </View>

            {/* Order Details */}
            <View style={styles.orderDetails}>
              <Text style={styles.orderType}>{order.type}</Text>
              <Text style={styles.orderId}>Order ID: {order.id}</Text>
              <Text style={styles.itemCount}>No. of items: {order.items}</Text>
              <Text style={styles.orderTotal}>OMR {order.total.toFixed(3)}</Text>
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
                onPress={() => handleOrderAgain(order.id)}
              >
                <Text style={styles.orderAgainText}>Order again</Text>
              </TouchableOpacity>
            </View>

            {/* Rating */}
            <View style={styles.ratingContainer}>
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
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    color: '#4CAF50',
    fontWeight: '500',
  },
  orderDetails: {
    marginBottom: 16,
  },
  orderType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3639',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E97777',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
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
});