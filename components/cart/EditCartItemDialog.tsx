import React, { useState, useEffect } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { CartItem, Topping, ToppingOption } from '@/lib/store';
import { getRestaurantById } from '@/lib/mockData';

interface EditCartItemDialogProps {
  visible: boolean;
  onClose: () => void;
  cartItem: CartItem;
  cartIndex: number;
  onSave: (index: number, toppings?: Topping[], notes?: string) => void;
}

export const EditCartItemDialog = ({
  visible,
  onClose,
  cartItem,
  cartIndex,
  onSave,
}: EditCartItemDialogProps) => {
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const restaurant = getRestaurantById(cartItem.restaurantId);
  const menuItem = restaurant?.menu.find((item) => item.id === cartItem.menuItem.id);
  const availableToppings = menuItem?.toppings || [];

  useEffect(() => {
    if (visible) {
      setSelectedToppings(cartItem.toppings?.map((t) => t.id) || []);
      setNotes(cartItem.notes || '');
    }
  }, [visible, cartItem]);

  const toggleTopping = (toppingId: string) => {
    setSelectedToppings((prev) =>
      prev.includes(toppingId)
        ? prev.filter((id) => id !== toppingId)
        : [...prev, toppingId]
    );
  };

  const handleSave = () => {
    const selectedToppingObjects = selectedToppings
      .map((id) => availableToppings.find((t) => t.id === id))
      .filter((t): t is ToppingOption => t !== undefined);

    onSave(
      cartIndex,
      selectedToppingObjects.length > 0 ? selectedToppingObjects : undefined,
      notes.trim() || undefined
    );
    onClose();
  };

  const toppingsTotal = selectedToppings.reduce((sum, id) => {
    const topping = availableToppings.find((t) => t.id === id);
    return sum + (topping?.price || 0);
  }, 0);

  const itemTotal = cartItem.menuItem.price + toppingsTotal;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Image
                source={{ uri: cartItem.menuItem.image }}
                style={styles.headerImage}
              />
              <View style={styles.headerText}>
                <Text style={styles.itemName}>{cartItem.menuItem.name}</Text>
                <Text style={styles.itemNameMM}>{cartItem.menuItem.nameMM}</Text>
              </View>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {/* Toppings */}
            {availableToppings.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Toppings{' '}
                  <Text style={styles.sectionTitleMM}>ပါဝင်ပစ္စည်းများ</Text>
                </Text>
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

            {/* Special Instructions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Special Instructions{' '}
                <Text style={styles.sectionTitleMM}>အထူးမှာကြားချက်များ</Text>
              </Text>
              <TextInput
                value={notes}
                onChangeText={(text) => setNotes(text.slice(0, 200))}
                placeholder="Add any special requests..."
                placeholderTextColor="#9CA3AF"
                multiline
                maxLength={200}
                style={styles.textArea}
              />
              <Text style={styles.charCount}>{notes.length}/200</Text>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <View>
              <Text style={styles.footerLabel}>Item Total</Text>
              <Text style={styles.footerPrice}>
                {itemTotal.toLocaleString()} Ks
              </Text>
            </View>
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  headerText: {
    flex: 1,
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
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#6B7280',
  },
  scrollView: {
    maxHeight: 400,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  sectionTitleMM: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
  },
  toppingsList: {
    gap: 8,
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
    minHeight: 80,
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  footerPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10b981',
  },
  saveButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});