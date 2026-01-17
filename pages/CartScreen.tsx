import { EditCartItemDialog } from '@/components/cart/EditCartItemDialog';
import { MainLayout } from '@/components/layout/MainLayout';
import { CartItem as CartItemType, Topping, useAppStore } from '@/lib/store';
import React, { useState } from 'react';
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function CartScreen({ navigation }: any) {
  const {
    cart,
    updateQuantity,
    removeCartItemByIndex,
    clearCart,
    getCartTotal,
    updateCartItem,
  } = useAppStore();
  const [editingItem, setEditingItem] = useState<{
    item: CartItemType;
    index: number;
  } | null>(null);

  const deliveryFee = 1500;
  const subtotal = getCartTotal();
  const total = subtotal + deliveryFee;

  const handleSaveEdit = (index: number, toppings?: Topping[], notes?: string) => {
    updateCartItem(index, toppings, notes);
  };

  if (cart.length === 0) {
    return (
      <MainLayout navigation={navigation} currentRoute="Cart">
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Text style={styles.emptyIcon}>🛍️</Text>
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>သင့်ခြင်းထဲတွင် ဘာမှမရှိပါ</Text>
          <Pressable
            style={styles.browseButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.browseButtonText}>Browse Restaurants</Text>
          </Pressable>
        </View>
      </MainLayout>
    );
  }

  // Create items with their original index
  const cartWithIndices = cart.map((item, index) => ({
    item,
    originalIndex: index,
  }));

  // Group items by restaurant
  const itemsByRestaurant = cartWithIndices.reduce((acc, { item, originalIndex }) => {
    if (!acc[item.restaurantId]) {
      acc[item.restaurantId] = {
        restaurantName: item.restaurantName,
        items: [],
      };
    }
    acc[item.restaurantId].items.push({ item, originalIndex });
    return acc;
  }, {} as Record<string, { restaurantName: string; items: { item: CartItemType; originalIndex: number }[] }>);

  return (
    <MainLayout navigation={navigation} currentRoute="Cart">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Your Cart</Text>
            <Text style={styles.headerSubtitle}>သင့်ခြင်း</Text>
          </View>
          <Pressable onPress={clearCart} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>🗑️ Clear</Text>
          </Pressable>
        </View>

        {/* Cart Items by Restaurant */}
        <View style={styles.itemsContainer}>
          {Object.entries(itemsByRestaurant).map(
            ([restaurantId, { restaurantName, items }]) => (
              <View key={restaurantId} style={styles.restaurantCard}>
                <Text style={styles.restaurantName}>{restaurantName}</Text>

                {items.map(({ item, originalIndex }) => (
                  <View
                    key={`${item.menuItem.id}-${originalIndex}`}
                    style={styles.cartItem}
                  >
                    <Image
                      source={{ uri: item.menuItem.image }}
                      style={styles.itemImage}
                    />
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName}>{item.menuItem.name}</Text>
                      <Text style={styles.itemNameMM}>{item.menuItem.nameMM}</Text>

                      {/* Toppings */}
                      {item.toppings && item.toppings.length > 0 && (
                        <Text style={styles.toppings}>
                          + {item.toppings.map((t) => t.name).join(', ')}
                        </Text>
                      )}

                      {/* Notes */}
                      {item.notes && (
                        <View style={styles.notesContainer}>
                          <Text style={styles.notesIcon}>📝</Text>
                          <Text style={styles.notes} numberOfLines={2}>
                            {item.notes}
                          </Text>
                        </View>
                      )}

                      <Text style={styles.itemPrice}>
                        {(
                          item.menuItem.price +
                          (item.toppings?.reduce((sum, t) => sum + t.price, 0) || 0)
                        ).toLocaleString()}{' '}
                        Ks
                      </Text>
                    </View>

                    {/* Actions */}
                    <View style={styles.itemActions}>
                      <View style={styles.actionButtons}>
                        <Pressable
                          onPress={() =>
                            setEditingItem({ item, index: originalIndex })
                          }
                          style={styles.actionButton}
                        >
                          <Text style={styles.actionIcon}>✏️</Text>
                        </Pressable>
                        <Pressable
                          onPress={() => removeCartItemByIndex(originalIndex)}
                          style={styles.actionButton}
                        >
                          <Text style={styles.actionIcon}>🗑️</Text>
                        </Pressable>
                      </View>

                      {/* Quantity Controls */}
                      <View style={styles.quantityControls}>
                        <Pressable
                          onPress={() =>
                            updateQuantity(item.menuItem.id, item.quantity - 1)
                          }
                          style={styles.quantityButton}
                        >
                          <Text style={styles.quantityButtonText}>−</Text>
                        </Pressable>
                        <Text style={styles.quantity}>{item.quantity}</Text>
                        <Pressable
                          onPress={() =>
                            updateQuantity(item.menuItem.id, item.quantity + 1)
                          }
                          style={[styles.quantityButton, styles.quantityButtonPrimary]}
                        >
                          <Text style={styles.quantityButtonTextPrimary}>+</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )
          )}
        </View>

        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{subtotal.toLocaleString()} Ks</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>
              {deliveryFee.toLocaleString()} Ks
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{total.toLocaleString()} Ks</Text>
          </View>
        </View>

        {/* Checkout Button */}
        <Pressable
          style={styles.checkoutButton}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </Pressable>
      </ScrollView>

      {/* Edit Dialog */}
      {editingItem && (
        <EditCartItemDialog
          visible={!!editingItem}
          onClose={() => setEditingItem(null)}
          cartItem={editingItem.item}
          cartIndex={editingItem.index}
          onSave={handleSaveEdit}
        />
      )}
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    backgroundColor: '#f3f4f6',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  browseButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
  itemsContainer: {
    gap: 24,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  restaurantCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  itemNameMM: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  toppings: {
    fontSize: 11,
    color: '#10b981',
    fontWeight: '600',
    marginTop: 4,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
    marginTop: 4,
  },
  notesIcon: {
    fontSize: 10,
  },
  notes: {
    fontSize: 11,
    color: '#6B7280',
    fontStyle: 'italic',
    flex: 1,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10b981',
    marginTop: 4,
  },
  itemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    padding: 4,
  },
  actionIcon: {
    fontSize: 16,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonPrimary: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  quantityButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  quantityButtonTextPrimary: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    width: 20,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10b981',
  },
  checkoutButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  checkoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});