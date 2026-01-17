import { EmptyState } from '@/components/EmptyState';
import { MainLayout } from '@/components/layout/MainLayout';
import type { Order } from '@/lib/store';
import { useAppStore } from '@/lib/store';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const ORDER_STATUS_CONFIG = {
  order_placed: {
    label: 'Order Placed',
    labelMM: 'အော်ဒါတင်ပြီး',
    icon: '📝',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
  },
  confirmed: {
    label: 'Confirmed',
    labelMM: 'အတည်ပြုပြီး',
    icon: '✅',
    color: '#10B981',
    bgColor: '#D1FAE5',
  },
  preparing: {
    label: 'Preparing',
    labelMM: 'ပြင်ဆင်နေသည်',
    icon: '👨‍🍳',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
  },
  on_the_way: {
    label: 'On the Way',
    labelMM: 'ပို့ဆောင်နေသည်',
    icon: '🚴',
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
  },
  delivered: {
    label: 'Delivered',
    labelMM: 'ပို့ဆောင်ပြီး',
    icon: '✨',
    color: '#10B981',
    bgColor: '#D1FAE5',
  },
};

const OrderCard: React.FC<{
  order: Order;
  onPress: () => void;
  isDarkMode: boolean;
}> = ({ order, onPress, isDarkMode }) => {
  const statusConfig = ORDER_STATUS_CONFIG[order.status];
  
  return (
    <TouchableOpacity
      style={[styles.orderCard, isDarkMode && styles.orderCardDark]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.orderHeader}>
        <View>
          <Text style={[styles.orderId, isDarkMode && styles.textDark]}>
            Order #{order.id}
          </Text>
          <Text style={[styles.orderDate, isDarkMode && styles.textSecondaryDark]}>
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusConfig.bgColor },
          ]}
        >
          <Text style={styles.statusIcon}>{statusConfig.icon}</Text>
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>
      </View>

      {/* Items */}
      <View style={styles.orderItems}>
        <Text style={[styles.itemsLabel, isDarkMode && styles.textSecondaryDark]}>
          {order.items.length} item{order.items.length > 1 ? 's' : ''} from
        </Text>
        <Text style={[styles.restaurantName, isDarkMode && styles.textDark]}>
          {order.items[0]?.restaurantName}
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.orderFooter}>
        <View>
          <Text style={[styles.totalLabel, isDarkMode && styles.textSecondaryDark]}>
            Total
          </Text>
          <Text style={[styles.totalAmount, isDarkMode && styles.textDark]}>
            {(order.total + order.deliveryFee).toLocaleString()} Ks
          </Text>
        </View>
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function OrdersScreen({ navigation }: any) {
  const orders = useAppStore((state) => state.orders);
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredOrders = orders.filter((order) => {
    if (filter === 'active') {
      return order.status !== 'delivered';
    }
    if (filter === 'completed') {
      return order.status === 'delivered';
    }
    return true;
  });

  return (
    <MainLayout navigation={navigation} currentRoute="Orders">
      <View style={[styles.container, isDarkMode && styles.containerDark]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, isDarkMode && styles.textDark]}>
            My Orders
          </Text>
          <Text style={[styles.subtitle, isDarkMode && styles.textSecondaryDark]}>
            အော်ဒါများ
          </Text>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {(['all', 'active', 'completed'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.filterTab,
                filter === tab && styles.filterTabActive,
              ]}
              onPress={() => setFilter(tab)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === tab && styles.filterTextActive,
                  isDarkMode && styles.filterTextDark,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Orders List */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {filteredOrders.length > 0 ? (
            <View style={styles.ordersList}>
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isDarkMode={isDarkMode}
                  onPress={() =>
                    navigation.navigate('OrderTracking', { id: order.id })
                  }
                />
              ))}
            </View>
          ) : (
            <EmptyState
              icon="📋"
              title={
                filter === 'active'
                  ? 'No active orders'
                  : filter === 'completed'
                  ? 'No completed orders'
                  : 'No orders yet'
              }
              subtitle="Start ordering delicious food"
              subtitleMM="အစားအသောက် မှာယူလိုက်ပါ"
              actionText="Browse Restaurants"
              onAction={() => navigation.navigate('Home')}
            />
          )}
        </ScrollView>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
  },
  filterTabActive: {
    backgroundColor: '#EF4444',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  filterTextDark: {
    color: '#9CA3AF',
  },
  scrollView: {
    flex: 1,
  },
  ordersList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderCardDark: {
    backgroundColor: '#1F2937',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 13,
    color: '#6B7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  statusIcon: {
    fontSize: 14,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderItems: {
    marginBottom: 12,
  },
  itemsLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  restaurantName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  arrowContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 24,
    color: '#9CA3AF',
  },
  textDark: {
    color: '#F9FAFB',
  },
  textSecondaryDark: {
    color: '#9CA3AF',
  },
});
