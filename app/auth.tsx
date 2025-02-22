import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Link, router } from 'expo-router';

export default function Auth() {
  const handleGuestLogin = () => {
    // Handle guest login logic here
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>welcome to</Text>

        <Image
          source={require('@/assets/images/main-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.subtitle}>
          PLEASE CLICK BELOW TO LOGIN{'\n'}OR REGISTER
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => router.push('/register')}>
            <Text style={styles.buttonText}>REGISTER</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.guestButton]}
            onPress={() => router.push('/shop')}
          >
            <Text style={[styles.buttonText, styles.guestButtonText]}>
              GO TO SHOP
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3639',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  logo: {
    width: 240,
    height: 80,
    marginBottom: 40,
  },
  subtitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#2C3639',
    fontSize: 16,
    fontWeight: '600',
  },
  guestButton: {
    backgroundColor: '#E97777',
  },
  guestButtonText: {
    color: '#fff',
  },
});