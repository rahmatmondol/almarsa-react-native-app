import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Mock data for order details
const ORDER_DETAILS = {
  id: '536378282929',
  date: '2024-02-15',
  status: 'Delivered',
  type: 'Groceries',
  delivery: {
    address: 'Building 123, Street 456, Block 789',
    city: 'Muscat',
    country: 'Oman',
  },
  items: [
    { id: 1, name: 'Farm Veggie Box', price: 3.500 },
    { id: 2, name: 'Organic Mix', price: 3.500 },
    { id: 3, name: 'Premium Selection', price: 3.500 },
    { id: 4, name: 'Fresh Produce Pack', price: 3.500 },
    { id: 5, name: 'Seasonal Vegetables', price: 3.500 },
    { id: 6, name: 'Mixed Herbs', price: 3.500 },
    { id: 7, name: 'Fruit Selection', price: 3.500 },
    { id: 8, name: 'Root Vegetables', price: 3.500 },
    { id: 9, name: 'Leafy Greens', price: 3.500 },
    { id: 10, name: 'Fresh Herbs', price: 3.500 },
  ],
  summary: {
    subtotal: 35.000,
    tax: 1.750,
    delivery: 2.000,
    total: 38.750,
    payment: 'VISA **** 1234',
  },
};

export default function OrderDetails() {
  const { id } = useLocalSearchParams();

  const handleBack = () => {
    router.back();
  };

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
        {/* Order Info */}
        <View style={styles.section}>
          <View style={styles.orderStatus}>
            <Text style={styles.statusText}>{ORDER_DETAILS.status}</Text>
            <Text style={styles.dateText}>
              {new Date(ORDER_DETAILS.date).toLocaleDateString()}
            </Text>
          </View>
          <Text style={styles.orderType}>{ORDER_DETAILS.type}</Text>
          <Text style={styles.orderId}>Order ID: {ORDER_DETAILS.id}</Text>
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={24} color="#2C3639" />
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>
          <Text style={styles.addressText}>{ORDER_DETAILS.delivery.address}</Text>
          <Text style={styles.addressText}>{ORDER_DETAILS.delivery.city}</Text>
          <Text style={styles.addressText}>{ORDER_DETAILS.delivery.country}</Text>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          
          {/* Items */}
          <View style={styles.itemsList}>
            {ORDER_DETAILS.items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>
                  OMR {item.price.toFixed(3)}
                </Text>
              </View>
            ))}
          </View>

          {/* Totals */}
          <View style={styles.totalsSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>
                OMR {ORDER_DETAILS.summary.subtotal.toFixed(3)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax</Text>
              <Text style={styles.totalValue}>
                OMR {ORDER_DETAILS.summary.tax.toFixed(3)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Delivery Fee</Text>
              <Text style={styles.totalValue}>
                OMR {ORDER_DETAILS.summary.delivery.toFixed(3)}
              </Text>
            </View>
            <View style={[styles.totalRow, styles.grandTotal]}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalValue}>
                OMR {ORDER_DETAILS.summary.total.toFixed(3)}
              </Text>
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.paymentSection}>
            <Text style={styles.paymentLabel}>Payment Method</Text>
            <View style={styles.paymentInfo}>
              <Ionicons name="card-outline" size={24} color="#2C3639" />
              <Text style={styles.paymentText}>
                {ORDER_DETAILS.summary.payment}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Button */}
      <TouchableOpacity 
        style={styles.orderAgainButton}
        onPress={() => console.log('Order again')}
      >
        <Text style={styles.orderAgainText}>ORDER AGAIN</Text>
      </TouchableOpacity>
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
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  orderStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  orderType: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3639',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 14,
    color: '#666',
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
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3639',
    marginBottom: 16,
  },
  itemsList: {
    marginBottom: 24,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 14,
    color: '#2C3639',
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    color: '#2C3639',
    fontWeight: '500',
  },
  totalsSection: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
    marginBottom: 24,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalValue: {
    fontSize: 14,
    color: '#2C3639',
  },
  grandTotal: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginTop: 12,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3639',
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E97777',
  },
  paymentSection: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paymentText: {
    fontSize: 14,
    color: '#2C3639',
  },
  orderAgainButton: {
    backgroundColor: '#E97777',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  orderAgainText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});