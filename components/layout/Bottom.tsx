import { useAppStore } from '@/lib/store';
import React, { useRef } from 'react';
import {
    Animated,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface NavItem {
  key: string;
  icon: string;
  label: string;
  labelMM: string;
  route: string;
}

const navItems: NavItem[] = [
  { key: 'home', icon: '🏠', label: 'Home', labelMM: 'ပင်မ', route: 'Home' },
  { key: 'orders', icon: '📋', label: 'Orders', labelMM: 'အော်ဒါများ', route: 'Orders' },
  { key: 'cart', icon: '🛒', label: 'Cart', labelMM: 'ခြင်း', route: 'Cart' },
  { key: 'profile', icon: '👤', label: 'Profile', labelMM: 'ပရိုဖိုင်', route: 'Profile' },
];

interface BottomNavProps {
  activeRoute: string;
  navigation: any;
  isDarkMode?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeRoute,
  navigation,
  isDarkMode = false,
}) => {
  const cartItemCount = useAppStore((state) => state.getCartItemCount());
  const scaleAnims = useRef(navItems.map(() => new Animated.Value(1))).current;

  const handlePress = (item: NavItem, index: number) => {
    // Animate press
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    navigation.navigate(item.route);
  };

  return (
    <View style={[styles.bottomNav, isDarkMode && styles.bottomNavDark]}>
      <View style={styles.navContainer}>
        {navItems.map((item, index) => {
          const isActive = activeRoute === item.route;

          return (
            <TouchableOpacity
              key={item.key}
              style={styles.navItem}
              onPress={() => handlePress(item, index)}
              activeOpacity={0.7}
            >
              <Animated.View
                style={[
                  styles.iconContainer,
                  { transform: [{ scale: scaleAnims[index] }] },
                ]}
              >
                <Text style={styles.navIcon}>{item.icon}</Text>
                {item.key === 'cart' && cartItemCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </Text>
                  </View>
                )}
              </Animated.View>
              <Text
                style={[
                  styles.navLabel,
                  isActive && styles.navLabelActive,
                  isDarkMode && styles.navLabelDark,
                ]}
              >
                {item.label}
              </Text>
              {isActive && (
                <View style={styles.activeIndicator} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  bottomNavDark: {
    backgroundColor: '#1F2937',
    borderTopColor: '#374151',
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  navIcon: {
    fontSize: 24,
  },
  navLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#EF4444',
    fontWeight: '600',
  },
  navLabelDark: {
    color: '#9CA3AF',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 40,
    height: 3,
    backgroundColor: '#EF4444',
    borderRadius: 2,
  },
});
