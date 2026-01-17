import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  Platform,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  User,
  MapPin,
  Phone,
  LogOut,
  Sun,
  ChevronRight,
  Globe,
  Bell,
  Heart,
  HelpCircle,
  Shield,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import your actual store
// import { useAppStore } from '@/lib/store';

// Mock store for now - replace with actual implementation
const useAppStore = () => ({
  user: {
    name: 'John Doe',
    phone: '+95 9123456789',
    addresses: [
      { id: '1', label: 'Home', address: '123 Main St, Yangon', isDefault: true },
    ],
  },
  setUser: (user: any) => console.log('Set user:', user),
  isDarkMode: false,
  toggleDarkMode: () => console.log('Toggle dark mode'),
  addAddress: (address: any) => console.log('Add address:', address),
});

export default function ProfileScreen() {
  const router = useRouter();
  const { user, setUser, isDarkMode, toggleDarkMode, addAddress } = useAppStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [newAddress, setNewAddress] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [language, setLanguage] = useState('EN');

  const showToast = (message: string) => {
    Alert.alert('', message);
  };

  const handleSave = () => {
    if (!name || !phone) {
      showToast('Please fill in all fields');
      return;
    }
    setUser({ phone, name, addresses: user?.addresses || [] });
    setIsEditing(false);
    showToast('Profile updated!');
  };

  const handleAddAddress = () => {
    if (!newAddress) {
      showToast('Please enter an address');
      return;
    }
    addAddress({
      id: Date.now().toString(),
      label: 'Home',
      address: newAddress,
      isDefault: !user?.addresses.length,
    });
    setNewAddress('');
    setShowAddAddress(false);
    showToast('Address added!');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          setUser(null);
          router.replace('/login');
        },
      },
    ]);
  };

  const toggleLanguage = () => {
    const newLang = language === 'EN' ? 'မြန်မာ' : 'EN';
    setLanguage(newLang);
    showToast(`Language changed to ${newLang === 'EN' ? 'English' : 'Myanmar'}`);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <User size={48} color="#9ca3af" />
          </View>
          <Text style={styles.emptyTitle}>Welcome to DK Delivery</Text>
          <Text style={styles.emptySubtitle}>DK Delivery မှ ကြိုဆိုပါသည်</Text>
          <TouchableOpacity
            onPress={() => router.push('/login')}
            style={styles.loginButton}
          >
            <Text style={styles.loginButtonText}>Login / Sign Up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <View style={styles.card}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              {isEditing ? (
                <>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Your name"
                    style={[styles.input, styles.inputMargin]}
                  />
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Phone number"
                    keyboardType="phone-pad"
                    style={styles.input}
                  />
                </>
              ) : (
                <>
                  <Text style={styles.userName}>{user.name}</Text>
                  <View style={styles.phoneContainer}>
                    <Phone size={16} color="#6b7280" />
                    <Text style={styles.phoneText}>{user.phone}</Text>
                  </View>
                </>
              )}
            </View>
          </View>

          {isEditing ? (
            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsEditing(false);
                  setName(user.name);
                  setPhone(user.phone);
                }}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Addresses */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitle}>
              <MapPin size={20} color="#ef4444" />
              <Text style={styles.sectionTitleText}>Saved Addresses</Text>
            </View>
            <TouchableOpacity onPress={() => setShowAddAddress(!showAddAddress)}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {showAddAddress && (
            <View style={styles.addAddressRow}>
              <TextInput
                value={newAddress}
                onChangeText={setNewAddress}
                placeholder="Enter new address"
                style={[styles.input, styles.addressInput]}
              />
              <TouchableOpacity onPress={handleAddAddress} style={styles.addButton}>
                <Text style={styles.addButtonTextWhite}>Add</Text>
              </TouchableOpacity>
            </View>
          )}

          {user.addresses.length > 0 ? (
            <View style={styles.addressList}>
              {user.addresses.map((address) => (
                <View key={address.id} style={styles.addressItem}>
                  <View style={styles.addressHeader}>
                    <Text style={styles.addressLabel}>{address.label}</Text>
                    {address.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Default</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.addressText}>{address.address}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No saved addresses</Text>
          )}
        </View>

        {/* Settings */}
        <Text style={styles.settingsTitle}>Settings</Text>
        <View style={styles.card}>
          <TouchableOpacity onPress={toggleDarkMode} style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Sun size={20} color="#f59e0b" />
              <Text style={styles.menuItemText}>Dark Mode</Text>
            </View>
            <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity onPress={toggleLanguage} style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Globe size={20} color="#3b82f6" />
              <Text style={styles.menuItemText}>Language</Text>
            </View>
            <View style={styles.languageButtons}>
              <View style={[styles.langButton, language === 'EN' && styles.langButtonActive]}>
                <Text style={[styles.langText, language === 'EN' && styles.langTextActive]}>
                  EN
                </Text>
              </View>
              <View style={[styles.langButton, language === 'မြန်မာ' && styles.langButtonActive]}>
                <Text style={[styles.langText, language === 'မြန်မာ' && styles.langTextActive]}>
                  မြန်မာ
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Other Options */}
        <View style={styles.card}>
          <MenuItem icon={Bell} color="#a855f7" label="Notifications" />
          <MenuItem icon={Heart} color="#ec4899" label="Favorites" />
          <MenuItem icon={HelpCircle} color="#06b6d4" label="Help & Support" />
          <MenuItem icon={Shield} color="#10b981" label="Privacy Policy" isLast />
        </View>

        {/* App Version */}
        <View style={styles.appInfo}>
          <View style={styles.appLogo}>
            <Text style={styles.appLogoText}>DK</Text>
          </View>
          <Text style={styles.appVersion}>DK Delivery v1.0.0</Text>
        </View>

        {/* Logout */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutCard}>
          <View style={styles.menuItemContent}>
            <LogOut size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </View>
          <ChevronRight size={20} color="#ef4444" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({ icon: Icon, color, label, isLast = false }: any) {
  return (
    <>
      <TouchableOpacity
        onPress={() => Alert.alert('', `${label} coming soon`)}
        style={styles.menuItem}
      >
        <View style={styles.menuItemContent}>
          <Icon size={20} color={color} />
          <Text style={styles.menuItemText}>{label}</Text>
        </View>
        <ChevronRight size={20} color="#9ca3af" />
      </TouchableOpacity>
      {!isLast && <View style={styles.divider} />}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  scrollView: { flex: 1 },
  content: { padding: 16, paddingBottom: 100 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  emptyIconContainer: { width: 96, height: 96, backgroundColor: '#f3f4f6', borderRadius: 48, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  emptyTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  emptySubtitle: { color: '#6b7280', marginBottom: 24, textAlign: 'center' },
  loginButton: { backgroundColor: '#ef4444', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 12 },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  avatar: { width: 64, height: 64, backgroundColor: '#ef4444', borderRadius: 32, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  profileInfo: { flex: 1 },
  userName: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  phoneContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  phoneText: { color: '#6b7280' },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12 },
  inputMargin: { marginBottom: 8 },
  buttonRow: { flexDirection: 'row', gap: 8 },
  saveButton: { flex: 1, backgroundColor: '#ef4444', padding: 12, borderRadius: 8, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: '600' },
  cancelButton: { backgroundColor: '#f3f4f6', padding: 12, borderRadius: 8, alignItems: 'center', minWidth: 80 },
  cancelButtonText: { color: '#374151', fontWeight: '600' },
  editButton: { borderWidth: 1, borderColor: '#e5e7eb', padding: 12, borderRadius: 8, alignItems: 'center' },
  editButtonText: { fontWeight: '600' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitleText: { fontSize: 16, fontWeight: '600' },
  addButtonText: { color: '#ef4444', fontWeight: '600' },
  addAddressRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  addressInput: { flex: 1 },
  addButton: { backgroundColor: '#ef4444', paddingHorizontal: 20, borderRadius: 8, justifyContent: 'center' },
  addButtonTextWhite: { color: '#fff', fontWeight: '600' },
  addressList: { gap: 12 },
  addressItem: { backgroundColor: '#f9fafb', padding: 12, borderRadius: 12 },
  addressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  addressLabel: { fontWeight: '600' },
  defaultBadge: { backgroundColor: 'rgba(239, 68, 68, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  defaultBadgeText: { fontSize: 12, color: '#ef4444', fontWeight: '500' },
  addressText: { fontSize: 14, color: '#6b7280' },
  emptyText: { textAlign: 'center', color: '#6b7280', paddingVertical: 16 },
  settingsTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  menuItemContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuItemText: { fontSize: 16, fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#e5e7eb' },
  languageButtons: { flexDirection: 'row', gap: 8 },
  langButton: { backgroundColor: '#f3f4f6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  langButtonActive: { backgroundColor: '#ef4444' },
  langText: { fontSize: 14, fontWeight: '500', color: '#6b7280' },
  langTextActive: { color: '#fff' },
  appInfo: { alignItems: 'center', marginBottom: 16 },
  appLogo: { width: 96, height: 96, backgroundColor: '#ef4444', borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 4 },
  appLogoText: { fontSize: 36, fontWeight: 'bold', color: '#fff' },
  appVersion: { fontSize: 14, color: '#6b7280' },
  logoutCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  logoutText: { fontSize: 16, fontWeight: '500', color: '#ef4444' },
});