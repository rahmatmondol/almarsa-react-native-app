import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function Checkout() {
  const [selectedPayment, setSelectedPayment] = useState('visa');

  const handleBack = () => {
    router.back();
  };

  const handlePlaceOrder = () => {
    // Handle order placement
    router.replace('/(tabs)');
  };

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
          <Text style={styles.addressText}>address details here</Text>
          <TouchableOpacity>
            <Text style={styles.changeLink}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Delivery Time */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={24} color="#2C3639" />
            <Text style={styles.sectionTitle}>Delivery time</Text>
          </View>
          <Text style={styles.timeText}>00:00:00</Text>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pay with</Text>

          <TouchableOpacity 
            style={[
              styles.paymentOption,
              selectedPayment === 'visa' && styles.paymentOptionSelected
            ]}
            onPress={() => setSelectedPayment('visa')}
          >
            <Text style={styles.paymentText}>visa xxx- 1876</Text>
            <View style={styles.radio}>
              {selectedPayment === 'visa' && <View style={styles.radioSelected} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.paymentOption,
              selectedPayment === 'new' && styles.paymentOptionSelected
            ]}
            onPress={() => setSelectedPayment('new')}
          >
            <Text style={styles.paymentText}>Add new card</Text>
            <View style={styles.radio}>
              {selectedPayment === 'new' && <View style={styles.radioSelected} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.paymentOption,
              selectedPayment === 'cash' && styles.paymentOptionSelected
            ]}
            onPress={() => setSelectedPayment('cash')}
          >
            <Text style={styles.paymentText}>Cash</Text>
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
            <Text style={styles.summaryValue}>OMR 35.500</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Discount</Text>
            <Text style={styles.summaryValue}>-OMR 5.000</Text>
          </View>

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>OMR 30.500</Text>
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
        style={styles.placeOrderButton}
        onPress={handlePlaceOrder}
      >
        <Text style={styles.placeOrderText}>PLACE ORDER</Text>
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
  timeText: {
    fontSize: 14,
    color: '#666',
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
});