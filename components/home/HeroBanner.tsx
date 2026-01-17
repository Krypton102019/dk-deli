import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export const HeroBanner = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scooterSlideAnim = useRef(new Animated.Value(50)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in and slide up animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scooterSlideAnim, {
        toValue: 0,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Bounce animation for scooter
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -8,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#10b981', '#059669', '#047857']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Decorative blur elements */}
        <View style={styles.decorativeContainer}>
          <View style={[styles.decorativeBlur, styles.decorativeTopLeft]} />
          <View style={[styles.decorativeBlur, styles.decorativeBottomRight]} />
        </View>

        <View style={styles.content}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Text style={styles.title}>
              Fast Delivery to{' '}
              <Text style={styles.titleMyanmar}>ပြင်ဦးလွင်</Text>
            </Text>
            <Text style={styles.subtitle}>
              Fresh food from your favorite local restaurants, delivered to your
              doorstep
            </Text>

            {/* Stats */}
            <View style={styles.statsContainer}>
              {/* Bike stat */}
              <View style={styles.statItem}>
                <View style={styles.iconCircle}>
                  <Text style={styles.iconText}>🚴</Text>
                </View>
                <View style={styles.statText}>
                  <Text style={styles.statNumber}>15 min</Text>
                  <Text style={styles.statLabel}>Fastest</Text>
                </View>
              </View>

              {/* Location stat */}
              <View style={styles.statItem}>
                <View style={styles.iconCircle}>
                  <Text style={styles.iconText}>📍</Text>
                </View>
                <View style={styles.statText}>
                  <Text style={styles.statNumber}>50+</Text>
                  <Text style={styles.statLabel}>Restaurants</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Scooter illustration */}
          <Animated.View
            style={[
              styles.scooterContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { translateX: scooterSlideAnim },
                  { translateY: bounceAnim },
                ],
              },
            ]}
          >
            <Text style={styles.scooterEmoji}>🛵</Text>
          </Animated.View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  gradient: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    minHeight: 200,
  },
  decorativeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  decorativeBlur: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderRadius: 9999,
  },
  decorativeTopLeft: {
    top: 40,
    left: 40,
    width: 128,
    height: 128,
  },
  decorativeBottomRight: {
    bottom: 40,
    right: 40,
    width: 160,
    height: 160,
  },
  content: {
    position: 'relative',
    maxWidth: 512,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 36,
  },
  titleMyanmar: {
    fontFamily: 'System',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  statText: {
    gap: 2,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scooterContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  scooterEmoji: {
    fontSize: 64,
  },
});