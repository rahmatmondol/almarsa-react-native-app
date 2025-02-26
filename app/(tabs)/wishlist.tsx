import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Link, router } from 'expo-router';
import Header from '@/app/components/Header';
import { apiService } from '@/app/services/apiService';
import useStore from '@/app/store/useStore';

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { setWishlist, isAuthenticated, setBasket } = useStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
      return;
    }
    getWishlist();
  }, [isAuthenticated]);

  const getWishlist = async () => {
    try {
      setLoading(true);
      const res = await apiService.getWishlist();
      if (res.success) {
        setWishlist(res.product);
        setWishlistItems(res.product.items);
        setWishlist(res.product.items.length);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      setUpdating(true);
      const res = await apiService.removeFromWishlist(id);
      if (res.success) {
        setWishlist(res.wishlist);
        setWishlistItems(res.wishlist.items);
        setWishlist(res.wishlist.items.length);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddToCart = async (item) => {
    try {
      setUpdating(true);
      const res = await apiService.addToCart({
        product_id: item.product_id,
        quantity: 1
      });

      if (res.success) {
        // Remove from wishlist after adding to cart
        await handleRemoveItem(item.id);
        setBasket(res.cart.items.length);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2C3639" />
      </View>
    );
  }

  if (!wishlistItems.length) {
    return (
      <View style={styles.container}>
        <Header title="Wishlist" />
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Your wishlist is empty</Text>
          <Link href="/shop" asChild>
            <TouchableOpacity style={styles.shopButton}>
              <Text style={styles.shopButtonText}>START SHOPPING</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Wishlist" />

      <Text style={styles.summary}>
        {wishlistItems.length} Items
      </Text>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {wishlistItems.map(item => (
          <View key={item.id} style={styles.wishlistItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <View style={styles.itemPriceRow}>
                <Text style={styles.itemPrice}>
                  OMR {item.price}
                </Text>
                {item.discount > 0 && (
                  <Text style={styles.wasPrice}>save {item.discount}</Text>
                )}
              </View>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity 
                onPress={() => handleRemoveItem(item.id)}
                disabled={updating}
              >
                <Ionicons 
                  name="close-circle-outline" 
                  size={24} 
                  color={updating ? "#ccc" : "#E97777"} 
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={() => handleAddToCart(item)}
                disabled={updating}
              >
                <Ionicons 
                  name="cart-outline" 
                  size={24} 
                  color={updating ? "#ccc" : "#666"} 
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.actionButtons}>
        <Link href="/shop" asChild>
          <TouchableOpacity style={styles.continueButton}>
            <Text style={styles.continueButtonText}>BACK TO SHOP</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: '#E97777',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  summary: {
    padding: 16,
    fontSize: 16,
    color: '#2C3639',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  content: {
    flex: 1,
  },
  wishlistItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3639',
    marginBottom: 4,
  },
  itemPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E97777',
  },
  wasPrice: {
    fontSize: 12,
    color: '#666',
  },
  itemActions: {
    justifyContent: 'space-between',
    paddingLeft: 16,
    gap: 16,
  },
  addToCartButton: {
    padding: 4,
  },
  actionButtons: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  continueButton: {
    backgroundColor: '#2C3639',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});