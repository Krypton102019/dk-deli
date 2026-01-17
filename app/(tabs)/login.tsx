import { useAppStore } from '@/lib/store';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function LoginScreen({ navigation }: any) {
  const { setUser } = useAppStore();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState<'phone' | 'name'>('phone');
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneSubmit = () => {
    if (!phone || phone.length < 9) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }
    setStep('name');
  };

  const handleLogin = async () => {
    if (!name) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setUser({
      phone,
      name,
      addresses: [],
    });

    Alert.alert(
      'Success',
      `Welcome, ${name}!`,
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home'),
        },
      ]
    );

    setIsLoading(false);
  };

  return (
    <LinearGradient
      colors={['#10b981', '#059669', '#047857']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>DK</Text>
            </View>
            <Text style={styles.subtitle}>Delivery</Text>
            <Text style={styles.subtitleMM}>ပြင်ဦးလွင် ပို့ဆောင်ရေး</Text>
          </View>

          {/* Login Form */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>
              {step === 'phone' ? 'Login / Sign Up' : 'Almost there!'}
            </Text>
            <Text style={styles.formSubtitle}>
              {step === 'phone' ? 'ဖုန်းနံပါတ်ထည့်ပါ' : 'သင့်အမည်ထည့်ပါ'}
            </Text>

            {step === 'phone' ? (
              <View style={styles.formContent}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputIcon}>📱</Text>
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="09xxxxxxxxx"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                    style={styles.input}
                    autoFocus
                  />
                </View>
                <Pressable
                  style={styles.primaryButton}
                  onPress={handlePhoneSubmit}
                >
                  <Text style={styles.primaryButtonText}>Continue</Text>
                  <Text style={styles.buttonIcon}>→</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.formContent}>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name / သင့်အမည်"
                  placeholderTextColor="#9CA3AF"
                  style={styles.inputSimple}
                  autoFocus
                />
                <Pressable
                  style={[
                    styles.primaryButton,
                    isLoading && styles.primaryButtonDisabled,
                  ]}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator color="#ffffff" size="small" />
                      <Text style={styles.primaryButtonText}>Logging in...</Text>
                    </View>
                  ) : (
                    <>
                      <Text style={styles.primaryButtonText}>Get Started</Text>
                      <Text style={styles.buttonIcon}>→</Text>
                    </>
                  )}
                </Pressable>
                <Pressable
                  onPress={() => setStep('phone')}
                  style={styles.backButton}
                >
                  <Text style={styles.backButtonText}>
                    ← Change phone number
                  </Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms of Service
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 48,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 48,
  },
  logoContainer: {
    marginBottom: 8,
  },
  logo: {
    fontSize: 72,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -2,
  },
  subtitle: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
  },
  subtitleMM: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  formContent: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  inputSimple: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    fontSize: 16,
    color: '#111827',
  },
  primaryButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonIcon: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 24,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
});