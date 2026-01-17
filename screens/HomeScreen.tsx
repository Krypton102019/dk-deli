import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CategorySlider } from '@/components/home/CategorySlider';
import { HeroBanner } from '@/components/home/HeroBanner';
import { RestaurantCard } from '@/components/home/RestaurantCard';
import { SearchBar } from '@/components/home/SearchBar';
import { MainLayout } from '@/components/layout/MainLayout';
import { EmptyState } from '@/pages/EmptyState';
import {
  categories,
  getPopularRestaurants,
  getRestaurantsByCategory,
  searchRestaurants,
} from '@/lib/mockData';

export default function HomeScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredRestaurants = useMemo(() => {
    if (searchQuery.trim()) {
      return searchRestaurants(searchQuery);
    }
    return getRestaurantsByCategory(selectedCategory);
  }, [searchQuery, selectedCategory]);

  const popularRestaurants = useMemo(() => getPopularRestaurants(), []);

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
  }, []);

  const handleRestaurantPress = useCallback(
    (restaurantId: string) => {
      navigation.navigate('RestaurantDetail', { id: restaurantId });
    },
    [navigation]
  );

  return (
    <MainLayout navigation={navigation} currentRoute="Home">
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeroBanner />

        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        <CategorySlider
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />

        {/* Popular Restaurants */}
        {!searchQuery && selectedCategory === 'all' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Popular Now</Text>
                <Text style={styles.sectionSubtitle}>လူကြိုက်များသော</Text>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {popularRestaurants.slice(0, 4).map((restaurant, index) => (
                <View key={restaurant.id} style={styles.horizontalCard}>
                  <RestaurantCard
                    restaurant={restaurant}
                    variant="horizontal"
                    index={index}
                    onPress={() => handleRestaurantPress(restaurant.id)}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* All Restaurants */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                {searchQuery ? 'Search Results' : 'All Restaurants'}
              </Text>
              <Text style={styles.sectionSubtitle}>
                {searchQuery ? 'ရှာဖွေမှုရလဒ်များ' : 'စားသောက်ဆိုင်အားလုံး'}
              </Text>
            </View>
            <Text style={styles.resultCount}>
              {filteredRestaurants.length} places
            </Text>
          </View>

          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant, index) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                index={index}
                onPress={() => handleRestaurantPress(restaurant.id)}
              />
            ))
          ) : (
            <EmptyState
              icon="🍜"
              title="No restaurants found"
              subtitle="စားသောက်ဆိုင် မတွေ့ပါ"
            />
          )}
        </View>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  resultCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  horizontalScroll: {
    gap: 16,
    paddingRight: 16,
  },
  horizontalCard: {
    width: 280,
  },
});