import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import Header from '@/app/components/Header';
import Banner from '@/app/components/Banner';
import { useCallback, useState } from 'react';
import { apiService } from '@/app/services/apiService';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ProductCart from '@/app/components/ProductCart';

export default function CategoryArchive() {
  const { id } = useLocalSearchParams();
  const [products, setProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [page, setPage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const LIMIT = 12;

  const getData = useCallback(async (currentOffset = 0) => {
    try {
      setLoading(true);
      setError(null);
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
      console.error('Error fetching category data:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id, LIMIT]);

  // Use useFocusEffect to reload data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Reset pagination when screen comes into focus
      setOffset(0);
      getData(0);

      return () => {
        // Optional cleanup function
      };
    }, [getData])
  );

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
    if (!loading || products.length === 0) return null;
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#E97777" />
      </View>
    );
  };

  const ListEmptyComponent = () => (
    <View style={styles.noResultsContainer}>
      {error ? (
        <>
          <Text style={styles.noResultsText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => getData(0)}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.noResultsText}>
          {loading ? "Loading..." : "No products found"}
        </Text>
      )}
    </View>
  );

  const FilterSection = () => (
    <View style={styles.filters}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity style={[styles.filterButton, styles.filterButtonActive]}>
          <Text style={styles.filterButtonText}>All Products</Text>
        </TouchableOpacity>
        {subCategories?.map((subCategory) => (
          <TouchableOpacity
            key={subCategory.id}
            style={styles.filterButton}
            onPress={() => router.push(`/category/${subCategory.id}`)}
          >
            <Text style={styles.filterButtonText}>{subCategory.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <Header title={page.name || 'Category'} />

      <FlatList
        data={products}
        renderItem={renderProductCard}
        keyExtractor={item => item.id?.toString()}
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
        refreshing={loading && offset === 0}
        onRefresh={() => {
          setOffset(0);
          getData(0);
        }}
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
    paddingBottom: 20,
    flexGrow: 1,
  },
  columnWrapperStyle: {
    gap: 16,
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginTop: 16,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 300,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#E97777',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
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
  filterButtonActive: {
    backgroundColor: '#E97777',
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