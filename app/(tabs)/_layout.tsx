import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import useStore from '../store/useStore';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
export default function TabLayout() {

  const { basket } = useStore();
  const [user, setUser] = useState([]);

  const userData = async () => {
    const data = await SecureStore.getItemAsync('userData');
    if (data) {
      setUser(JSON.parse(data));
    }
  }

  useEffect(() => {
    userData();
  }, []);


  console.log('TabLayout');
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
          tabBarBadge: basket > 0 ? String(basket) : undefined,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'about',
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
    </Tabs>
  );
}