import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Mock data for notifications
const NOTIFICATIONS = {
  new: [
    { id: 1, message: 'Your order #536378282929 has been delivered' },
    { id: 2, message: 'New seasonal vegetables available in store' },
    { id: 3, message: 'Weekend special: 20% off on all organic products' },
  ],
  today: [
    { id: 4, message: 'Your order #536378282930 is out for delivery' },
    { id: 5, message: 'Limited time offer: Free delivery on orders above OMR 20' },
  ],
  past: [
    { id: 6, message: 'Thank you for your recent purchase' },
    { id: 7, message: 'Rate your last order to earn points' },
  ],
};

export default function Notifications() {
  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#2C3639" />
          <Text style={styles.headerTitle}>Notifications</Text>
        </TouchableOpacity>
        <Ionicons name="notifications-outline" size={24} color="#2C3639" />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* New Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NEW</Text>
          {NOTIFICATIONS.new.map((notification) => (
            <TouchableOpacity 
              key={notification.id} 
              style={[styles.notificationItem, styles.newNotification]}
            >
              <Text style={styles.notificationText}>
                {notification.message}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Today's Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TODAY</Text>
          {NOTIFICATIONS.today.map((notification) => (
            <TouchableOpacity 
              key={notification.id} 
              style={styles.notificationItem}
            >
              <Text style={styles.notificationText}>
                {notification.message}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Past Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12/10/2024</Text>
          {NOTIFICATIONS.past.map((notification) => (
            <TouchableOpacity 
              key={notification.id} 
              style={styles.notificationItem}
            >
              <Text style={styles.notificationText}>
                {notification.message}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3639',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  notificationItem: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  newNotification: {
    backgroundColor: '#FFE5E5',
  },
  notificationText: {
    fontSize: 14,
    color: '#2C3639',
    lineHeight: 20,
  },
});