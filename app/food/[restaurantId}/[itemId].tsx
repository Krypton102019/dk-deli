import { getRestaurantById } from '@/lib/mockData';
import { ToppingOption, useAppStore } from '@/lib/store';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function FoodDetailScreen({ route, navigation }: any) {
  const { restaurantId, itemId } = route.params;
  const { addToCart } = useAppStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const restaurant = getRestaurantById(restaurantId || '');
  const menuItem = restaurant?.menu.find((item) => item.id === itemId);

  if (!restaurant || !menuItem) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Item not found</Text>
        <Pressable style={styles.errorButton} onPress={() => navigation.goBack()}>
          <Text style={styles.errorButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const toggleTopping = (toppingId: string) => {
    setSelectedToppings((prev) =>
      prev.includes(toppingId)
        ? prev.filter((id) => id !== toppingId)
        : [...prev, toppingId]
    );
  };

  const availableToppings = menuItem.toppings || [];

  const toppingsTotal = selectedToppings.reduce((sum, id) => {
    const topping = availableToppings.find((t) => t.id === id);
    return sum + (topping?.price || 0);
  }, 0);

  const itemTotal = (menuItem.price + toppingsTotal) * quantity;

  const handleAddToCart = () => {
    const selectedToppingObjects = selectedToppings
      .map((id) => availableToppings.find((t) => t.id === id))
      .filter((t): t is ToppingOption => t !== undefined);

    for (let i = 0; i < quantity; i++) {
      addToCart(
        menuItem,
        restaurant.id,
        restaurant.name,
        selectedToppingObjects.length > 0 ? selectedToppingObjects : undefined,
        notes.trim() || undefined
      );
    }

    const toppingNames = selectedToppingObjects.map((t) => t.name);
    let message = `Added ${quantity}x ${menuItem.name} to cart`;
    if (toppingNames.length > 0) {
      message += ` with ${toppingNames.join(', ')}`;
    }

    Alert.alert('Success', message, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: menuItem.image }}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <View style={styles.imageOverlay} />

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
        {/* Main Info Card */}
        <View style={styles.mainCard}>
          {/* Title & Price */}
          <View style={styles.titleContainer}>
            <View style={styles.titleLeft}>
              <Text style={styles.itemName}>{menuItem.name}</Text>
              {menuItem.nameMM && (
                <Text style={styles.itemNameMM}>{menuItem.nameMM}</Text>
              )}
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>
                {menuItem.price.toLocaleString()} Ks
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description}>{menuItem.description}</Text>

          {/* Category Badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{menuItem.category}</Text>
          </View>

          {/* Restaurant Info */}
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantLabel}>From </Text>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
          </View>
        </View>

        {/* Toppings Card */}
        {availableToppings.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Add Toppings</Text>
            <Text style={styles.cardSubtitle}>ပါဝင်ပစ္စည်းများ ထပ်ထည့်ရန်</Text>

            <View style={styles.toppingsList}>
              {availableToppings.map((topping) => {
                const isSelected = selectedToppings.includes(topping.id);
                return (
                  <Pressable
                    key={topping.id}
                    onPress={() => toggleTopping(topping.id)}
                    style={[
                      styles.toppingItem,
                      isSelected && styles.toppingItemSelected,
                    ]}
                  >
                    <View style={styles.toppingLeft}>
                      <View
                        style={[
                          styles.checkbox,
                          isSelected && styles.checkboxSelected,
                        ]}
                      >
                        {isSelected && (
                          <Text style={styles.checkmark}>✓</Text>
                        )}
                      </View>
                      <View>
                        <Text style={styles.toppingName}>{topping.name}</Text>
                        <Text style={styles.toppingNameMM}>
                          {topping.nameMM}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.toppingPrice,
                        topping.price === 0 && styles.toppingPriceFree,
                      ]}
                    >
                      {topping.price > 0
                        ? `+${topping.price.toLocaleString()} Ks`
                        : 'Free'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Special Notes Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Special Instructions</Text>
          <Text style={styles.cardSubtitle}>အထူးမှာကြားချက်များ</Text>

          <TextInput
            value={notes}
            onChangeText={(text) => setNotes(text.slice(0, 200))}
            placeholder="Add any special requests (allergies, preferences, etc.)"
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={200}
            style={styles.textArea}
          />
          <Text style={styles.charCount}>{notes.length}/200</Text>
        </View>

        {/* Bottom spacing for fixed bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        {toppingsTotal > 0 && (
          <View style={styles.toppingsSummary}>
            <Text style={styles.toppingsSummaryText}>
              Toppings ({selectedToppings.length})
            </Text>
            <Text style={styles.toppingsSummaryText}>
              +{toppingsTotal.toLocaleString()} Ks
            </Text>
          </View>
        )}

        <View style={styles.bottomBarContent}>
          {/* Quantity Selector */}
          <View style={styles.quantityContainer}>
            <Pressable
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              style={styles.quantityButton}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </Pressable>
            <Text style={styles.quantityText}>{quantity}</Text>
            <Pressable
              onPress={() => setQuantity((q) => q + 1)}
              style={styles.quantityButton}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </Pressable>
          </View>

          {/* Add to Cart Button */}
          <Pressable
            style={styles.addButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.addButtonIcon}>🛒</Text>
            <Text style={styles.addButtonText}>
              Add - {itemTotal.toLocaleString()} Ks
            </Text>
          </Pressable>
        </View>
      </View>
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
  imageContainer: {
    position: 'relative',
    height: 280,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
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
  mainCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginTop: -32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleLeft: {
    flex: 1,
    marginRight: 16,
  },
  itemName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  itemNameMM: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10b981',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 24,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10b981',
  },
  restaurantInfo: {
    flexDirection: 'row',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  restaurantLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  restaurantName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: 16,
  },
  toppingsList: {
    gap: 12,
  },
  toppingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  toppingItemSelected: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },
  toppingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#10b981',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  toppingName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  toppingNameMM: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  toppingPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10b981',
  },
  toppingPriceFree: {
    color: '#6B7280',
  },
  textArea: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    fontSize: 14,
    color: '#111827',
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 4,
  },
  bottomSpacer: {
    height: 120,
  },
  bottomBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  toppingsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  toppingsSummaryText: {
    fontSize: 13,
    color: '#6B7280',
  },
  bottomBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 8,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    minWidth: 32,
    textAlign: 'center',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  addButtonIcon: {
    fontSize: 20,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});