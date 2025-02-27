import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '@/app/services/apiService';
import useStore from '@/app/store/useStore';

export default function Addresses() {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
    const { isAuthenticated } = useStore();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/auth');
            return;
        }

        loadAddresses();
    }, [isAuthenticated]);

    const loadAddresses = async () => {
        try {
            setLoading(true);
            const response = await apiService.getAddresses();

            if (response.success) {
                setAddresses(response.addresses || []);

                // Set default address as selected if available
                const defaultAddress = response.addresses.find(addr => addr.is_default);
                if (defaultAddress) {
                    setSelectedAddress(defaultAddress.id);
                } else if (response.addresses.length > 0) {
                    setSelectedAddress(response.addresses[0].id);
                }
            } else {
                console.error('Failed to load addresses:', response.message);
            }
        } catch (error) {
            console.error('Error loading addresses:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadAddresses();
    }, []);

    const handleBack = () => {
        router.push('/account');
    };

    const handleAddAddress = () => {
        router.push('/add-address');
    };

    const handleEditAddress = (id) => {
        router.push({
            pathname: '/edit-address',
            params: { id }
        });
    };

    const handleSelectAddress = (id) => {
        setSelectedAddress(id);
    };

    const formatAddressDetails = (address) => {
        const parts = [];

        if (address.is_apartment) {
            if (address.building_name) parts.push(address.building_name);
            if (address.apartment_number) parts.push(`Apt. ${address.apartment_number}`);
            if (address.floor) parts.push(`Floor ${address.floor}`);
        } else {
            if (address.house_number) parts.push(`House ${address.house_number}`);
        }

        if (address.street) parts.push(address.street);
        if (address.block) parts.push(`Block ${address.block}`);
        if (address.way) parts.push(`Way ${address.way}`);

        return parts.join(', ');
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2C3639" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <Ionicons name="chevron-back" size={24} color="#2C3639" />
                    <Text style={styles.headerTitle}>Saved Addresses</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAddAddress}>
                    <Text style={styles.addButton}>Add</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#E97777"]}
                        tintColor="#E97777"
                    />
                }
            >
                {addresses.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="location-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyText}>No saved addresses</Text>
                        <TouchableOpacity
                            style={styles.addAddressButton}
                            onPress={handleAddAddress}
                        >
                            <Text style={styles.addAddressButtonText}>ADD ADDRESS</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    addresses.map((address) => (
                        <View key={address.id} style={styles.addressCard}>
                            <TouchableOpacity
                                style={styles.addressContent}
                                onPress={() => handleEditAddress(address.id)}
                            >
                                <View style={styles.addressInfo}>
                                    <Ionicons name="location-outline" size={24} color="#2C3639" />
                                    <View style={styles.addressTextContainer}>
                                        <Text style={styles.addressTitle}>
                                            {address.address || (address.is_apartment ? 'Apartment' : 'House')}
                                        </Text>
                                        <Text style={styles.addressDetails}>{formatAddressDetails(address)}</Text>
                                        <Text style={styles.addressPhone}>Phone: {address.phone}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={styles.radioButton}
                                    onPress={() => handleSelectAddress(address.id)}
                                >
                                    {selectedAddress === address.id && (
                                        <View style={styles.radioButtonSelected} />
                                    )}
                                </TouchableOpacity>
                            </TouchableOpacity>
                            <View style={styles.divider} />
                        </View>
                    ))
                )}
            </ScrollView>

            {addresses.length > 0 && (
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={() => router.push('/checkout')}
                    >
                        <Text style={styles.saveButtonText}>CHECKOUT</Text>
                    </TouchableOpacity>
                </View>
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
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 48,
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2C3639',
        marginLeft: 8,
    },
    addButton: {
        color: '#E97777',
        fontSize: 16,
        fontWeight: '500',
    },
    content: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
        marginBottom: 24,
    },
    addAddressButton: {
        backgroundColor: '#E97777',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    addAddressButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    addressCard: {
        paddingHorizontal: 16,
    },
    addressContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    addressInfo: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'flex-start',
    },
    addressTextContainer: {
        marginLeft: 12,
        flex: 1,
    },
    addressTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#2C3639',
        marginBottom: 4,
    },
    defaultBadge: {
        color: '#E97777',
        fontWeight: '400',
        fontSize: 14,
    },
    addressDetails: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    addressPhone: {
        fontSize: 14,
        color: '#666',
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#2C3639',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
    },
    radioButtonSelected: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#2C3639',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    saveButton: {
        backgroundColor: '#2C3639',
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});