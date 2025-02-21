import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Link , router, useRouter} from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from './components/Header';
import Banner from './components/Banner';

const MENU_ITEMS = [
  {
    id: 'main-shop',
    title: 'MAIN SHOP',
    icon: 'cart-outline',
  },
  {
    id: 'new-week',
    title: 'NEW THIS WEEK',
    ribbon: true,
  },
  {
    id: 'best-seller',
    title: 'BEST SELLER',
    stars: true,
  },
  {
    id: 'special-deals',
    title: 'SPECIAL DEALS',
    badge: 'SPECIAL',
  },
  {
    id: 'deal-day',
    title: 'DEAL OF THE DAY',
    badge: 'DEAL',
  },
  {
    id: 'healthy',
    title: 'GO HEALTHY',
    icon: 'leaf-outline',
  },
  {
    id: 'world-foods',
    title: 'WORLD FOODS',
    icon: 'globe-outline',
  },
  {
    id: 'connoisseur',
    title: "CONNOISSEUR'S CHOICE",
    icon: 'restaurant-outline',
  },
  {
    id: 'gift',
    title: 'SAY IT WITH A GIFT',
    icon: 'gift-outline',
  },
];

export default function Home() {

  const handleMenuItemPress = (item) => {
   
    //navigate to the corresponding screen
    router.push(`/category/${item.id}`);

  };

  return (
    <View style={styles.container}>
      <Header title='Shop' />

      {/* Menu Grid */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* banner */}
        <Banner />

        <View style={styles.menuGrid}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => handleMenuItemPress(item)}>
              <View style={styles.menuItemInner}>
                {item.icon && (
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
});