import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { apiService } from '@/app/services/apiService';

export default function DrawerMenu({ onClose }: { onClose: () => void }) {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState<number | null>(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCategories();
      setCategories(response || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (categoryId: number) => {
    if (expandedCategory === categoryId) {
      router.push(`/category/${categoryId}`);
      onClose();
      setExpandedCategory(null);
      setExpandedSubcategory(null);
    } else {
      setExpandedCategory(categoryId);
      setExpandedSubcategory(null);
    }
  };

  const handleSubcategoryPress = (subcategoryId: number) => {
    if (expandedSubcategory === subcategoryId) {
      router.push(`/category/${subcategoryId}`);
      onClose();
      setExpandedSubcategory(null);
    } else {
      setExpandedSubcategory(subcategoryId);
    }
  };

  const handleItemPress = (category: any) => {
    router.push(`/category/${category.id}`);
    onClose();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E97777" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {categories.map((category) => (
          <View key={category.id}>
            <TouchableOpacity
              style={styles.categoryButton}
              onPress={() => handleCategoryPress(category.id)}
            >
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryText}>{category.name}</Text>
              </View>
              {category.children_recursive?.length > 0 && (
                <Ionicons
                  name={expandedCategory === category.id ? "chevron-up" : "chevron-down"}
                  size={24}
                  color="#E97777"
                />
              )}
            </TouchableOpacity>

            {expandedCategory === category.id && category.children_recursive?.length > 0 && (
              <View style={styles.subcategoriesContainer}>
                {category.children_recursive.map((subcategory) => (
                  <View key={subcategory.id}>
                    <TouchableOpacity
                      style={styles.subcategoryButton}
                      onPress={() => handleSubcategoryPress(subcategory.id)}
                    >
                      <View style={styles.subcategoryHeader}>
                        <Text style={styles.subcategoryText}>{subcategory.name}</Text>
                      </View>
                      {subcategory.children_recursive?.length > 0 && (
                        <Ionicons
                          name={expandedSubcategory === subcategory.id ? "chevron-up" : "chevron-down"}
                          size={20}
                          color="#E97777"
                        />
                      )}
                    </TouchableOpacity>

                    {expandedSubcategory === subcategory.id && subcategory.children_recursive?.length > 0 && (
                      <View style={styles.itemsContainer}>
                        {subcategory.children_recursive.map((item) => (
                          <TouchableOpacity
                            key={item.id}
                            style={styles.itemButton}
                            onPress={() => handleItemPress(item)}
                          >
                            <View style={styles.itemHeader}>
                              <Text style={styles.itemText}>{item.name}</Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3639',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C3639',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  content: {
    flex: 1,
  },
  categoryButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  categoryText: {
    color: '#E97777',
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  subcategoriesContainer: {
    backgroundColor: '#2C3639',
  },
  subcategoryButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  subcategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  subcategoryText: {
    color: '#E97777',
    fontSize: 18,
    flex: 1,
  },
  itemsContainer: {
  },
  itemButton: {
    paddingVertical: 10,
    paddingHorizontal: 48,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  productCount: {
    fontSize: 12,
    color: '#E97777',
    marginLeft: 8,
  },
});