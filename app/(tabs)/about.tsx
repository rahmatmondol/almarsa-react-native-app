import { View, Text, StyleSheet, Image, ScrollView, Linking } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import Banner from '../components/Banner';

const STEPS = [
  {
    title: 'Add products to the basket',
    icon: 'basket-outline',
  },
  {
    title: 'Validate your order',
    subtitle: 'Choose between self-pickup or home delivery in Muscat and Sohar',
    icon: 'checkmark-circle-outline',
  },
  {
    title: 'A confirmation message will be sent on the day of the delivery',
    subtitle: 'We will share the time for your delivery/pick-up',
    icon: 'chatbubble-outline',
  },
  {
    title: 'We accept both, credit cards and cash upon delivery/pick-up',
    subtitle: 'We deliver on Sunday, Monday, Tuesday, Wednesday and Thursday from 2:00 pm to 7:00 pm.',
    icon: 'card-outline',
  },
];

export default function Home() {
  return (
    <>
      <Header title='about' />
      <ScrollView style={styles.container}>
        <Banner />

        <View style={styles.websiteContainer}>
          <Text style={styles.website}>www.almarsa-gourmet.com</Text>
        </View>

        <View style={styles.socialLinks}>
          <Ionicons
            name="logo-instagram"
            size={24}
            color="#333"
            onPress={() => Linking.openURL('https://instagram.com')}
          />
          <Ionicons
            name="logo-facebook"
            size={24}
            color="#333"
            onPress={() => Linking.openURL('https://facebook.com')}
          />
          <Ionicons
            name="mail"
            size={24}
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
                <View style={styles.stepIconContainer}>
                  <Ionicons name={step.icon} size={32} color="#fff" />
                </View>
                <Text style={styles.stepTitle}>{step.title}</Text>
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
    fontSize: 16,
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
    marginBottom: 5,
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