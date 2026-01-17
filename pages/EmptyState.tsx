import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppStore } from '../lib/store';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  subtitleMM?: string;
  actionText?: string;
  onAction?: () => void;
  variant?: 'default' | 'error' | 'no-results' | 'empty-cart';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  subtitleMM,
  actionText,
  onAction,
  variant = 'default',
}) => {
  const isDarkMode = useAppStore((state) => state.isDarkMode);

  // Default icons based on variant
  const defaultIcons = {
    default: '🍜',
    error: '❌',
    'no-results': '🔍',
    'empty-cart': '🛒',
  };

  const displayIcon = icon || defaultIcons[variant];

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{displayIcon}</Text>
      <Text style={[styles.title, isDarkMode && styles.titleDark]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[styles.subtitle, isDarkMode && styles.subtitleDark]}>
          {subtitle}
        </Text>
      )}
      {subtitleMM && (
        <Text style={[styles.subtitleMM, isDarkMode && styles.subtitleDark]}>
          {subtitleMM}
        </Text>
      )}
      
      {actionText && onAction && (
        <TouchableOpacity
          style={[styles.button, isDarkMode && styles.buttonDark]}
          onPress={onAction}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  titleDark: {
    color: '#F9FAFB',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitleMM: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitleDark: {
    color: '#9CA3AF',
  },
  button: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonDark: {
    backgroundColor: '#DC2626',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
