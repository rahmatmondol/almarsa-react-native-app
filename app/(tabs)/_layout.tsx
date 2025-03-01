import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import useStore from '@/app/store/useStore';
import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { ref, onValue, off } from 'firebase/database';
import { database } from '@/firebaseConfig';

export default function TabLayout() {
  const { isAuthenticated, user, setUser, setBasket, setWishlist, basket, setNotifications } = useStore();

  const loadUserData = async () => {
    try {
      const [userData, basketCount, wishlistCount] = await Promise.all([
        SecureStore.getItemAsync('userData'),
        SecureStore.getItemAsync('basket'),
        SecureStore.getItemAsync('wishlist')
      ]);

      if (userData) {
        const parsedUserData = JSON.parse(userData);
        setUser({
          token: await SecureStore.getItemAsync('authToken') || '',
          data: parsedUserData
        });
        setBasket(parseInt(basketCount || '0', 10));
        setWishlist(parseInt(wishlistCount || '0', 10));
      } else {
        // logout();
        // router.replace('/auth');
      }
    } catch (error) {
      // console.error('Error loading user data:', error);
      // logout();
      // router.replace('/auth');
    }
  };

  useEffect(() => {
    // Fetch notifications data
    const startNotificationsListener = () => {
      const notificationsReference = ref(database, `notifications/user_${user?.data?.id}`);
      onValue(notificationsReference, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const notifications = Object.keys(data)
            .map((key) => ({
              id: key,
              ...data[key],
            }))
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          const unreadCount = notifications.filter(notification => !notification.read_at).length;
          setNotifications(unreadCount);
        }
      });
    }

    if (isAuthenticated) {
      startNotificationsListener();
    }


    if (!isAuthenticated) {
      loadUserData();
    }
  }, [isAuthenticated]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#2C3639',
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#E97777',
        tabBarInactiveTintColor: '#A5A5A5',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="basket"
        options={{
          title: 'Basket',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="basket" size={size} color={color} />
          ),
          tabBarBadge: basket > 0 ? basket.toString() : undefined,

        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="information-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: 'Contact',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="chatbubble-ellipses" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'My Account',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="change-email" options={{ href: null }} />
      <Tabs.Screen name="change-password" options={{ href: null }} />
      <Tabs.Screen name="edit-account" options={{ href: null }} />
      <Tabs.Screen name="checkout" options={{ href: null }} />
      <Tabs.Screen name="edit-address" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="orders" options={{ href: null }} />
      <Tabs.Screen name="search" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="shop" options={{ href: null }} />
      <Tabs.Screen name="category/[id]" options={{ href: null }} />
      <Tabs.Screen name="order/[id]" options={{ href: null }} />
      <Tabs.Screen name="wishlist" options={{ href: null }} />
      <Tabs.Screen name="product/[id]" options={{ href: null }} />
      <Tabs.Screen name="addresses" options={{ href: null }} />
      <Tabs.Screen name="add-address" options={{ href: null }} />
    </Tabs>
  );
}