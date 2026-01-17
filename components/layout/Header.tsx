import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useAppStore } from '@/lib/store';

export const Header = () => {
  const { isDarkMode, toggleDarkMode, user } = useAppStore();
  const defaultAddress = user?.addresses.find(a => a.isDefault);

  return (
    <View style={[styles.header, isDarkMode && styles.headerDark]}>
      <View style={styles.container}>
        {/* Location */}
        <View style={styles.locationContainer}>
          <Text style={styles.locationIcon}>📍</Text>
          <View>
            <Text style={[styles.deliverTo, isDarkMode && styles.textDark]}>
              Deliver to
            </Text>
            <Text style={[styles.location, isDarkMode && styles.textDark]}>
              {defaultAddress?.label || 'ပြင်ဦးလွင်'}
            </Text>
          </View>
        </View>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={[styles.logo, isDarkMode && styles.textDark]}>DK</Text>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={toggleDarkMode}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>{isDarkMode ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>🔔</Text>
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#EF4444',
  },
  headerDark: {
    backgroundColor: '#DC2626',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationIcon: {
    fontSize: 20,
  },
  deliverTo: {
    fontSize: 12,
    color: '#FEE2E2',
  },
  location: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  actionsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  icon: {
    fontSize: 20,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FBBF24',
  },
  textDark: {
    color: '#FFFFFF',
  },
});