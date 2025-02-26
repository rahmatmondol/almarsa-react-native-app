import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '@/app/services/apiService';
import useStore from '@/app/store/useStore';

// Mock data for addresses
const MOCK_ADDRESSES = [
    {
        id: 1,
        title: 'Delivery Address 1',
        details: 'Building 123, Apartment 45, Street 67, Block 8, Way 9',
        isDefault: true
    },
    {
        id: 2,
        title: 'Delivery Address 2',
        details: 'Villa 456, Street 78, Block 9, Way 10',
        isDefault: false
    },
    {
        id: 3,
        title: 'Delivery Address 3',
        details: 'Building 789, Apartment 12, Street 34, Block 5, Way 6',
        isDefault: false
    },
];

export default function Addresses() {
    const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
    const [loading, setLoading] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<number | null>(1); // Default to first address
    const { isAuthenticated } = useStore();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/auth');
            return;
        }

        // In a real app, you would fetch addresses from the API
        // loadAddresses();
    }, [isAuthenticated]);

    const loadAddresses = async () => {
        try {
            setLoading(true);
            // const response = await apiService.getAddresses();
            // setAddresses(response.data || []);
        } catch (error) {
            console.error('Error loading addresses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    const handleAddAddress = () => {
        router.push('/edit-address');
    };

    const handleEditAddress = (id: number) => {
        router.push({
            pathname: '/edit-address',
            params: { id }
        });
    };

    const handleSelectAddress = (id: number) => {
        setSelectedAddress(id);
    };

    if (loading) {
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

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
                                        <Text style={styles.addressTitle}>{address.title}</Text>
                                        <Text style={styles.addressDetails}>{address.details}</Text>
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
                        onPress={handleBack}
                    >
                        <Text style={styles.saveButtonText}>SAVE</Text>
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
    addressDetails: {
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