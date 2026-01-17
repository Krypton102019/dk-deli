import { Address, Order, useAppStore } from '@/lib/store';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function CheckoutScreen({ navigation }: any) {
  const { cart, getCartTotal, clearCart, addOrder, user, setUser } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [phone, setPhone] = useState(user?.phone || '');
  const [name, setName] = useState(user?.name || '');
  const [address, setAddress] = useState(
    user?.addresses.find((a) => a.isDefault)?.address || ''
  );
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');

  const deliveryFee = 1500;
  const subtotal = getCartTotal();
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!phone || !name || !address) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsProcessing(true);

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Create order
    const newAddress: Address = {
      id: Date.now().toString(),
      label: 'Home',
      address,
      isDefault: true,
    };

    const order: Order = {
      id: `ORD-${Date.now()}`,
      items: cart,
      total,
      deliveryFee,
      status: 'order_placed',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
      address: newAddress,
    };

    // Save user if not exists
    if (!user) {
      setUser({
        phone,
        name,
        addresses: [newAddress],
      });
    }

    addOrder(order);
    clearCart();

    Alert.alert(
      'Order Placed!',
      'Your order is being prepared',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('OrderTracking', { id: order.id }),
        },
      ]
    );
  };

  if (cart.length === 0) {
    navigation.navigate('Cart');
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Checkout</Text>
          <Text style={styles.headerSubtitle}>အော်ဒါတင်ရန်</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Delivery Details */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📍</Text>
            <Text style={styles.cardTitle}>Delivery Details</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name / အမည်</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone / ဖုန်းနံပါတ်</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="09xxxxxxxxx"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address / လိပ်စာ</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Enter your delivery address in Pyin Oo Lwin"
              placeholderTextColor="#9CA3AF"
              multiline
              style={[styles.input, styles.inputMultiline]}
            />
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>💳</Text>
            <Text style={styles.cardTitle}>Payment Method</Text>
          </View>

          {/* Cash on Delivery */}
          <Pressable
            onPress={() => setPaymentMethod('cash')}
            style={[
              styles.paymentOption,
              paymentMethod === 'cash' && styles.paymentOptionSelected,
            ]}
          >
            <View style={styles.paymentLeft}>
              <Text style={styles.paymentIcon}>💵</Text>
              <View>
                <Text style={styles.paymentTitle}>Cash on Delivery</Text>
                <Text style={styles.paymentSubtitle}>
                  ပို့ဆောင်ချိန် ငွေပေးချေရန်
                </Text>
              </View>
            </View>
            {paymentMethod === 'cash' && (
              <View style={styles.selectedBadge}>
                <Text style={styles.selectedBadgeText}>✓</Text>
              </View>
            )}
          </Pressable>

          {/* Card Payment (Disabled) */}
          <Pressable style={styles.paymentOptionDisabled}>
            <View style={styles.paymentLeft}>
              <Text style={styles.paymentIcon}>💳</Text>
              <View>
                <Text style={styles.paymentTitleDisabled}>Card Payment</Text>
                <Text style={styles.paymentSubtitle}>Coming soon</Text>
              </View>
            </View>
          </Pressable>
        </View>

        {/* Order Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Summary</Text>

          <View style={styles.summaryContainer}>
            {cart.map((item) => (
              <View key={item.menuItem.id} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  {item.menuItem.name} x{item.quantity}
                </Text>
                <Text style={styles.summaryValue}>
                  {(item.menuItem.price * item.quantity).toLocaleString()} Ks
                </Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                {subtotal.toLocaleString()} Ks
              </Text>
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
              <Text style={styles.totalValue}>
                {total.toLocaleString()} Ks
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.placeOrderButton, isProcessing && styles.placeOrderButtonDisabled]}
          onPress={handlePlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#ffffff" />
              <Text style={styles.placeOrderButtonText}>Processing...</Text>
            </View>
          ) : (
            <Text style={styles.placeOrderButtonText}>
              Place Order - {total.toLocaleString()} Ks
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#111827',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardIcon: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    marginBottom: 12,
  },
  paymentOptionSelected: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },
  paymentOptionDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    opacity: 0.5,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  paymentIcon: {
    fontSize: 24,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  paymentTitleDisabled: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  paymentSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  selectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  summaryContainer: {
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
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
  spacer: {
    height: 100,
  },
  footer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  placeOrderButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  placeOrderButtonDisabled: {
    opacity: 0.7,
  },
  placeOrderButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});