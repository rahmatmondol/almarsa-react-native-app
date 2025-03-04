import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import Header from '@/app/components/Header';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';
import useStore from '@/app/store/useStore';

export default function Account() {
  const { user, logout, isAuthenticated } = useStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      // Clear all secure storage
      await Promise.all([
        SecureStore.deleteItemAsync('authToken'),
        SecureStore.deleteItemAsync('userData'),
        SecureStore.deleteItemAsync('basket'),
        SecureStore.deleteItemAsync('wishlist')
      ]);

      // Clear global state
      logout();

      // Navigate to auth
      router.push('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout even if there's an error clearing storage
      logout();
      router.push('/auth');
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <Header title="My Account" />
      {/* Header */}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>


        {/* Contact Information */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.infoItem}>
            <Ionicons name="mail-outline" size={24} color="#666" />
            <Text style={styles.infoText}>{user?.data.email || 'N/A'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoItem}>
            <Ionicons name="call-outline" size={24} color="#666" />
            <Text style={styles.infoText}>{user?.data.phone || 'N/A'}</Text>
          </TouchableOpacity>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/orders')}>
            <View style={styles.actionIcon}>
              <Ionicons name="document-text-outline" size={24} color="#E97777" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Order History</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/edit-account')}>
            <View style={styles.actionIcon}>
              <Ionicons name="person-outline" size={24} color="#E97777" />
            </View>

            <View style={styles.actionContent}>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}> Edit My Account</Text>
                <Ionicons name="chevron-forward" size={24} color="#666" />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/(tabs)/addresses')}>
            <View style={styles.actionIcon}>
              <Ionicons name="location-outline" size={24} color="#E97777" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Delivery Addresses</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/notifications')}>
            <View style={styles.actionIcon}>
              <Ionicons name="notifications-outline" size={24} color="#E97777" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Notifications</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/settings')}>
            <View style={styles.actionIcon}>
              <Ionicons name="settings-outline" size={24} color="#E97777" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Settings</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Shop Button */}
        <Link href="/shop" asChild>
          <TouchableOpacity style={styles.shopButton}>
            <Text style={styles.shopButtonText}>GO TO SHOP</Text>
          </TouchableOpacity>
        </Link>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => handleLogout()}>
          <Text style={styles.logoutButtonText}>LOGOUT</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroSection: {
    height: 200,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C3639',
    flexDirection: 'column',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  userInfo: {
    position: 'absolute',
    bottom: 24,
    width: '100%',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 8,
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(233, 119, 119, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionTitle: {
    fontSize: 16,
    color: '#2C3639',
    fontWeight: '500',
  },
  shopButton: {
    backgroundColor: '#2C3639',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#E97777',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});