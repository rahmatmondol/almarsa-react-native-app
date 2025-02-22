import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../services/apiService';

const PRODUCTS =
{
    id: '1',
    title: 'Coffee Capsules "Cremoso"',
    price: 3.700,
    wasPrice: 5.700,
    image: 'https://images.unsplash.com/photo-1557844352-761f2565b576?w=800&auto=format&fit=crop',
    category: 'FROZEN',
    details: {
        compatibility: 'Nespresso Compatible',
        cupSize: 'Espresso',
        cupWeight: '5g',
        intensity: '04/12',
        brand: 'Rioba',
        packing: '11 capsules',
        origin: 'Italy',
        type: 'Dry Product'
    }
}

export default function ProductPage() {
    const { id } = useLocalSearchParams();
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    // const [product, setProduct] = useState([]);
    const [product, setProduct] = useState(PRODUCTS);


    const getData = async (currentOffset = 0) => {
        try {
            const res = await apiService.getProduct(id);
            // setProduct(res[0]);
            console.log(res);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const handleBack = () => {
        router.back();
    };

    const handleClose = () => {
        router.back();
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const incrementQuantity = () => {
        setQuantity(quantity + 1);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack}>
                    <Ionicons name="chevron-back" size={24} color="#2C3639" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleClose}>
                    <Ionicons name="close" size={24} color="#2C3639" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2C3639" />
                </View>
            ) : (
                <>
                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Product Image */}
                        <Image source={{ uri: product.image }} style={styles.productImage} />

                        {/* Product Info */}
                        <View style={styles.productInfo}>
                            <Text style={styles.title}>{product.title}</Text>
                            <View style={styles.priceContainer}>
                                <Text style={styles.price}>OMR {product.price.toFixed(3)}</Text>
                                <Text style={styles.wasPrice}>was {product.wasPrice.toFixed(3)}</Text>
                            </View>

                            {/* Quantity Selector */}
                            <View style={styles.quantitySelector}>
                                <TouchableOpacity onPress={decrementQuantity} style={styles.quantityButton}>
                                    <Text style={styles.quantityButtonText}>−</Text>
                                </TouchableOpacity>
                                <Text style={styles.quantity}>{quantity}</Text>
                                <TouchableOpacity onPress={incrementQuantity} style={styles.quantityButton}>
                                    <Text style={styles.quantityButtonText}>+</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Product Details */}
                            <View style={styles.detailsSection}>
                                <Text style={styles.sectionTitle}>PRODUCT INFO</Text>
                                <Text style={styles.categoryTag}>{product.category}</Text>
                                <View style={styles.details}>
                                    <Text style={styles.detailText}>{product.details.compatibility}</Text>
                                    <Text style={styles.detailText}>Cup Size: {product.details.cupSize}</Text>
                                    <Text style={styles.detailText}>Cup Weight: {product.details.cupWeight}</Text>
                                    <Text style={styles.detailText}>Intensity: {product.details.intensity}</Text>
                                    <Text style={styles.detailText}>Brand: {product.details.brand}</Text>
                                    <Text style={styles.detailText}>Packing: {product.details.packing}</Text>
                                    <Text style={styles.detailText}>Origin: {product.details.origin}</Text>
                                    <Text style={styles.detailText}>{product.details.type}</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.wishlistButton}>
                            <Text style={styles.wishlistButtonText}>ADD TO WISHLIST</Text>
                            <Ionicons name="heart-outline" size={24} color="#2C3639" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.basketButton}>
                            <Text style={styles.basketButtonText}>ADD TO BASKET</Text>
                            <Ionicons name="basket-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </>
            )}


        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 48,
        paddingBottom: 16,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
    },
    productImage: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
    },
    productInfo: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#2C3639',
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 24,
    },
    price: {
        fontSize: 24,
        fontWeight: '600',
        color: '#E97777',
    },
    wasPrice: {
        fontSize: 16,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
    detailsSection: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2C3639',
        marginBottom: 16,
    },
    categoryTag: {
        alignSelf: 'flex-start',
        backgroundColor: '#E97777',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 4,
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 16,
    },
    details: {
        gap: 8,
    },
    detailText: {
        fontSize: 14,
        color: '#666',
    },
    actionButtons: {
        padding: 16,
        gap: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },
    wishlistButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#2C3639',
        borderRadius: 8,
        paddingVertical: 12,
    },
    wishlistButtonText: {
        color: '#2C3639',
        fontSize: 16,
        fontWeight: '600',
    },
    basketButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#E97777',
        borderRadius: 8,
        paddingVertical: 12,
    },
    basketButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});