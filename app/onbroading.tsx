import React, { useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAppStore } from '../lib/store';

const { width, height } = Dimensions.get('window');

const ONBOARDING_DATA = [
  {
    id: '1',
    icon: '🍜',
    title: 'Discover Local Food',
    titleMM: 'ဒေသထွက် အစားအစာများ',
    description: 'Browse hundreds of restaurants in Pyin Oo Lwin',
    descriptionMM: 'ပြင်ဦးလွင်မြို့ရှိ စားသောက်ဆိုင်ရာချီများကို ရှာဖွေပါ',
  },
  {
    id: '2',
    icon: '🚴',
    title: 'Fast Delivery',
    titleMM: 'လျင်မြန်သော ပို့ဆောင်မှု',
    description: 'Get your favorite food delivered to your doorstep',
    descriptionMM: 'သင့်အိမ်အရောက် အစားအစာများ ပို့ဆောင်ပေးပါသည်',
  },
  {
    id: '3',
    icon: '💳',
    title: 'Easy Payment',
    titleMM: 'လွယ်ကူသော ငွေပေးချေမှု',
    description: 'Multiple payment options for your convenience',
    descriptionMM: 'သင့်အတွက် အဆင်ပြေသော ငွေပေးချေမှု နည်းလမ်းများ',
  },
];

interface OnboardingItemProps {
  item: typeof ONBOARDING_DATA[0];
}

const OnboardingItem: React.FC<OnboardingItemProps> = ({ item }) => {
  return (
    <View style={onboardingStyles.slide}>
      <Text style={onboardingStyles.icon}>{item.icon}</Text>
      <Text style={onboardingStyles.title}>{item.title}</Text>
      <Text style={onboardingStyles.titleMM}>{item.titleMM}</Text>
      <Text style={onboardingStyles.description}>{item.description}</Text>
      <Text style={onboardingStyles.descriptionMM}>{item.descriptionMM}</Text>
    </View>
  );
};

export default function OnboardingScreen({ navigation }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const setHasSeenOnboarding = useAppStore((state) => state.setHasSeenOnboarding);

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = () => {
    setHasSeenOnboarding(true);
    navigation.replace('Home');
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <SafeAreaView style={onboardingStyles.container}>
      {/* Skip Button */}
      <TouchableOpacity
        style={onboardingStyles.skipButton}
        onPress={handleSkip}
        activeOpacity={0.7}
      >
        <Text style={onboardingStyles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        renderItem={({ item }) => <OnboardingItem item={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {/* Bottom Section */}
      <View style={onboardingStyles.bottomContainer}>
        {/* Pagination Dots */}
        <View style={onboardingStyles.pagination}>
          {ONBOARDING_DATA.map((_, index) => (
            <View
              key={index}
              style={[
                onboardingStyles.dot,
                index === currentIndex && onboardingStyles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* Next/Get Started Button */}
        <TouchableOpacity
          style={onboardingStyles.button}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={onboardingStyles.buttonText}>
            {currentIndex === ONBOARDING_DATA.length - 1
              ? 'Get Started'
              : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const onboardingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  icon: {
    fontSize: 120,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  titleMM: {
    fontSize: 20,
    fontWeight: '600',
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  descriptionMM: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  dotActive: {
    width: 24,
    backgroundColor: '#EF4444',
  },
  button: {
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});