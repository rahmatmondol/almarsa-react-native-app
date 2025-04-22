import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ref, onValue, update, off } from 'firebase/database';
import { database } from '../../firebaseConfig';
import { useEffect, useState, useCallback, useMemo } from 'react';
import useStore from '../store/useStore';

export default function Notifications() {
  const { user, setNotifications } = useStore();
  const [allNotifications, setAllNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications on component mount
  useEffect(() => {
    if (!user?.data?.id) {
      setLoading(false);
      return;
    }

    const notificationsRef = ref(database, `notifications/user_${user.data.id}`);

    const fetchNotifications = onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert Firebase object to an array and sort by date (newest first)
        const firebaseNotifications = Object.keys(data)
          .map((key) => ({
            id: key,
            ...data[key],
          }))
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        // Calculate unread count
        const unreadCount = firebaseNotifications.filter(notification => !notification.read_at).length;
        setNotifications(unreadCount);
        setAllNotifications(firebaseNotifications);
      } else {
        setAllNotifications([]);
        setNotifications(0);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    });

    // Clean up listener on unmount
    return () => off(notificationsRef);
  }, [user, setNotifications]);

  // Mark notification as read
  const markAsRead = useCallback((notification) => {
    if (!user?.data?.id) return;

    const notificationRef = ref(database, `notifications/user_${user.data.id}/${notification.id}`);
    const now = new Date().toISOString();

    update(notificationRef, { read_at: now })
      .then(() => {
        // Update local state
        setAllNotifications((prevNotifications) =>
          prevNotifications.map((prevNotification) =>
            prevNotification.id === notification.id
              ? { ...prevNotification, read_at: now }
              : prevNotification
          )
        );

        // Update unread count
        const unreadCount = allNotifications.filter(notification => !notification.read_at).length - 1;
        setNotifications(unreadCount);

        // Navigate to order details if applicable
        if (notification.data.order_id) {
          router.push(`/order/${notification.data.order_id}`);
        }
      })
      .catch((error) => {
        console.error('Error marking notification as read:', error);
      });
  }, [user, allNotifications, setNotifications]);

  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    const grouped = {};
    allNotifications.forEach((notification) => {
      const date = new Date(notification.created_at).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(notification);
    });
    return grouped;
  }, [allNotifications]);

  // Handle navigation back
  const handleBack = useCallback(() => {
    router.back();
  }, []);

  // Render a notification item
  const renderNotificationItem = useCallback((notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationItem,
        !notification.read_at && styles.newNotification,
      ]}
      onPress={() => markAsRead(notification)}
    >
      <Text style={styles.notificationText}>
        {notification.data.message}
      </Text>
      {notification.data.order_id && (
        <Text style={styles.notificationOrderText}>
          Order ID: #{notification.data.order_id}
        </Text>
      )}
      {!notification.read_at && (
        <View style={styles.unreadIndicator} />
      )}
      <Text style={styles.timeText}>
        {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </TouchableOpacity>
  ), [markAsRead]);

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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2C3639" />
        </View>
      ) : allNotifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No notifications yet</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {Object.keys(groupedNotifications).map((date) => (
            <View style={styles.section} key={date}>
              <Text style={styles.sectionTitle}>{date}</Text>
              {groupedNotifications[date].map(renderNotificationItem)}
            </View>
          ))}
        </ScrollView>
      )}
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
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
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3639',
    paddingHorizontal: 16,
    marginBottom: 8,
    marginTop: 4,
  },
  notificationItem: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    position: 'relative',
  },
  newNotification: {
    backgroundColor: '#F8F8FF',
  },
  notificationOrderText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontWeight: '600',
  },
  notificationText: {
    fontSize: 14,
    color: '#2C3639',
    lineHeight: 20,
    paddingRight: 12,
  },
  unreadIndicator: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});