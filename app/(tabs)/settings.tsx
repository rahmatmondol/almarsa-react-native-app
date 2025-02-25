import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Settings() {
  const handleLogout = () => {
    router.replace('/auth');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Ionicons name="settings-outline" size={24} color="#fff" />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Settings */}
        <View style={styles.section}>
          <Link href="/change-email" asChild>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Change email</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          </Link>

          <Link href="/change-password" asChild>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Change password</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          </Link>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuItemText}>Notifications</Text>
              <Text style={styles.menuItemStatus}>Enabled</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <Link href="/edit-account" asChild>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Account info</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          </Link>
         
        </View>

        {/* Authentication */}
        <View style={styles.authSection}>
          <TouchableOpacity 
            style={styles.authButton}
            onPress={handleLogout}
          >
            <Text style={styles.authButtonText}>Log out</Text>
          </TouchableOpacity>

          <Link href="/login" asChild>
            <TouchableOpacity style={[styles.authButton, styles.loginButton]}>
              <Text style={[styles.authButtonText, styles.loginButtonText]}>
                Login
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Shop Button */}
        <Link href="/shop" asChild>
          <TouchableOpacity style={styles.shopButton}>
            <Text style={styles.shopButtonText}>Go to shop</Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2C3639',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemLeft: {
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: '#2C3639',
  },
  menuItemStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  authSection: {
    padding: 16,
    gap: 12,
  },
  authButton: {
    backgroundColor: '#2C3639',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2C3639',
  },
  loginButtonText: {
    color: '#2C3639',
  },
  shopButton: {
    backgroundColor: '#2C3639',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});