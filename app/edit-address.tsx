import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function EditAddress() {
  const [addressType, setAddressType] = useState<'apartments' | 'house'>('apartments');
  const [formData, setFormData] = useState({
    buildingName: '',
    aptNumber: '',
    floor: '',
    street: '',
    block: '',
    way: '',
    phone: '',
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
          <Text style={styles.headerTitle}>New Address</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Address Type Selection */}
        <View style={styles.addressTypeContainer}>
          <TouchableOpacity
            style={[
              styles.addressTypeButton,
              addressType === 'apartments' && styles.addressTypeSelected
            ]}
            onPress={() => setAddressType('apartments')}
          >
            <Text style={[
              styles.addressTypeText,
              addressType === 'apartments' && styles.addressTypeTextSelected
            ]}>Apartments</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.addressTypeButton,
              addressType === 'house' && styles.addressTypeSelected
            ]}
            onPress={() => setAddressType('house')}
          >
            <Text style={[
              styles.addressTypeText,
              addressType === 'house' && styles.addressTypeTextSelected
            ]}>House</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Building name"
            value={formData.buildingName}
            onChangeText={(text) => setFormData({ ...formData, buildingName: text })}
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Apt. number"
              value={formData.aptNumber}
              onChangeText={(text) => setFormData({ ...formData, aptNumber: text })}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Floor"
              value={formData.floor}
              onChangeText={(text) => setFormData({ ...formData, floor: text })}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Street"
            value={formData.street}
            onChangeText={(text) => setFormData({ ...formData, street: text })}
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Block"
              value={formData.block}
              onChangeText={(text) => setFormData({ ...formData, block: text })}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="way (optional)"
              value={formData.way}
              onChangeText={(text) => setFormData({ ...formData, way: text })}
            />
          </View>

          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+968</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="phone number"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
            />
          </View>
        </View>
      </View>

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
    padding: 16,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  addressTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#2C3639',
    borderRadius: 8,
    alignItems: 'center',
  },
  addressTypeSelected: {
    backgroundColor: '#2C3639',
  },
  addressTypeText: {
    color: '#2C3639',
    fontSize: 16,
    fontWeight: '500',
  },
  addressTypeTextSelected: {
    color: '#fff',
  },
  form: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfInput: {
    flex: 1,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  countryCode: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  countryCodeText: {
    fontSize: 16,
    color: '#2C3639',
  },
  phoneInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
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