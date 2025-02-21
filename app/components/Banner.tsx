import { View, Text, StyleSheet, Image } from 'react-native';

function Banner(props) {
    return (
        <View style={styles.heroSection}>
            <Image
                source={{ uri: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?q=80&w=1000&auto=format&fit=crop' }}
                style={styles.heroImage}
            />
            <View style={styles.heroOverlay} />
            <Text style={styles.heroText}>
                GOOD <Text style={styles.heroTextAccent}>FOOD</Text> FEELS{' '}
                <Text style={styles.heroTextAccent}>GOOD</Text>
            </Text>
        </View>
    );
}

export default Banner;

const styles = StyleSheet.create({
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
    heroText: {
        position: 'absolute',
        bottom: 24,
        width: '100%',
        textAlign: 'center',
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    heroTextAccent: {
        color: '#E97777',
    },
});