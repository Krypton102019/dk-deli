import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAppStore } from '@/lib/store';
import { StyleSheet } from 'react-native';

const queryClient = new QueryClient();

// Onboarding Guard Hook
function useOnboardingGuard() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const seen = await AsyncStorage.getItem('dk-onboarding-complete');
        setHasSeenOnboarding(seen === 'true');
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setHasSeenOnboarding(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkOnboarding();
  }, []);

  useEffect(() => {
    if (isChecking || hasSeenOnboarding === null) return;

    const inOnboarding = segments[0] === 'onboarding';

    if (!hasSeenOnboarding && !inOnboarding) {
      // User hasn't seen onboarding, redirect to onboarding
      router.replace('/onboarding');
    } else if (hasSeenOnboarding && inOnboarding) {
      // User has seen onboarding but is on onboarding screen, redirect to home
      router.replace('/');
    }
  }, [hasSeenOnboarding, segments, isChecking]);

  return { hasSeenOnboarding, isChecking };
}

function RootLayoutNav() {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const { isChecking } = useOnboardingGuard();

  // Don't render anything while checking onboarding status
  if (isChecking) {
    return null;
  }

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: {
            backgroundColor: isDarkMode ? '#111827' : '#ffffff',
          },
        }}
      >
        {/* Onboarding */}
        <Stack.Screen name="onboarding" />
        
        {/* Main Tabs */}
        <Stack.Screen name="(tabs)" />
        
        {/* Modal Screens */}
        <Stack.Screen
          name="restaurants/[id]"
          options={{
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="food/[restaurantId]/[itemId]"
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen name="cart" />
        <Stack.Screen name="checkout" />
        <Stack.Screen name="orders/[id]" />
        <Stack.Screen name="login" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <QueryClientProvider client={queryClient}>
        <RootLayoutNav />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});