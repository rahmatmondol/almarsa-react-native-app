import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Dimensions, Modal, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../services/apiService';
import ImageViewer from 'react-native-image-zoom-viewer'; // For zoomable images
import RenderHtml from 'react-native-render-html'; // To render HTML content

const { width } = Dimensions.get('window'); // Get screen width

export default function ProductPage() {
    const { id } = useLocalSearchParams();
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isVariationModalVisible, setIsVariationModalVisible] = useState(false);
    const [selectedVariation, setSelectedVariation] = useState(null);

    const getData = async () => {
        try {
            const res = await apiService.getProduct(id);
            setProduct(res.product);
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

    const openImageModal = (index) => {
        setSelectedImageIndex(index);
        setIsModalVisible(true);
    };

    const closeImageModal = () => {
        setIsModalVisible(false);
    };

    const openVariationModal = () => {
        if (product.productOptions?.length > 0) {
            setIsVariationModalVisible(true);
        } else {
            addToCart();
        }
    };

    const closeVariationModal = () => {
        setIsVariationModalVisible(false);
    };

    const handleVariationSelection = (variation) => {
        setSelectedVariation(variation);
        closeVariationModal();
        addToCart();
    };

    const addToCart = () => {
        if (selectedVariation || product.productOptions?.length === 0) {
            // Add to cart logic here
            Alert.alert('Added to Cart', `Added ${quantity} x ${product.name} to cart.`);
        } else {
            Alert.alert('Select Variation', 'Please select a variation before adding to cart.');
        }
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
                        {/* Product Image Slider */}
                        <ScrollView
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            style={styles.sliderContainer}
                        >
                            {product.media.items.map((item, index) => (
                                <TouchableOpacity key={index} onPress={() => openImageModal(index)}>
                                    <Image
                                        source={{ uri: item.image.url }}
                                        style={[styles.productImage, { width }]} // Set image width to screen width
                                    />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Product Info */}
                        <View style={styles.productInfo}>
                            <Text style={styles.title}>{product.name}</Text>
                            <View style={styles.priceContainer}>
                                <Text style={styles.price}>OMR {product.price.discountedPrice}</Text>
                                {product.discount.value > 0 && (
                                    <Text style={styles.wasPrice}>was {product.price.price}</Text>
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
                                    contentWidth={width}
                                    style={styles.description}
                                    source={{ html: product.description }}
                                />
                            </View>



                            {/* Variations */}
                            {product.productOptions?.length > 0 && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>VARIATIONS</Text>
                                    {product.productOptions.map((option, index) => (
                                        <View key={index} style={styles.variation}>
                                            <Text style={styles.variationText}>{option.name}</Text>
                                            {/* Render choices if available */}
                                            {option.choices?.map((choice, idx) => (
                                                <Text key={idx} style={styles.choiceText}>
                                                    {choice.description}
                                                </Text>
                                            ))}
                                        </View>
                                    ))}
                                </View>
                            )}

                            {/* Additional Info */}
                            {product.additionalInfoSections?.map((section, index) => (
                                <View key={index} style={styles.section}>
                                    <Text style={styles.sectionTitle}>{section.title}</Text>
                                    <RenderHtml
                                        contentWidth={width}
                                        source={{ html: section.description }}
                                    />
                                </View>
                            ))}
                        </View>
                    </ScrollView>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.wishlistButton}>
                            <Text style={styles.wishlistButtonText}>ADD TO WISHLIST</Text>
                            <Ionicons name="heart-outline" size={24} color="#2C3639" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.basketButton} onPress={openVariationModal}>
                            <Text style={styles.basketButtonText}>ADD TO BASKET</Text>
                            <Ionicons name="basket-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Full-Size Image Modal */}
                    <Modal visible={isModalVisible} transparent={true} onRequestClose={closeImageModal}>
                        <ImageViewer
                            imageUrls={product.media.items.map((item) => ({ url: item.image.url }))}
                            index={selectedImageIndex}
                            enableSwipeDown
                            onSwipeDown={closeImageModal}
                            enableImageZoom
                            renderHeader={() => (
                                <TouchableOpacity onPress={closeImageModal} style={styles.closeButton}>
                                    <Ionicons name="close" size={30} color="#fff" />
                                </TouchableOpacity>
                            )}
                        />
                    </Modal>

                    {/* Variation Selection Modal */}
                    <Modal visible={isVariationModalVisible} transparent={true} animationType="slide">
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Select Variation</Text>
                                {product.productOptions.map((option, index) => (
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
                </>
            )}
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 48,
        paddingBottom: 16,
        backgroundColor: '#fff',
    },
    description: {
      fontSize: 18,  
    },
    content: {
        flex: 1,
    },
    sliderContainer: {
        height: 300, // Set a fixed height for the slider
    },
    productImage: {
        height: 300, // Match the height of the slider container
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
    section: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2C3639',
    },
    variation: {
        marginBottom: 16,
    },
    variationText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3639',
    },
    choiceText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 16,
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
});