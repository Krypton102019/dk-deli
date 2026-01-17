import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search restaurants or dishes... ရှာဖွေမည်',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChange}
          returnKeyType="search"
        />
        {/* <View style={styles.searchIcon}>
          <Text style={styles.iconText}>🔍</Text>
        </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchWrapper: {
    position: 'relative',
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingLeft: 48,
    paddingRight: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: '#111827',
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  iconText: {
    fontSize: 20,
  },
});
