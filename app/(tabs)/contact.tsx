import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    // Handle form submission
    console.log({ name, email, message });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title={'contact'} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Banner />

        {/* Welcome Message */}
        <View style={styles.welcomeSection}>
          <Ionicons name="happy-outline" size={48} color="#E97777" style={styles.welcomeIcon} />
          <Text style={styles.welcomeTitle}>Hi there!</Text>
          <Text style={styles.welcomeText}>
            Please do not hesitate to get in touch with any questions or feedback.
          </Text>
        </View>

        {/* Contact Methods */}
        <View style={styles.contactMethods}>
          <TouchableOpacity style={styles.contactMethod}>
            <View style={styles.contactMethodIcon}>
              <Ionicons name="call-outline" size={24} color="#E97777" />
            </View>
            <Text style={styles.contactMethodTitle}>Call Us</Text>
            <Text style={styles.contactMethodValue}>+968 96937750</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactMethod}>
            <View style={styles.contactMethodIcon}>
              <Ionicons name="mail-outline" size={24} color="#E97777" />
            </View>
            <Text style={styles.contactMethodTitle}>Email Us</Text>
            <Text style={styles.contactMethodValue}>info@almarsa-gourmet.com</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Form */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Send us a message</Text>

          <TextInput
            style={styles.input}
            placeholder="Your Name"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Your Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Your Message"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>SEND MESSAGE</Text>
          </TouchableOpacity>
        </View>

        {/* Social Links */}
        <View style={styles.socialLinks}>
          <Text style={styles.socialTitle}>Follow Us</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-facebook" size={24} color="#E97777" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-instagram" size={24} color="#E97777" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-twitter" size={24} color="#E97777" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  content: {
    flex: 1,
    padding: 16,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeIcon: {
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3639',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  contactMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  contactMethod: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginHorizontal: 8,
  },
  contactMethodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(233, 119, 119, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactMethodTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3639',
    marginBottom: 4,
  },
  contactMethodValue: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3639',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  messageInput: {
    height: 120,
    paddingTop: 16,
  },
  submitButton: {
    backgroundColor: '#E97777',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  socialLinks: {
    alignItems: 'center',
    marginBottom: 32,
  },
  socialTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3639',
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(233, 119, 119, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});