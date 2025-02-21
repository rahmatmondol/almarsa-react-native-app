import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function EditAccount() {
  const [formData, setFormData] = useState({
    email: 'johndoe@gmail.com',
    firstName: 'john',
    lastName: 'Doe',
    dateOfBirth: '',
    gender: 'male',
    receiveOffers: false,
    newsletter: false,
  });

  const handleBack = () => {
    router.back();
  };

  const handleSave = () => {
    // Handle save logic here
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#2C3639" />
          <Text style={styles.headerTitle}>Account info</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
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

          {/* Date of Birth */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of birth (optional)</Text>
            <TouchableOpacity style={styles.dateInput}>
              <Text style={styles.dateInputText}>
                {formData.dateOfBirth || 'Select date'}
              </Text>
              <Ionicons name="calendar-outline" size={24} color="#666" />
            </TouchableOpacity>
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
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
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
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});