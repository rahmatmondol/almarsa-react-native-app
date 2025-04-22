import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '@/app/services/apiService';
import * as SecureStore from 'expo-secure-store';
import useStore from '@/app/store/useStore';

export default function EditAccount() {
  const { user, setUser } = useStore();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    phone: user?.data?.phone || '',
    firstName: user?.data?.first_name || '',
    lastName: user?.data?.last_name || '',
    gender: user?.data?.gender || 'male',
    receiveOffers: user?.data?.offers,
    newsletter: user?.data?.newsletter,
  });


  const handleBack = () => {
    router.push('/account');
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setErrors([]);

      const response = await apiService.updateProfile({
        phone: formData.phone,
        first_name: formData.firstName,
        last_name: formData.lastName,
        gender: formData.gender,
        offers: formData.receiveOffers,
        newsletter: formData.newsletter
      });

      if (response.error) {
        setErrors([response.message || 'Failed to update profile']);
        return;
      }

      // Store user data securely
      await SecureStore.setItemAsync('userData', JSON.stringify(response.user));

      // Update global state
      setUser({
        ...user,
        data: response.user,
      });

      // Show success modal
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        router.push('/account');
      }, 2000);
    } catch (error: any) {
      console.log('Profile update error:', error);
      if (error.errors) {
        // Convert errors object to array of strings
        const errorMessages = Object.values(error.errors).flat() as string[];
        setErrors(errorMessages);
      } else {
        setErrors(['Failed to update profile. Please try again.']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Success Modal */}
      <Modal
        transparent
        visible={showSuccessModal}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={50} color="#4CAF50" />
            </View>
            <Text style={styles.modalText}>Profile updated successfully!</Text>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#2C3639" />
          <Text style={styles.headerTitle}>Account info</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {errors.length > 0 && (
            <View style={styles.errorContainer}>
              {errors.map((error, index) => (
                <Text key={index} style={styles.errorText}>{error}</Text>
              ))}
            </View>
          )}

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
            />
          </View>

          {/* First Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First name</Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(text) => setFormData({ ...formData, firstName: text })}
            />
          </View>

          {/* Last Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last name</Text>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(text) => setFormData({ ...formData, lastName: text })}
            />
          </View>

          {/* Gender Selection */}
          <View style={styles.inputGroup}>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={styles.genderOption}
                onPress={() => setFormData({ ...formData, gender: 'male' })}
              >
                <View style={styles.radio}>
                  {formData.gender === 'male' && <View style={styles.radioSelected} />}
                </View>
                <Text style={styles.genderText}>Male</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.genderOption}
                onPress={() => setFormData({ ...formData, gender: 'female' })}
              >
                <View style={styles.radio}>
                  {formData.gender === 'female' && <View style={styles.radioSelected} />}
                </View>
                <Text style={styles.genderText}>Female</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Checkboxes */}
          <View style={styles.checkboxGroup}>
            <TouchableOpacity
              style={styles.checkboxOption}
              onPress={() => setFormData({ ...formData, receiveOffers: !formData.receiveOffers })}
            >
              <View style={styles.checkbox}>
                {formData.receiveOffers && (
                  <Ionicons name="checkmark" size={16} color="#2C3639" />
                )}
              </View>
              <Text style={styles.checkboxText}>Yes I want to receive offers and discounts</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkboxOption}
              onPress={() => setFormData({ ...formData, newsletter: !formData.newsletter })}
            >
              <View style={styles.checkbox}>
                {formData.newsletter && (
                  <Ionicons name="checkmark" size={16} color="#2C3639" />
                )}
              </View>
              <Text style={styles.checkboxText}>Subscribe to newsletter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, loading && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  successIcon: {
    marginBottom: 16,
  },
  modalText: {
    fontSize: 18,
    color: '#2C3639',
    fontWeight: '600',
  },
  header: {
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
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  dateInputText: {
    fontSize: 16,
    color: '#666',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2C3639',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2C3639',
  },
  genderText: {
    fontSize: 16,
    color: '#2C3639',
  },
  checkboxGroup: {
    gap: 16,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#2C3639',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxText: {
    fontSize: 14,
    color: '#2C3639',
  },
  saveButton: {
    backgroundColor: '#2C3639',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
  },
  errorText: {
    color: '#E97777',
    fontSize: 14,
    marginBottom: 4,
  },
});