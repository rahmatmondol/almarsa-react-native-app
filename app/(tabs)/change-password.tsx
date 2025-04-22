import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Modal } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../services/apiService';
import { IconSymbol } from '@/app-example/components/ui/IconSymbol.ios';

export default function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleBack = () => {
    router.push('/settings');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.ChangePassword({
        current_password: formData.currentPassword,
        password: formData.newPassword,
        password_confirmation: formData.confirmPassword,
      });
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          handleBack();
        }, 2000);
      }
      console.log('Password changed successfully', response);
    } catch (error) {
      console.log('Error changing password:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#2C3639" />
          <Text style={styles.headerTitle}>Change password</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Form Fields */}

        <View style={styles.form}>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Current password"
              value={formData.currentPassword}
              onChangeText={(text) => setFormData({ ...formData, currentPassword: text })}
              secureTextEntry={!showPasswords.current}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
            >
              <Ionicons
                name={showPasswords.current ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="New password"
              value={formData.newPassword}
              onChangeText={(text) => setFormData({ ...formData, newPassword: text })}
              secureTextEntry={!showPasswords.new}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
            >
              <Ionicons
                name={showPasswords.new ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
              secureTextEntry={!showPasswords.confirm}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
            >
              <Ionicons
                name={showPasswords.confirm ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {/* Password Requirements */}
          <View style={styles.requirementsContainer}>
            <Text style={styles.error}>{error}</Text>
          </View>
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color="#fff"
            style={styles.submitButtonText}
          />
        ) : (
          <Text style={styles.submitButtonText}>Submit</Text>
        )}

      </TouchableOpacity>

      <Modal visible={success} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Ionicons
              name="checkmark-circle"
              size={40}
              color="#1abc9c"
              style={styles.modalIcon}
            />
            <Text style={styles.modalText}>Password changed successfully</Text>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    padding: 16,
  },
  form: {
    gap: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  requirementsContainer: {
    marginTop: 24,
  },
  requirementsTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  submitButton: {
    backgroundColor: '#2C3639',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#2C3639',
    padding: 24,
    borderRadius: 8,
  },
  modalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  modalIcon: {
    alignSelf: 'center',
  },
  error: {
    color: 'red',
  },

});