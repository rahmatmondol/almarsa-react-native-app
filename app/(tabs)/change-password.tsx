import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function ChangePassword() {
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
    router.back();
  };

  const handleSubmit = () => {
    // Handle password change logic here
    router.back();
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
            <Text style={styles.requirementsTitle}>
              Password must be at least 8 characters and should include:
            </Text>
            <Text style={styles.requirementText}>1 uppercase letter ( A-Z )</Text>
            <Text style={styles.requirementText}>1 lowercase letter ( a-z )</Text>
            <Text style={styles.requirementText}>1 number ( 0-9 )</Text>
            <Text style={styles.requirementText}>1 special character ( @$%&+ )</Text>
          </View>
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
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
});