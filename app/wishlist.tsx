import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Link, router } from 'expo-router';
import Header from '@/app/components/Header';
import { apiService } from '@/app/services/apiService';
import useStore from '@/app/store/useStore';

export default function Wishlist() {
    const [cart, setCart] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [editItem, setEditItem] = useState(null);
    const [editQuantity, setEditQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const { setWishlist } = useStore();
    // Fetch cart data
    const getCart = async () => {
        try {
            const res = await apiService.getWishlist();
            setCart(res.product);
            setCartItems(res.product.items);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCart();
    }, []);

    // Handle remove item
    const handleRemoveItem = async (id) => {
        try {
            const res = await apiService.removeFromWishlist(id);
            if (res.success) {
                setCart(res.wishlist);
                setCartItems(res.wishlist.items);
                setWishlist(res.wishlist.items.length);
            } else {
                alert(res.message);
            }

        } catch (error) {
            console.log(error);
        }
    };

    // Handle edit item
    const handleEditItem = (item) => {
        setEditItem(item);
        setEditQuantity(item.quantity);
    };

    // Handle save edit
    const handleSaveEdit = async () => {
        if (!editItem) return;
        try {
            const res = await apiService.updateWishlist({
                quantity: editQuantity,
                product_id: editItem.product_id
            });

            if (res.success) {
                setCart(res.wishlist);
                setCartItems(res.wishlist.items);
                setEditItem(null);
                setWishlist(res.wishlist.items.length);
            } else {
                alert(res.message);
            }

        } catch (error) {
            console.log(error);
        }
    };

    const handleQuantityChange = (increment) => {
        setEditQuantity(prev => Math.max(1, prev + increment));
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <Header title="cart" />

            {/* cart Summary */}
            <Text style={styles.summary}>
                {cartItems?.length} Items: ( {cart?.grand_total} OMR )
            </Text>

            {/* cart Items */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {cartItems?.map(item => (
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
                            <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
                                <Ionicons name="close-circle-outline" size={24} color="#E97777" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => handleEditItem(item)}
                            >
                                <Ionicons name="chevron-down" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
                <Link href="/shop" asChild>
                    <TouchableOpacity style={styles.continueButton} onPress={() => router.push('/shop')}>
                        <Text style={styles.continueButtonText}>BACK TO SHOP</Text>
                    </TouchableOpacity>
                </Link>
                <TouchableOpacity style={styles.checkoutButton} onPress={() => router.push('/checkout')}>
                    <Text style={styles.checkoutButtonText}>CHECKOUT</Text>
                </TouchableOpacity>
            </View>

            {/* Edit Item Modal */}
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
                                        OMR {(editItem.price * editQuantity).toFixed(2)}
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.saveButton}
                                        onPress={handleSaveEdit}
                                    >
                                        <Text style={styles.saveButtonText}>Save</Text>
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
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    heroTitle: {
        position: 'absolute',
        bottom: 24,
        width: '100%',
        textAlign: 'center',
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
    },
    heroTitleAccent: {
        color: '#E97777',
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
    itemDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
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
    editItemDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
        textAlign: 'center',
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
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    wasPrice: {
        fontSize: 12,
        color: '#666',
        marginLeft: -10,
    },
});