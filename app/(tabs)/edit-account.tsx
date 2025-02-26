import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Modal, Image } from 'react-native';
import { router } from 'expo-router';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import useStore from '@/app/store/useStore';
import * as SecureStore from 'expo-secure-store';
import { apiService } from '@/app/services/apiService';
import * as ImagePicker from 'expo-image-picker';

export default function EditAccount() {
  const { user, setUser } = useStore();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [image, setImage] = useState(user?.data.avatar || null);
  const [formData, setFormData] = useState({
    email: user?.data.email || '',
    firstName: user?.data.first_name || '',
    lastName: user?.data.last_name || '',
    phone: user?.data.phone || '',
    gender: user?.data.gender || 'male',
    sentOffers: user?.data.sent_offers ?? true,
    newsletter: user?.data.newsletter ?? true
  });

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        // Just store the selected image URI - don't upload yet
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      setErrors({ avatar: ['Failed to pick image'] });
    }
  };

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleInputChange = useCallback((field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSave = useCallback(async () => {
    try {
      setLoading(true);
      setErrors({});

      const response = await apiService.updateProfile({
        ...(selectedImage && { image: selectedImage }), // Only include image if one was selected
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        gender: formData.gender,
        sent_offers: formData.sentOffers,
        newsletter: formData.newsletter,
        phone: formData.phone,
      });

      if (response.error) {
        setErrors({ general: [response.message] });
        return;
      }
      
      const updatedUser = { ...user, data: response.user };
      await SecureStore.setItemAsync('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        router.replace('/(tabs)/account');
      }, 2000);
    } catch (error: any) {
      console.error('Profile update error:', error);
      setErrors(error.errors || { general: ['Profile update failed'] });
    } finally {
      setLoading(false);
    }
  }, [formData, selectedImage, setUser, user]);

  const renderInput = useCallback(({ label, field, keyboardType = 'default', autoCapitalize = 'none' }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={formData[field]}
        onChangeText={(text) => handleInputChange(field, text)}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  ), [formData, handleInputChange]);

  // Show either the selected image or the existing avatar
  const displayImage = selectedImage || image;

  return (
    <View style={styles.container}>
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

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#2C3639" />
          <Text style={styles.headerTitle}>Account info</Text>
        </TouchableOpacity>
      </View>

      {errors.general && (
        <View style={styles.errorContainer}>
          {errors.general.map((error, index) => (
            <Text key={index} style={styles.errorText}>{error}</Text>
          ))}
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={pickImage}>
              {displayImage ? (
                <Image source={{ uri: displayImage }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={40} color="#2C3639" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage}>
              <Text style={styles.changePhotoText}>
                {displayImage ? 'Change Photo' : 'Add Photo'}
              </Text>
            </TouchableOpacity>
          </View>

          {renderInput({ label: 'Email', field: 'email', keyboardType: 'email-address' })}
          {renderInput({ label: 'First name', field: 'firstName', autoCapitalize: 'words' })}
          {renderInput({ label: 'Last name', field: 'lastName', autoCapitalize: 'words' })}
          {renderInput({ label: 'Phone', field: 'phone', keyboardType: 'phone-pad' })}

          <View style={styles.inputGroup}>
            <View style={styles.genderContainer}>
              {['male', 'female'].map((genderOption) => (
                <TouchableOpacity
                  key={genderOption}
                  style={styles.genderOption}
                  onPress={() => handleInputChange('gender', genderOption)}
                >
                  <View style={styles.radio}>
                    {formData.gender === genderOption && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.genderText}>{genderOption.charAt(0).toUpperCase() + genderOption.slice(1)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.checkboxGroup}>
            {[
              { field: 'sentOffers', label: 'Yes I want to receive offers and discounts' },
              { field: 'newsletter', label: 'Subscribe to newsletter' }
            ].map(({ field, label }) => (
              <TouchableOpacity
                key={field}
                style={styles.checkboxOption}
                onPress={() => handleInputChange(field, !formData[field])}
              >
                <View style={styles.checkbox}>
                  {formData[field] && <Ionicons name="checkmark" size={16} color="#2C3639" />}
                </View>
                <Text style={styles.checkboxText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  changePhotoText: {
    color: '#E97777',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
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
  errorContainer: {
    marginTop: 4,
    paddingHorizontal: 4,
  },
  errorText: {
    color: '#E97777',
    fontSize: 12,
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
});