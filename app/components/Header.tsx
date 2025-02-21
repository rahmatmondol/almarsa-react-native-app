import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import DrawerMenu from './DrawerMenu';
import { useState } from 'react';

interface HeaderProps {
    title: string;
    onBack?: () => void;
}

export default function Header({ title, onBack }: HeaderProps) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const handleBack = () => {
        router.back();
    };
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>

                    {title !== 'Home' && (
                        router.canGoBack() && (
                            <TouchableOpacity onPress={handleBack}>
                                <Ionicons name="chevron-back" size={24} color="#fff" />
                            </TouchableOpacity>
                        )
                    )}

                    {title == 'Home' && (
                        <TouchableOpacity>
                            <Link href="/search">
                                <Ionicons name="search-outline" size={30} color="#fff" />
                            </Link>
                        </TouchableOpacity>
                    )}


                    <Link href="/">
                        <Image
                            source={require('@/assets/images/main-logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </Link>

                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.headerIcon} onPress={() => router.push('/wishlist')}>
                            <Ionicons name="heart-outline" size={30} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerIcon}>
                            <Link href="/notifications">
                                <Ionicons name="notifications-outline" size={30} color="#fff" />
                            </Link>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerIcon} onPress={() => {
                            // load the drawer
                            setIsDrawerOpen(true);
                        }}>
                            <Ionicons name="menu-outline" size={30} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>


            </View>
            <Modal
                visible={isDrawerOpen}
                animationType="slide"
                onRequestClose={() => setIsDrawerOpen(false)}
            >
                <DrawerMenu onClose={() => setIsDrawerOpen(false)} />
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
        paddingTop: 50,
        paddingBottom: 10,
    },
    logo: {
        width: 120,
        height: 30,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        marginLeft: 16,
    },

});
