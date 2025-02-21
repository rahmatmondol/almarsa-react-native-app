import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { router } from 'expo-router';

const MENU_ITEMS = {
  'FRUIT AND VEG': {
    ALL: null,
    VEGATABLES: {
      'Farm Veggie Box': null,
      'Chilled Vegetables': null,
      'Frozen Vegetables': null,
      'Canned & Jarred Vegetables': null,
      'Pickled Vegetables': null,
      'Cresses & Herbs': null,
      'Edible Flowers': null,
      'Salads & Leaves': null,
      'Mushrooms & Truffle': null,
      'Olives': null,
    },
    FRUITS: {
      'Frozen Fruits': null,
      'Canned Fruits': null,
    }
  },
  'BUTCHERY': null,
  'SEA FOOD': null,
  'DAIRY': null,
  'PANTRY': null,
  'BEVERAGES': null,
  'BAKERY AND PASTRY': null,
};

export default function DrawerMenu({ onClose }: { onClose: () => void }) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null);

  const handleCategoryPress = (category: string) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
      setExpandedSubcategory(null);
    } else {
      setExpandedCategory(category);
      setExpandedSubcategory(null);
    }
  };

  const handleSubcategoryPress = (subcategory: string) => {
    if (expandedSubcategory === subcategory) {
      setExpandedSubcategory(null);
    } else {
      setExpandedSubcategory(subcategory);
    }
  };

  const handleItemPress = (category: string, subcategory?: string, item?: string) => {
    // Handle navigation here
    router.push(`/category/${category.toLowerCase()}`);
    onClose();
  };

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
        {Object.entries(MENU_ITEMS).map(([category, subcategories]) => (
          <View key={category}>
            <TouchableOpacity
              style={styles.categoryButton}
              onPress={() => handleCategoryPress(category)}
            >
              <Text style={styles.categoryText}>{category}</Text>
              {subcategories && (
                <Ionicons
                  name={expandedCategory === category ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color="#E97777"
                />
              )}
            </TouchableOpacity>

            {expandedCategory === category && subcategories && (
              <View style={styles.subcategoriesContainer}>
                {Object.entries(subcategories).map(([subcategory, items]) => (
                  <View key={subcategory}>
                    <TouchableOpacity
                      style={styles.subcategoryButton}
                      onPress={() => handleSubcategoryPress(subcategory)}
                    >
                      <Text style={styles.subcategoryText}>{subcategory}</Text>
                      {items && (
                        <Ionicons
                          name={expandedSubcategory === subcategory ? 'chevron-up' : 'chevron-down'}
                          size={20}
                          color="#E97777"
                        />
                      )}
                    </TouchableOpacity>

                    {expandedSubcategory === subcategory && items && (
                      <View style={styles.itemsContainer}>
                        {Object.keys(items).map((item) => (
                          <TouchableOpacity
                            key={item}
                            style={styles.itemButton}
                            onPress={() => handleItemPress(category, subcategory, item)}
                          >
                            <Text style={styles.itemText}>{item}</Text>
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
  categoryText: {
    color: '#E97777',
    fontSize: 16,
    fontWeight: '600',
  },
  subcategoriesContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  subcategoryButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  subcategoryText: {
    color: '#fff',
    fontSize: 14,
  },
  itemsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  itemButton: {
    paddingVertical: 10,
    paddingHorizontal: 48,
  },
  itemText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
});