import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import Banner from '../components/Banner';
import { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function CategoryArchive() {
  const { id } = useLocalSearchParams();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const LIMIT = 12;

  const getData = async (currentOffset = 0) => {
    try {
      setLoading(true);
      const res = await apiService.getCategoryArchive(id, LIMIT, currentOffset);

      if (currentOffset === 0) {
        setProducts(res.products);
        setPage(res.category);
      } else {
        setProducts(prev => [...prev, ...res.products]);
      }

      setTotalResults(res.totalResults);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleLoadMore = () => {
    if (!loading && products.length < totalResults) {
      const nextOffset = offset + LIMIT;
      setOffset(nextOffset);
      getData(nextOffset);
    }
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image
        source={{ uri: item.media.mainMedia.image.url }}
        style={styles.productImage}
      />
      <View style={styles.productContent}>
        <Text style={styles.productTitle}>{item.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>OMR {item.price.discountedPrice}</Text>
          {item.discount.value > 0 && (
            <Text style={styles.wasPrice}>was {item.price.price}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#E97777" />
      </View>
    );
  };

  const ListEmptyComponent = () => (
    <Text style={styles.noProducts}>
      {loading ? "Loading..." : "No products found"}
    </Text>
  );

  const FilterSection = () => (
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
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <Header title={'Fruit & Veg'} />

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.grid}
        ListHeaderComponent={
          <>
            <Banner
              title={page.name}
              image={page.image}
              icon={page.icon}
            />
            <FilterSection />
          </>
        }
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  grid: {
    padding: 0,
  },
  productCard: {
    flex: 1,
    margin: 8,
    maxWidth: '50%',
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
  noProducts: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 16,
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
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});