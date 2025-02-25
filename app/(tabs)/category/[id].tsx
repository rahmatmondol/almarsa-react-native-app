import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Header from '../../components/Header';
import Banner from '../../components/Banner';
import { useEffect, useState } from 'react';
import { apiService } from '@/app/(tabs)/services/apiService';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ProductCart from '@/app/components/ProductCart';

export default function CategoryArchive() {
  const { id } = useLocalSearchParams();
  const [products, setProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
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
        setSubCategories(res.subcategories);
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

  const renderProductCard = ({ item }) => (
    <ProductCart item={item} key={item.id} />
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
        {subCategories?.map((subCategory) => (
          <TouchableOpacity key={subCategory.id} style={styles.filterButton} onPress={() => router.push(`/category/${subCategory.id}`)}>
            <Text style={styles.filterButtonText}>{subCategory.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <Header title={'Fruit & Veg'} />

      <FlatList
        data={products}
        renderItem={renderProductCard}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.columnWrapperStyle}
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
  },
  columnWrapperStyle: {
    gap: 16,
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginTop: 16,
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

  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
});