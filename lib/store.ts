import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ToppingOption {
  id: string;
  name: string;
  nameMM: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  nameMM: string;
  description: string;
  descriptionMM: string;
  price: number;
  image: string;
  category: string;
  isPopular?: boolean;
  isSpicy?: boolean;
  toppings?: ToppingOption[];
}

export interface Restaurant {
  id: string;
  name: string;
  nameMM: string;
  description: string;
  descriptionMM: string;
  image: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  category: string;
  categories: string[];
  isOpen: boolean;
  menu: MenuItem[];
}

export interface Topping {
  id: string;
  name: string;
  nameMM: string;
  price: number;
}

export interface CartItem {
  menuItem: MenuItem;
  restaurantId: string;
  restaurantName: string;
  quantity: number;
  toppings?: Topping[];
  notes?: string;
}

export interface Address {
  id: string;
  label: string;
  address: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  deliveryFee: number;
  status: 'order_placed' | 'confirmed' | 'preparing' | 'on_the_way' | 'delivered';
  createdAt: string;
  estimatedDelivery: string;
  address: Address;
}

export interface User {
  phone: string;
  name: string;
  addresses: Address[];
}

interface AppState {
  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem, restaurantId: string, restaurantName: string, toppings?: Topping[], notes?: string) => void;
  removeFromCart: (itemId: string) => void;
  removeCartItemByIndex: (index: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateCartItem: (index: number, toppings?: Topping[], notes?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;

  // User
  user: User | null;
  setUser: (user: User | null) => void;
  addAddress: (address: Address) => void;
  removeAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;

  // Orders
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // App state
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (value: boolean) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Cart
      cart: [],
      addToCart: (item, restaurantId, restaurantName, toppings, notes) => {
        set((state) => {
          const toppingsKey = toppings?.map(t => t.id).sort().join(',') || '';
          const existingItem = state.cart.find(
            (cartItem) => 
              cartItem.menuItem.id === item.id && 
              cartItem.restaurantId === restaurantId &&
              (cartItem.toppings?.map(t => t.id).sort().join(',') || '') === toppingsKey &&
              (cartItem.notes || '') === (notes || '')
          );
          if (existingItem) {
            return {
              cart: state.cart.map((cartItem) =>
                cartItem === existingItem
                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                  : cartItem
              ),
            };
          }
          return {
            cart: [...state.cart, { menuItem: item, restaurantId, restaurantName, quantity: 1, toppings, notes }],
          };
        });
      },
      removeFromCart: (itemId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.menuItem.id !== itemId),
        }));
      },
      removeCartItemByIndex: (index) => {
        set((state) => ({
          cart: state.cart.filter((_, i) => i !== index),
        }));
      },
      updateQuantity: (itemId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { cart: state.cart.filter((item) => item.menuItem.id !== itemId) };
          }
          return {
            cart: state.cart.map((item) =>
              item.menuItem.id === itemId ? { ...item, quantity } : item
            ),
          };
        });
      },
      updateCartItem: (index, toppings, notes) => {
        set((state) => ({
          cart: state.cart.map((item, i) =>
            i === index ? { ...item, toppings, notes } : item
          ),
        }));
      },
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => {
          const toppingsTotal = item.toppings?.reduce((sum, t) => sum + t.price, 0) || 0;
          return total + (item.menuItem.price + toppingsTotal) * item.quantity;
        }, 0);
      },
      getCartItemCount: () => {
        const { cart } = get();
        return cart.reduce((count, item) => count + item.quantity, 0);
      },

      // User
      user: null,
      setUser: (user) => set({ user }),
      addAddress: (address) => {
        set((state) => ({
          user: state.user
            ? { ...state.user, addresses: [...state.user.addresses, address] }
            : null,
        }));
      },
      removeAddress: (addressId) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                addresses: state.user.addresses.filter((a) => a.id !== addressId),
              }
            : null,
        }));
      },
      setDefaultAddress: (addressId) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                addresses: state.user.addresses.map((a) => ({
                  ...a,
                  isDefault: a.id === addressId,
                })),
              }
            : null,
        }));
      },

      // Orders
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          ),
        }));
      },

      // App state
      hasSeenOnboarding: false,
      setHasSeenOnboarding: (value) => set({ hasSeenOnboarding: value }),
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'dk-delivery-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
