import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '@/app/services/apiService';
import useStore from '@/app/store/useStore';

export default function AddAddress() {
  const [loading, setSaving] = useState(false);
  const [addressType, setAddressType] = useState<'apartments' | 'house'>('apartments');
  const [formData, setFormData] = useState({
    title: '',
    buildingName: '',
    houseNo: '',
    aptNumber: '',
    floor: '',
    street: '',
    block: '',
    way: '',
    phone: '',
    isDefault: false,
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { isAuthenticated } = useStore();

  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrors({});

      // Validate form based on address type
      const validationErrors: Record<string, string[]> = {};

      if (addressType === 'apartments') {
        if (!formData.buildingName) validationErrors.buildingName = ['Building name is required'];
        if (!formData.street) validationErrors.street = ['Street is required'];
        if (!formData.block) validationErrors.block = ['Block is required'];
        if (!formData.phone) validationErrors.phone = ['Phone number is required'];
        if (!formData.title) validationErrors.title = ['Address is required'];
      } else {
        if (!formData.houseNo) validationErrors.houseNo = ['House number is required'];
        if (!formData.street) validationErrors.street = ['Street is required'];
        if (!formData.block) validationErrors.block = ['Block is required'];
        if (!formData.phone) validationErrors.phone = ['Phone number is required'];
        if (!formData.title) validationErrors.title = ['Address is required'];
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setSaving(false);
        return;
      }

      // Prepare data for API
      const addressData = {
        address: formData.title,
        building_name: formData.buildingName,
        apartment_number: formData.aptNumber,
        house_number: formData.houseNo,
        block: formData.block,
        street: formData.street,
        floor: formData.floor,
        way: formData.way,
        phone: formData.phone,
        is_default: formData.isDefault,
        is_apartment: addressType === 'apartments',
        is_house: addressType === 'house',
      };

      // Call API to add address
      const response = await apiService.addAddress(addressData);
      console.log('Address saved:', response);

      if (response.success) {
        // Show success modal
        setShowSuccessModal(true);

        // Navigate back to addresses page after 2 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
          router.push('/addresses');
        }, 2000);
      } else {
        // Handle API error
        if (response.errors) {
          setErrors(response.errors);
        } else {
          setErrors({ general: [response.message || 'Failed to save address'] });
        }
      }
    } catch (error: any) {
      console.log('Error saving address:', error);

      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({ general: ['Failed to save address. Please try again.'] });
      }
    } finally {
      setSaving(false);
    }
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* General Errors */}
        {errors.general && (
          <View style={styles.errorContainer}>
            {errors.general.map((error, index) => (
              <Text key={index} style={styles.errorText}>{error}</Text>
            ))}
          </View>
        )}

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
          <View>
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              placeholder="Address Title (e.g. Home, Work)"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
            />
            {errors.title && (
              <View style={styles.fieldErrorContainer}>
                {errors.title.map((error, index) => (
                  <Text key={index} style={styles.errorText}>{error}</Text>
                ))}
              </View>
            )}
          </View>

          {addressType === 'apartments' ? (
            <>
              <View>
                <TextInput
                  style={[styles.input, errors.buildingName && styles.inputError]}
                  placeholder="Building name"
                  value={formData.buildingName}
                  onChangeText={(text) => setFormData({ ...formData, buildingName: text })}
                />
                {errors.buildingName && (
                  <View style={styles.fieldErrorContainer}>
                    {errors.buildingName.map((error, index) => (
                      <Text key={index} style={styles.errorText}>{error}</Text>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.row}>
                <View style={styles.halfInputContainer}>
                  <TextInput
                    style={[styles.input, errors.aptNumber && styles.inputError]}
                    placeholder="Apt. number"
                    value={formData.aptNumber}
                    onChangeText={(text) => setFormData({ ...formData, aptNumber: text })}
                  />
                  {errors.aptNumber && (
                    <View style={styles.fieldErrorContainer}>
                      {errors.aptNumber.map((error, index) => (
                        <Text key={index} style={styles.errorText}>{error}</Text>
                      ))}
                    </View>
                  )}
                </View>
                <View style={styles.halfInputContainer}>
                  <TextInput
                    style={[styles.input, errors.floor && styles.inputError]}
                    placeholder="Floor"
                    value={formData.floor}
                    onChangeText={(text) => setFormData({ ...formData, floor: text })}
                  />
                  {errors.floor && (
                    <View style={styles.fieldErrorContainer}>
                      {errors.floor.map((error, index) => (
                        <Text key={index} style={styles.errorText}>{error}</Text>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </>
          ) : (
            <View>
              <TextInput
                style={[styles.input, errors.houseNo && styles.inputError]}
                placeholder="House No."
                value={formData.houseNo}
                onChangeText={(text) => setFormData({ ...formData, houseNo: text })}
              />
              {errors.houseNo && (
                <View style={styles.fieldErrorContainer}>
                  {errors.houseNo.map((error, index) => (
                    <Text key={index} style={styles.errorText}>{error}</Text>
                  ))}
                </View>
              )}
            </View>
          )}

          <View>
            <TextInput
              style={[styles.input, errors.street && styles.inputError]}
              placeholder="Street"
              value={formData.street}
              onChangeText={(text) => setFormData({ ...formData, street: text })}
            />
            {errors.street && (
              <View style={styles.fieldErrorContainer}>
                {errors.street.map((error, index) => (
                  <Text key={index} style={styles.errorText}>{error}</Text>
                ))}
              </View>
            )}
          </View>

          <View style={styles.row}>
            <View style={styles.halfInputContainer}>
              <TextInput
                style={[styles.input, errors.block && styles.inputError]}
                placeholder="Block"
                value={formData.block}
                onChangeText={(text) => setFormData({ ...formData, block: text })}
              />
              {errors.block && (
                <View style={styles.fieldErrorContainer}>
                  {errors.block.map((error, index) => (
                    <Text key={index} style={styles.errorText}>{error}</Text>
                  ))}
                </View>
              )}
            </View>
            <View style={styles.halfInputContainer}>
              <TextInput
                style={[styles.input, errors.way && styles.inputError]}
                placeholder="Way (optional)"
                value={formData.way}
                onChangeText={(text) => setFormData({ ...formData, way: text })}
              />
              {errors.way && (
                <View style={styles.fieldErrorContainer}>
                  {errors.way.map((error, index) => (
                    <Text key={index} style={styles.errorText}>{error}</Text>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View>
            <View style={[styles.phoneInputContainer, errors.phone && styles.inputError]}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>+968</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="Phone number"
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                keyboardType="phone-pad"
              />
            </View>
            {errors.phone && (
              <View style={styles.fieldErrorContainer}>
                {errors.phone.map((error, index) => (
                  <Text key={index} style={styles.errorText}>{error}</Text>
                ))}
              </View>
            )}
          </View>

          {/* Default Address Checkbox */}
          <TouchableOpacity
            style={styles.checkboxOption}
            onPress={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
          >
            <View style={styles.checkbox}>
              {formData.isDefault && (
                <Ionicons name="checkmark" size={16} color="#2C3639" />
              )}
            </View>
            <Text style={styles.checkboxText}>Set as default address</Text>
          </TouchableOpacity>
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

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle" size={50} color="#4CAF50" />
            <Text style={styles.modalText}>Address saved successfully!</Text>
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
  inputError: {
    borderColor: '#E97777',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfInputContainer: {
    flex: 1,
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
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
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
  fieldErrorContainer: {
    marginTop: 4,
    paddingHorizontal: 4,
  },
  errorText: {
    color: '#E97777',
    fontSize: 12,
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
  modalText: {
    fontSize: 18,
    color: '#2C3639',
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
});