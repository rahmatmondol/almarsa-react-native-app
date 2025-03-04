import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Modal } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from './services/apiService';
import * as SecureStore from 'expo-secure-store';

export default function ResetPassword() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // Create refs for each input field
  const inputRefs = useRef([]);

  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus to the next input if a digit is entered
    if (text && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    // Show password fields if the last digit is entered
    if (text && index === 5) {
      setShowPasswordFields(true);
    }
  };

  const handleLogin = async () => {
    const fullCode = code.join('');
    if (!fullCode.trim() || fullCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const resetEmail = await SecureStore.getItemAsync('resetEmail');
      if (!resetEmail) {
        setError('Reset email not found. Please try again.');
        setTimeout(() => {
          router.replace('/forget-password');
        }, 2000);
        return;
      }

      //API call for password reset
      const response = await apiService.resetPassword({
        code: fullCode,
        email: resetEmail,
        password: newPassword,
        password_confirmation: confirmPassword
      });

      if (response.success) {
        setSuccess(true);
        SecureStore.deleteItemAsync('resetEmail');
        setTimeout(() => {
          setSuccess(false);
          router.replace('/login'); // Navigate to login after success
        }, 2000);
      }

      // For now, simulate success
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.replace('/login'); // Navigate to login after success
      }, 2000);
    } catch (error) {
      setError(error.message || 'Password reset failed. Please try again.');
      console.log('Error resetting password:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="chevron-back" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          {showPasswordFields ? 'Set a new password' : 'Please enter the 6-digit code sent to your email'}
        </Text>

        {error !== null && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          {!showPasswordFields ? (
            <View style={styles.codeInputContainer}>
              {[...Array(6)].map((_, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={styles.codeInput}
                  maxLength={1}
                  keyboardType="numeric"
                  onChangeText={(text) => handleCodeChange(text, index)}
                  value={code[index]}
                  onSubmitEditing={() => {
                    if (index < 5) inputRefs.current[index + 1].focus();
                  }}
                />
              ))}
            </View>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </>
          )}

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>
                {showPasswordFields ? 'RESET PASSWORD' : 'SUBMIT'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <Modal visible={success} transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Ionicons
                name="checkmark-circle"
                size={40}
                color="#1abc9c"
                style={styles.modalIcon}
              />
              <Text style={styles.modalText}>Password reset successfully</Text>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#2C3639',
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    zIndex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 120,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 36,
  },
  form: {
    width: '100%',
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  codeInput: {
    width: 40,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#E97777',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    marginBottom: 16,
  },
  errorText: {
    color: '#E97777',
    fontSize: 16,
    textAlign: 'center',
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
    alignItems: 'center',
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
});