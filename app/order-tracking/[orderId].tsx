import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ArrowLeft,
    Bike,
    CheckCircle2,
    ChefHat,
    ClipboardCheck,
    MapPin,
    Package,
    Phone,
} from 'lucide-react-native';
import { useEffect } from 'react';
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import your actual store
// import { useAppStore } from '@/lib/store';

// Mock store for now
const useAppStore = () => ({
  orders: [
    {
      id: '123456',
      status: 'preparing' as 'order_placed' | 'confirmed' | 'preparing' | 'on_the_way' | 'delivered',
      items: [
        {
          menuItem: { id: '1', name: 'Chicken Biryani', price: 5000 },
          quantity: 2,
        },
        {
          menuItem: { id: '2', name: 'Mango Lassi', price: 1500 },
          quantity: 1,
        },
      ],
      total: 11500,
      address: { address: '123 Main St, Yangon, Myanmar' },
    },
  ],
  updateOrderStatus: (id: string, status: string) => console.log('Update status:', id, status),
});

type OrderStatus = 'order_placed' | 'confirmed' | 'preparing' | 'on_the_way' | 'delivered';

const steps = [
  { id: 'order_placed', label: 'Order Placed', labelMM: 'အော်ဒါတင်ပြီး', icon: Package },
  { id: 'confirmed', label: 'Confirmed', labelMM: 'အတည်ပြုပြီး', icon: ClipboardCheck },
  { id: 'preparing', label: 'Preparing', labelMM: 'ပြင်ဆင်နေသည်', icon: ChefHat },
  { id: 'on_the_way', label: 'On the Way', labelMM: 'လမ်းတွင်ရှိသည်', icon: Bike },
  { id: 'delivered', label: 'Delivered', labelMM: 'ပို့ဆောင်ပြီး', icon: CheckCircle2 },
];

