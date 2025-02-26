import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Link, router } from 'expo-router';
import Header from '../components/Header';
import { apiService } from '../services/apiService';
import useStore from '../store/useStore';

export default function Basket() {
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [editQuantity, setEditQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { setBasket, isAuthenticated } = useStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
      return;
    }
    getCart();
  }, [isAuthenticated]);

  const getCart = async () => {
    try {
      setLoading(true);
      const res = await apiService.getCart();
      if (res.success) {
        setCart(res.product);
        setCartItems(res.product.items);
        setBasket(res.product.items.length);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      setUpdating(true);
      const res = await apiService.removeFromCart(id);
      if (res.success) {
        setCart(res.cart);
        setCartItems(res.cart.items);
        setBasket(res.cart.items.length);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleEditItem = (item) => {
    setEditItem(item);
    setEditQuantity(item.quantity);
  };

  const handleSaveEdit = async () => {
    if (!editItem) return;
    try {
      setUpdating(true);
      const res = await apiService.updateCart({
        quantity: editQuantity,
        product_id: editItem.product_id
      });

      if (res.success) {
        setCart(res.cart);
        setCartItems(res.cart.items);
        setEditItem(null);
        setBasket(res.cart.items.length);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleQuantityChange = (increment) => {
    setEditQuantity(prev => Math.max(1, prev + increment));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2C3639" />
      </View>
    );
  }

  if (!cartItems.length) {
    return (
      <View style={styles.container}>
        <Header title="Basket" />
        <View style={styles.emptyContainer}>
          <Ionicons name="basket-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Your basket is empty</Text>
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
      <Header title="Basket" />

      <Text style={styles.summary}>
        {cartItems.length} Items: (OMR {cart?.grand_total})
      </Text>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {cartItems.map(item => (
          <View key={item.id} style={styles.cartItem}>
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
                <Text style={styles.itemQuantity}>
                  X {item.quantity}
                </Text>
                <Text style={styles.itemPrice}>
                  OMR {item.sub_total}
                </Text>
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
                style={styles.editButton}
                onPress={() => handleEditItem(item)}
                disabled={updating}
              >
                <Ionicons 
                  name="chevron-down" 
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
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={() => router.push('/checkout')}
        >
          <Text style={styles.checkoutButtonText}>CHECKOUT</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={editItem !== null}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>EDIT ITEM</Text>
              <TouchableOpacity onPress={() => setEditItem(null)}>
                <Ionicons name="close" size={24} color="#2C3639" />
              </TouchableOpacity>
            </View>

            {editItem && (
              <View style={styles.editItemContent}>
                <Image source={{ uri: editItem.image }} style={styles.editItemImage} />
                <Text style={styles.editItemTitle}>{editItem.name}</Text>
                <Text style={styles.editItemPrice}>OMR {editItem.price}</Text>

                <View style={styles.quantitySelector}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(-1)}
                  >
                    <Text style={styles.quantityButtonText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{editQuantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(1)}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.modalActions}>
                  <Text style={styles.totalPrice}>
                    OMR {(editItem.price * editQuantity).toFixed(3)}
                  </Text>
                  <TouchableOpacity
                    style={[styles.saveButton, updating && styles.buttonDisabled]}
                    onPress={handleSaveEdit}
                    disabled={updating}
                  >
                    {updating ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.saveButtonText}>Save</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
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
  cartItem: {
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
    justifyContent: 'space-between',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E97777',
  },
  wasPrice: {
    fontSize: 12,
    color: '#666',
    marginLeft: -10,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  itemActions: {
    justifyContent: 'space-between',
    paddingLeft: 16,
  },
  editButton: {
    padding: 4,
  },
  actionButtons: {
    padding: 16,
    gap: 8,
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
  checkoutButton: {
    backgroundColor: '#E97777',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3639',
  },
  editItemContent: {
    alignItems: 'center',
  },
  editItemImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 16,
  },
  editItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3639',
    marginBottom: 4,
  },
  editItemPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E97777',
    marginBottom: 24,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginBottom: 32,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2C3639',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '300',
  },
  quantity: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3639',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: '600',
    color: '#E97777',
  },
  saveButton: {
    backgroundColor: '#E97777',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 100,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});