import { View, Text, StyleSheet, Image } from 'react-native';

function Banner({ title = '', image = '', description = '', icon = '' }) {
    return (
        <View style={styles.heroSection}>
            <Image
                source={{ uri: image }}
                style={styles.heroImage}
                resizeMode="cover"
            />
            <View style={styles.heroOverlay} />
            <Text style={styles.heroText}>
                <Text style={styles.heroTextAccent}>{title}</Text>
            </Text>
            <Image
                source={{ uri: icon }}
                style={styles.heroIcon}
            />
        </View>
    );
}

export default Banner;

const styles = StyleSheet.create({
    heroSection: {
        height: 200,
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2C3639',
        flexDirection: 'column',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    heroIcon: {
        width: 90,
        height: 60,
        position: 'absolute',
        objectFit: 'contain',
    },
    heroText: {
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        top: 30,
    },
    heroTextAccent: {
        color: '#fff',
    },
});