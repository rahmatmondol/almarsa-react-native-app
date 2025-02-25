import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/app/components/Header';
import Banner from '@/app/components/Banner';
import { useEffect, useState } from 'react';
import { apiService } from '@/app/(tabs)/services/apiService';

export default function Shop() {

  const [shopData, setShopData] = useState([]);
  const [shopItems, setShopItems] = useState([]);

  const getShop = async () => {
    const res = await apiService.getShop()
    setShopData(res.data[0])
    setShopItems(res.data[0].items)
  }

  useEffect(() => {
    getShop();
  }, [])

  return (
    <View style={styles.container}>
      <Header title='Home' />

      {/* Menu Grid */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* banner */}
        <Banner
          image={shopData.image || null}
          icon={shopData.icon || null}
        />

        <View style={styles.menuGrid}>
          {shopItems?.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => {
              router.push(`/category/${item.category_id}`)
            }}>
              <View style={styles.menuItemInner}>
                {item.icon !== 'bag-outline' ? (
                  <Image
                    source={{ uri: item.icon }}
                    style={styles.menuItemIcon}
                  />
                ) : (
                  <Ionicons name={item.icon} size={32} color="#E97777" />
                )}
                {item.ribbon && (
                  <View style={styles.ribbon}>
                    <Text style={styles.ribbonText}>NEW</Text>
                  </View>
                )}
                {item.stars && (
                  <View style={styles.stars}>
                    {[...Array(5)].map((_, i) => (
                      <Ionicons key={i} name="star" size={16} color="#E97777" />
                    ))}
                  </View>
                )}
                {item.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
                <Text style={styles.menuItemTitle}>{item.title}</Text>
              </View>
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

  content: {
    flex: 1,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  menuItem: {
    width: '50%',
    aspectRatio: 1,
    padding: 8,
  },
  menuItemInner: {
    flex: 1,
    backgroundColor: '#2C3639',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  menuItemTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
  },
  ribbon: {
    position: 'absolute',
    top: 12,
    right: -20,
    backgroundColor: '#E97777',
    paddingHorizontal: 16,
    paddingVertical: 4,
    transform: [{ rotate: '45deg' }],
  },
  ribbonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  badge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E97777',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  menuItemIcon: {
    width: 100,
    height: 100,
    objectFit: 'contain',
  },
});