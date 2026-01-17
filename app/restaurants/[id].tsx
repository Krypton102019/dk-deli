import { getRestaurantById } from '@/lib/mockData';
import { MenuItem, useAppStore } from '@/lib/store';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function RestaurantDetailScreen({ route, navigation }: any) {
  const { id } = route.params;
  const restaurant = getRestaurantById(id || '');
  const { addToCart, cart, updateQuantity } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!restaurant) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Restaurant not found</Text>
        <Pressable style={styles.errorButton} onPress={() => navigation.goBack()}>
          <Text style={styles.errorButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const menuCategories = ['all', ...new Set(restaurant.menu.map((item) => item.category))];
  const filteredMenu = selectedCategory === 'all'
    ? restaurant.menu
    : restaurant.menu.filter((item) => item.category === selectedCategory);

  const getItemQuantityInCart = (itemId: string) => {
    const cartItem = cart.find(
      (item) => item.menuItem.id === itemId && item.restaurantId === restaurant.id
    );
    return cartItem?.quantity || 0;
  };

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item, restaurant.id, restaurant.name);
    Alert.alert('Success', `${item.name} added to cart`);
  };

  const handleNavigateToFood = (itemId: string) => {
    navigation.navigate('FoodDetail', {
      restaurantId: restaurant.id,
      itemId: itemId,
    });
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.container}>
      {/* Cover Image */}
      <View style={styles.coverContainer}>
        <Image
          source={{ uri: restaurant.coverImage }}
          style={styles.coverImage}
          resizeMode="cover"
        />
        <View style={styles.coverOverlay} />

        {/* Back Button */}
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Restaurant Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={styles.infoLeft}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <Text style={styles.restaurantNameMM}>{restaurant.nameMM}</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingStar}>⭐</Text>
              <Text style={styles.ratingText}>{restaurant.rating}</Text>
              <Text style={styles.reviewCount}>({restaurant.reviewCount})</Text>
            </View>
          </View>

          <Text style={styles.description}>{restaurant.description}</Text>

          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>🕐</Text>
              <Text style={styles.metaText}>{restaurant.deliveryTime}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>🚴</Text>
              <Text style={styles.metaText}>
                {restaurant.deliveryFee.toLocaleString()} Ks delivery
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Categories */}
        <View style={styles.categoriesSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {menuCategories.map((category) => (
              <Pressable
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive,
                  ]}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {filteredMenu.map((item, index) => {
            const quantityInCart = getItemQuantityInCart(item.id);

            return (
              <View key={item.id} style={styles.menuItem}>
                <Pressable
                  onPress={() => handleNavigateToFood(item.id)}
                  style={styles.menuItemImage}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.itemImage}
                    resizeMode="cover"
                  />
                </Pressable>

                <View style={styles.menuItemContent}>
                  <Pressable
                    onPress={() => handleNavigateToFood(item.id)}
                    style={styles.menuItemHeader}
                  >
                    <View style={styles.menuItemTitleContainer}>
                      <Text style={styles.itemName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.itemNameMM} numberOfLines={1}>
                        {item.nameMM}
                      </Text>
                    </View>
                    <View style={styles.badges}>
                      {item.isPopular && (
                        <View style={styles.badgePopular}>
                          <Text style={styles.badgePopularText}>Popular</Text>
                        </View>
                      )}
                      {item.isSpicy && (
                        <View style={styles.badgeSpicy}>
                          <Text style={styles.badgeSpicyText}>🔥</Text>
                        </View>
                      )}
                    </View>
                  </Pressable>

                  <Text style={styles.itemDescription} numberOfLines={2}>
                    {item.description}
                  </Text>

                  <View style={styles.menuItemFooter}>
                    <Text style={styles.itemPrice}>
                      {item.price.toLocaleString()} Ks
                    </Text>

                    {quantityInCart > 0 ? (
                      <View style={styles.quantityControls}>
                        <Pressable
                          onPress={() => updateQuantity(item.id, quantityInCart - 1)}
                          style={styles.quantityButtonOutline}
                        >
                          <Text style={styles.quantityButtonText}>−</Text>
                        </Pressable>
                        <Text style={styles.quantityText}>{quantityInCart}</Text>
                        <Pressable
                          onPress={() => handleAddToCart(item)}
                          style={styles.quantityButtonPrimary}
                        >
                          <Text style={styles.quantityButtonTextPrimary}>+</Text>
                        </Pressable>
                      </View>
                    ) : (
                      <Pressable
                        onPress={() => handleAddToCart(item)}
                        style={styles.addButton}
                      >
                        <Text style={styles.addButtonText}>+ Add</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Bottom spacing for floating button */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <View style={styles.floatingButtonContainer}>
          <Pressable
            style={styles.floatingButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Text style={styles.floatingButtonText}>
              View Cart ({totalCartItems} items)
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  errorButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  errorButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  coverContainer: {
    height: 240,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  backButtonText: {
    fontSize: 20,
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: -32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoLeft: {
    flex: 1,
    marginRight: 12,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  restaurantNameMM: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingStar: {
    fontSize: 12,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  reviewCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 12,
    lineHeight: 18,
  },
  metaInfo: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaIcon: {
    fontSize: 16,
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
  },
  categoriesSection: {
    marginTop: 24,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  categoryButtonActive: {
    backgroundColor: '#10b981',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  menuSection: {
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 16,
  },
  menuItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemImage: {
    width: 96,
    height: 96,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  menuItemContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  menuItemTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  itemNameMM: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  badges: {
    flexDirection: 'row',
    gap: 4,
  },
  badgePopular: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgePopularText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1d4ed8',
  },
  badgeSpicy: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeSpicyText: {
    fontSize: 10,
  },
  itemDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 16,
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10b981',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityButtonOutline: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  quantityButtonPrimary: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  quantityButtonTextPrimary: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    minWidth: 24,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 100,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
  },
  floatingButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  floatingButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});