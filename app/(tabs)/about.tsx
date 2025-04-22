import { View, Text, StyleSheet, Image, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/app/components/Header';
import Banner from '@/app/components/Banner';

const STEPS = [
  {
    title: 'Add products to the basket',
    icon: require('@/assets/images/basket-icon.png'),
  },
  {
    title: 'Validate your order',
    subtitle: 'Choose between self-pickup or home delivery in Muscat and Sohar',
    icon: require('@/assets/images/check-icon.png'),
  },
  {
    title: 'A confirmation message will be sent on the day of the delivery',
    subtitle: 'We will share the time for your delivery/pick-up',
    icon: require('@/assets/images/chat-icon.png'),
  },
  {
    title: 'We accept both, credit cards and cash upon delivery/pick-up',
    subtitle: 'We deliver on Sunday, Monday, Tuesday, Wednesday and Thursday from 2:00 pm to 7:00 pm.',
    icon: require('@/assets/images/payment-icon.png'),
  },
];

export default function Home() {
  return (
    <>
      <Header title='about' />
      <ScrollView style={styles.container}>
        <View style={styles.heroSection}>
          <Image
            source={require('@/assets/images/default-banner.png')}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.heroIcon}
          />
          <Image
            source={require('@/assets/images/main-logo.png')}
            style={styles.heroLogo}
          />
        </View>

        <View style={styles.websiteContainer}>
          <Text style={styles.website} onPress={() => Linking.openURL('https://almarsa-gourmet.com')}>www.almarsa-gourmet.com</Text>
        </View>

        <View style={styles.socialLinks}>
          <Ionicons
            name="logo-instagram"
            size={35}
            color="#333"
            onPress={() => Linking.openURL('https://www.instagram.com/almarsa_gourmet/')}
          />
          <Ionicons
            name="logo-facebook"
            size={35}
            color="#333"
            onPress={() => Linking.openURL('https://www.facebook.com/almarsagourmet')}
          />
          <Ionicons
            name="mail"
            size={35}
            color="#333"
            onPress={() => Linking.openURL('mailto:info@almarsa-gourmet.com')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>HOW DOES IT WORK?</Text>
          <Text style={styles.subtitle}>Simply follow 4 steps</Text>

          <View style={styles.steps}>
            {STEPS.map((step, index) => (
              <View key={index} style={styles.step}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Image
                  source={step.icon}
                  style={styles.stepIcon}
                />
                {step.subtitle && (
                  <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.description}>
            Al Marsa Fisheries is processing and selling fresh and frozen seafood in
            Oman for the past 15 years. Based on this experience Al Marsa Foods was established
            5 years ago to supply the local market with the best imported food products. We
            supply all the hypermarket chains and all the 4-star hotels with a lot of very
            special products. We are very proud to be the only local company to do so. It
            became therefore obvious to share this "Savoir fair" with the broader range of
            customers and this is the aim of Al Marsa Gourmet: to bring to all direct access to
            products that can not be found anywhere else in Oman
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
    resizeMode: 'cover',
    position: 'absolute',
    objectFit: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  heroIcon: {
    width: 100,
    height: 80,
    objectFit: 'contain',
    position: 'absolute',
    top: 20,
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
  heroLogo: {
    position: 'absolute',
    width: '60%',
    height: 60,
    alignSelf: 'center',
    bottom: 30,
  },
  header: {
    height: 200,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  logo: {
    position: 'absolute',
    width: '50%',
    height: 60,
    alignSelf: 'center',
    top: '50%',
    transform: [{ translateY: -30 }],
  },
  websiteContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  website: {
    fontSize: 22,
    color: '#333',
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 30,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  steps: {
    gap: 20,
  },
  step: {
    backgroundColor: '#E97777',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  stepIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  stepIcon: {
    width: 60,
    height: 50,
    objectFit: 'contain',
    marginTop: 15,
    marginBottom: 15,
  },
  stepSubtitle: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.9,
  },
  description: {
    fontSize: 14,
    lineHeight: 24,
    color: '#666',
    textAlign: 'justify',
  },
});