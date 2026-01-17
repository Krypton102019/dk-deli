import { Restaurant } from '@/lib/store';
import React, { memo } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
  variant?: 'horizontal' | 'vertical';
  index?: number;
}

export const RestaurantCard = memo<RestaurantCardProps>(({
  restaurant,
  onPress,
  variant = 'vertical',
  index = 0,
}) => {
  if (variant === 'horizontal') {
    return (
      <TouchableOpacity
        style={styles.cardHorizontal}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: restaurant.image }}
          style={styles.imageHorizontal}
          resizeMode="cover"
        />
        {!restaurant.isOpen && (
          <View style={styles.closedOverlay}>
            <Text style={styles.closedText}>Closed</Text>
          </View>
        )}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>⭐ {restaurant.rating}</Text>
        </View>
        <View style={styles.infoHorizontal}>
          <Text style={styles.name} numberOfLines={1}>
            {restaurant.name}
          </Text>
          <Text style={styles.nameMM} numberOfLines={1}>
            {restaurant.nameMM}
          </Text>
          <View style={styles.meta}>
            <Text style={styles.metaText}>🕐 {restaurant.deliveryTime}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: restaurant.image }}
          style={styles.image}
          resizeMode="cover"
        />
        {!restaurant.isOpen && (
          <View style={styles.closedOverlay}>
            <Text style={styles.closedText}>Closed</Text>
          </View>
        )}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>⭐ {restaurant.rating}</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {restaurant.name}
        </Text>
        <Text style={styles.nameMM} numberOfLines={1}>
          {restaurant.nameMM}
        </Text>
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaText}>🕐 {restaurant.deliveryTime}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaText}>
              🚲 {restaurant.deliveryFee.toLocaleString()} Ks
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

RestaurantCard.displayName = 'RestaurantCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHorizontal: {
    width: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180,
  },
  imageHorizontal: {
    width: '100%',
    height: 160,
  },
  closedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closedText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    padding: 16,
  },
  infoHorizontal: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  nameMM: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  meta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
  },
});