export default function OrderTrackingScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const { orders, updateOrderStatus } = useAppStore();
  const order = orders.find((o) => o.id === orderId);

  // Simulate order progress
  useEffect(() => {
    if (!order) return;

    const timers: NodeJS.Timeout[] = [];
    const statusSequence: OrderStatus[] = [
      'order_placed',
      'confirmed',
      'preparing',
      'on_the_way',
      'delivered',
    ];
    const currentIndex = statusSequence.indexOf(order.status);

    if (currentIndex < statusSequence.length - 1) {
      const nextStatus = statusSequence[currentIndex + 1];
      const delay =
        order.status === 'order_placed'
          ? 3000
          : order.status === 'confirmed'
          ? 5000
          : order.status === 'preparing'
          ? 10000
          : 15000;

      timers.push(
        setTimeout(() => {
          updateOrderStatus(order.id, nextStatus);
        }, delay)
      );
    }

    return () => timers.forEach(clearTimeout);
  }, [order?.status, order?.id, updateOrderStatus]);

  const getStatusMessage = () => {
    if (!order) return { en: '', mm: '' };
    
    switch (order.status) {
      case 'order_placed':
        return { en: '📦 Order placed successfully!', mm: 'အော်ဒါ အောင်မြင်စွာ တင်သွင်းပြီးပါပြီ!' };
      case 'confirmed':
        return { en: '✅ Restaurant confirmed your order!', mm: 'စားသောက်ဆိုင်မှ သင့်အော်ဒါကို အတည်ပြုပြီးပါပြီ!' };
      case 'preparing':
        return { en: '👨‍🍳 Your food is being prepared...', mm: 'သင့်အစားအစာ ပြင်ဆင်နေပါသည်...' };
      case 'on_the_way':
        return { en: '🛵 Rider is on the way!', mm: 'ပို့ဆောင်သူ လမ်းတွင် ရှိနေပါပြီ!' };
      case 'delivered':
        return { en: '🎉 Order delivered!', mm: 'အော်ဒါ ပို့ဆောင်ပြီးပါပြီ!' };
      default:
        return { en: '', mm: '' };
    }
  };

  const handleContactRider = () => {
    // Replace with actual rider phone number from order data
    const phoneNumber = '+959123456789';
    Linking.openURL(`tel:${phoneNumber}`);
  };

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Order not found</Text>
          <TouchableOpacity
            onPress={() => router.push('/order')}
            style={styles.button}
          >
            <Text style={styles.buttonText}>View Orders</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentStepIndex = steps.findIndex((s) => s.id === order.status);
  const statusMessage = getStatusMessage();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={20} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Order #{order.id.slice(-6)}</Text>
          <Text style={styles.headerSubtitle}>အော်ဒါ စောင့်ကြည့်ခြင်း</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}
        <View style={styles.statusCard}>
          <Text style={styles.statusText}>{statusMessage.en}</Text>
          <Text style={styles.statusTextMM}>{statusMessage.mm}</Text>
        </View>

        {/* Progress Steps */}
        <View style={styles.card}>
          <View style={styles.stepsContainer}>
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isLast = index === steps.length - 1;

              return (
                <View key={step.id} style={styles.stepRow}>
                  {/* Icon and Line */}
                  <View style={styles.stepIconContainer}>
                    <View
                      style={[
                        styles.stepIcon,
                        isCompleted && styles.stepIconCompleted,
                        isCurrent && styles.stepIconCurrent,
                      ]}
                    >
                      <Icon
                        size={20}
                        color={isCompleted ? '#fff' : '#9ca3af'}
                      />
                    </View>
                    {!isLast && (
                      <View style={styles.stepLine}>
                        <View
                          style={[
                            styles.stepLineProgress,
                            isCompleted && index < currentStepIndex && styles.stepLineCompleted,
                          ]}
                        />
                      </View>
                    )}
                  </View>

                  {/* Text */}
                  <View style={styles.stepTextContainer}>
                    <Text
                      style={[
                        styles.stepLabel,
                        isCompleted && styles.stepLabelCompleted,
                      ]}
                    >
                      {step.label}
                    </Text>
                    <Text style={styles.stepLabelMM}>{step.labelMM}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Order Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Details</Text>
          <View style={styles.orderItems}>
            {order.items.map((item, index) => (
              <View key={index} style={styles.orderItem}>
                <Text style={styles.orderItemName}>
                  {item.menuItem.name} x{item.quantity}
                </Text>
                <Text style={styles.orderItemPrice}>
                  {(item.menuItem.price * item.quantity).toLocaleString()} Ks
                </Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>
                {order.total.toLocaleString()} Ks
              </Text>
            </View>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.card}>
          <View style={styles.addressHeader}>
            <MapPin size={20} color="#ef4444" />
            <Text style={styles.cardTitle}>Delivery Address</Text>
          </View>
          <Text style={styles.addressText}>{order.address.address}</Text>
        </View>

        {/* Contact Rider Button */}
        {order.status === 'on_the_way' && (
          <TouchableOpacity
            onPress={handleContactRider}
            style={styles.contactButton}
          >
            <Phone size={20} color="#374151" />
            <Text style={styles.contactButtonText}>Contact Rider</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusTextMM: {
    fontSize: 14,
    color: '#6b7280',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  stepsContainer: {
    position: 'relative',
  },
  stepRow: {
    flexDirection: 'row',
    gap: 16,
  },
  stepIconContainer: {
    alignItems: 'center',
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  stepIconCompleted: {
    backgroundColor: '#ef4444',
  },
  stepIconCurrent: {
    backgroundColor: '#ef4444',
    borderWidth: 4,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  stepLine: {
    width: 2,
    height: 40,
    backgroundColor: '#e5e7eb',
    position: 'relative',
  },
  stepLineProgress: {
    position: 'absolute',
    width: '100%',
    height: 0,
    backgroundColor: '#ef4444',
    top: 0,
  },
  stepLineCompleted: {
    height: '100%',
  },
  stepTextContainer: {
    paddingBottom: 24,
    flex: 1,
  },
  stepLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 2,
  },
  stepLabelCompleted: {
    color: '#000',
  },
  stepLabelMM: {
    fontSize: 14,
    color: '#9ca3af',
  },
  orderItems: {
    gap: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderItemName: {
    fontSize: 14,
    color: '#6b7280',
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  addressText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  contactButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
});