import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Dimensions, Modal, Alert } from 'react-native';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '@/app/services/apiService';
import ImageViewer from 'react-native-image-zoom-viewer';
import RenderHtml from 'react-native-render-html';
import useStore from '@/app/store/useStore';

const { width } = Dimensions.get('window');

export default function ProductPage() {
    const { id } = useLocalSearchParams();
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState<any>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isVariationModalVisible, setIsVariationModalVisible] = useState(false);
    const [selectedVariation, setSelectedVariation] = useState(null);
    const { isAuthenticated, setBasket, setWishlist } = useStore();
    const [addingToCart, setAddingToCart] = useState(false);
    const [addingToWishlist, setAddingToWishlist] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    const getData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await apiService.getProduct(id);
            if (res.success) {
                setProduct(res.product);
            } else {
                setError('Failed to load product details');
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            setError('Failed to load product details. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    // Use useFocusEffect to reload data when the screen comes into focus
    useFocusEffect(
        useCallback(() => {
            getData();
            return () => {
                // Optional cleanup
            };
        }, [getData])
    );

    const handleBack = () => router.back();
    const handleClose = () => router.back();

    const decrementQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const incrementQuantity = () => setQuantity(quantity + 1);

    const openImageModal = (index: number) => {
        setSelectedImageIndex(index);
        setIsModalVisible(true);
    };

    const closeImageModal = () => setIsModalVisible(false);

    const openVariationModal = () => {
        if (product?.productOptions?.length > 0) {
            setIsVariationModalVisible(true);
        } else {
            addToCart();
        }
    };

    const closeVariationModal = () => setIsVariationModalVisible(false);

    const handleVariationSelection = (variation: any) => {
        setSelectedVariation(variation);
        closeVariationModal();
        addToCart();
    };

    const handleAuthRedirect = () => {
        Alert.alert(
            'Sign In Required',
            'Please sign in to continue',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign In', onPress: () => router.push('/auth') }
            ]
        );
    };

    const addToWishlist = async () => {
        if (!isAuthenticated) {
            handleAuthRedirect();
            return;
        }

        try {
            setAddingToWishlist(true);
            const res = await apiService.addToWishlist({
                product_id: product?.id,
                quantity: quantity,
            });

            if (res.success) {
                setWishlist(res.product.items.length);
                setSuccessMessage('Product added to wishlist successfully!');
                setShowSuccessModal(true);
                setTimeout(() => setShowSuccessModal(false), 2000);
            } else {
                Alert.alert('Error', res.message || 'Failed to add product to wishlist');
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            Alert.alert('Error', 'Failed to add product to wishlist');
        } finally {
            setAddingToWishlist(false);
        }
    };

    const addToCart = async () => {
        if (!isAuthenticated) {
            handleAuthRedirect();
            return;
        }

        if (!product) {
            Alert.alert('Error', 'Product not found');
            return;
        }

        if (product.productOptions?.length > 0 && !selectedVariation) {
            Alert.alert('Select Variation', 'Please select a variation before adding to cart');
            return;
        }

        try {
            setAddingToCart(true);
            const res = await apiService.addToCart({
                product_id: product.id,
                quantity: quantity,
                variation_id: selectedVariation?.id,
            });

            if (res.success) {
                setBasket(res.product.items.length);
                setSuccessMessage('Product added to cart successfully!');
                setShowSuccessModal(true);
                setTimeout(() => {
                    setShowSuccessModal(false);
                    // Optionally navigate to basket
                    // router.push('/basket');
                }, 2000);
            } else {
                Alert.alert('Error', res.message || 'Failed to add product to cart');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            Alert.alert('Error', 'Failed to add product to cart');
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2C3639" />
            </View>
        );
    }

    if (error || !product) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={64} color="#E97777" />
                <Text style={styles.errorText}>{error || 'Product not found'}</Text>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Prepare image URLs for the image viewer
    const imageUrls = product.media.items.map((item: any) => ({ url: item.image.url }));

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

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Product Image Slider */}
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    style={styles.sliderContainer}
                >
                    {product.media.items.map((item: any, index: number) => (
                        <TouchableOpacity key={index} onPress={() => openImageModal(index)}>
                            <Image
                                source={{ uri: item.image.url }}
                                style={[styles.productImage, { width }]}
                                defaultSource={require('@/assets/images/icon.png')}
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Product Info */}
                <View style={styles.productInfo}>
                    <Text style={styles.title}>{product.name}</Text>
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>
                            OMR {product.price.discountedPrice}
                        </Text>
                        {product.discount.value > 0 && (
                            <Text style={styles.wasPrice}>
                                was {product.price.price}
                            </Text>
                        )}
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

                    {/* Product Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>DESCRIPTION</Text>
                        <RenderHtml
                            contentWidth={width - 32} // Account for padding
                            source={{ html: product.description || '<p>No description available</p>' }}
                        />
                    </View>

                    {/* Variations */}
                    {product.productOptions?.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>VARIATIONS</Text>
                            {product.productOptions.map((option: any, index: number) => (
                                <View key={index} style={styles.variation}>
                                    <Text style={styles.variationText}>{option.name}</Text>
                                    {option.choices?.map((choice: any, idx: number) => (
                                        <Text key={idx} style={styles.choiceText}>
                                            {choice.description}
                                        </Text>
                                    ))}
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Additional Info */}
                    {product.additionalInfoSections?.map((section: any, index: number) => (
                        <View key={index} style={styles.section}>
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                            <RenderHtml
                                source={{ html: section.description || '<p>No information available</p>' }}
                            />
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={[styles.wishlistButton, addingToWishlist && styles.buttonDisabled]}
                    onPress={addToWishlist}
                    disabled={addingToWishlist}
                >
                    {addingToWishlist ? (
                        <ActivityIndicator size="small" color="#2C3639" />
                    ) : (
                        <>
                            <Text style={styles.wishlistButtonText}>ADD TO WISHLIST</Text>
                            <Ionicons name="heart-outline" size={24} color="#2C3639" />
                        </>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.basketButton, addingToCart && styles.buttonDisabled]}
                    onPress={openVariationModal}
                    disabled={addingToCart}
                >
                    {addingToCart ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <>
                            <Text style={styles.basketButtonText}>ADD TO BASKET</Text>
                            <Ionicons name="basket-outline" size={24} color="#fff" />
                        </>
                    )}
                </TouchableOpacity>
            </View>

            {/* Success Modal */}
            <Modal
                visible={showSuccessModal}
                transparent={true}
                animationType="fade"
            >
                <View style={styles.successModalContainer}>
                    <View style={styles.successModalContent}>
                        <Ionicons name="checkmark-circle" size={50} color="#4CAF50" />
                        <Text style={styles.successModalText}>{successMessage}</Text>
                        <TouchableOpacity
                            style={styles.viewBasketButton}
                            onPress={() => {
                                setShowSuccessModal(false);
                                router.push('/basket');
                            }}
                        >
                            <Text style={styles.viewBasketText}>VIEW BASKET</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Full-Size Image Modal */}
            {isModalVisible && (
                <Modal
                    visible={true}
                    transparent={true}
                    onRequestClose={closeImageModal}
                >
                    <View style={styles.imageViewerContainer}>
                        <ImageViewer
                            imageUrls={imageUrls}
                            index={selectedImageIndex}
                            enableSwipeDown
                            onSwipeDown={closeImageModal}
                            enableImageZoom
                            renderIndicator={() => null}
                            renderHeader={() => (
                                <TouchableOpacity onPress={closeImageModal} style={styles.closeButton}>
                                    <Ionicons name="close" size={30} color="#fff" />
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </Modal>
            )}

            {/* Variation Selection Modal */}
            <Modal visible={isVariationModalVisible} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Variation</Text>
                        {product.productOptions?.map((option: any, index: number) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.variationOption}
                                onPress={() => handleVariationSelection(option)}
                            >
                                <Text style={styles.variationOptionText}>{option.name}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity onPress={closeVariationModal} style={styles.closeModalButton}>
                            <Text style={styles.closeModalButtonText}>Close</Text>
                        </TouchableOpacity>
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
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        marginTop: 12,
        textAlign: 'center',
    },
    backButton: {
        backgroundColor: '#E97777',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
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
    sliderContainer: {
        height: 300,
    },
    productImage: {
        height: 300,
        resizeMode: 'cover',
        backgroundColor: '#f5f5f5',
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
    section: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2C3639',
        marginBottom: 12,
    },
    variation: {
        marginBottom: 16,
    },
    variationText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3639',
        marginBottom: 8,
    },
    choiceText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 16,
        marginBottom: 4,
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
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageViewerContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2C3639',
        marginBottom: 16,
    },
    variationOption: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    variationOptionText: {
        fontSize: 16,
        color: '#2C3639',
    },
    closeModalButton: {
        marginTop: 16,
        padding: 10,
        backgroundColor: '#E97777',
        borderRadius: 8,
        alignItems: 'center',
    },
    closeModalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    successModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    successModalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        gap: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%',
    },
    successModalText: {
        fontSize: 16,
        color: '#2C3639',
        textAlign: 'center',
        fontWeight: '500',
    },
    viewBasketButton: {
        backgroundColor: '#2C3639',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 8,
    },
    viewBasketText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});