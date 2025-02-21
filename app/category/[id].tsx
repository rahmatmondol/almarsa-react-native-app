import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import Banner from '../components/Banner';

const PRODUCTS = [
  {
    id: '1',
    title: 'Farm Veggie Box',
    price: 3.700,
    wasPrice: 5.700,
    image: 'https://images.unsplash.com/photo-1557844352-761f2565b576?w=800&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Chilled Vegetables',
    price: 3.700,
    wasPrice: 5.700,
    image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=800&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Fresh Organic Mix',
    price: 3.700,
    wasPrice: 5.700,
    image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800&auto=format&fit=crop',
  },
  {
    id: '4',
    title: 'Seasonal Selection',
    price: 3.700,
    wasPrice: 5.700,
    image: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=800&auto=format&fit=crop',
  },
  {
    id: '5',
    title: 'Premium Vegetables',
    price: 3.700,
    wasPrice: 5.700,
    image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=800&auto=format&fit=crop',
  },
  {
    id: '6',
    title: 'Garden Fresh Box',
    price: 3.700,
    wasPrice: 5.700,
    image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800&auto=format&fit=crop',
  },
];

const CATEGORIES = {
  'fruit-veg': {
    title: 'FRUIT & VEG',
    icon: 'leaf-outline',
    image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=1200&auto=format&fit=crop',
  },
  'butchery': {
    title: 'BUTCHERY',
    icon: 'restaurant-outline',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1200&auto=format&fit=crop',
  },
  // Add other categories as needed
};

export default function CategoryArchive() {
  const { id } = useLocalSearchParams();
  const category = CATEGORIES[id as keyof typeof CATEGORIES];

  const handleBack = () => {
    router.back();
  };


  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title={'Fruit & Veg'} />

      {/* Products Grid */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Banner />

        <View style={styles.filters}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Farm veggie box</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Chilled Vegetables</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Fresh Produce</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.grid}>
          {PRODUCTS.map((product) => (
            <TouchableOpacity key={product.id} style={styles.productCard} onPress={() => router.push(`/product/${product.id}`)}>
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <View style={styles.productContent}>
                <Text style={styles.productTitle}>{product.title}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>OMR {product.price.toFixed(3)}</Text>
                  <Text style={styles.wasPrice}>was {product.wasPrice.toFixed(3)}</Text>
                </View>
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
  header: {
    backgroundColor: '#2C3639',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },
  logo: {
    width: 120,
    height: 40,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 16,
  },
  heroSection: {
    height: 200,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 24,
    width: '100%',
    alignItems: 'center',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(233, 119, 119, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  content: {
    flex: 1,
  },
  filters: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2C3639',
    borderRadius: 20,
    marginHorizontal: 8,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  productCard: {
    width: '50%',
    padding: 8,
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  productContent: {
    padding: 8,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    color: '#E97777',
    fontSize: 16,
    fontWeight: '600',
  },
  wasPrice: {
    color: '#999',
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
});