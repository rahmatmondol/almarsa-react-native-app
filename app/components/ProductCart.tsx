import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function ProductCart({ item }) {
    return (
        <TouchableOpacity
            key={item.id}
            style={styles.productCard}
            onPress={() => router.push(`/product/${item.id}`)}
        >
            <Image
                source={{ uri: item.media.mainMedia.image.url }}
                style={styles.productImage}
                resizeMode="cover"
            />
            {item.discount.value > 0 && (
                <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>-{item.discount.value}%</Text>
                </View>
            )}
            {item.ribbon && (
                <View style={styles.ribbonBadge}>
                    <Text style={styles.ribbonText}>{item.ribbon}</Text>
                </View>
            )}
            <View style={styles.productContent}>
                <Text style={styles.productName} numberOfLines={2}>
                    {item.name}
                </Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>
                        {item.price.formatted.discountedPrice}
                    </Text>
                    {item.discount.value > 0 && (
                        <Text style={styles.wasPrice}>
                            {item.price.formatted.price}
                        </Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default ProductCart;

const styles = StyleSheet.create({
    productCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#eee',
        maxWidth: '50%',
        width: '47%',
    },
    productImage: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
        objectFit: 'fill',
    },
    discountBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#E97777',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    discountText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    ribbonBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#2C3639',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    ribbonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    productContent: {
        padding: 12,
    },
    productName: {
        fontSize: 14,
        color: '#2C3639',
        marginBottom: 8,
        height: 40,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
        color: '#E97777',
    },
    wasPrice: {
        fontSize: 12,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    inStock: {
        fontSize: 12,
        color: '#4CAF50',
    },
    outOfStock: {
        fontSize: 12,
        color: '#F44336',
    },
});