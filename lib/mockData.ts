import { Restaurant } from '@/lib/store';

export const categories = [
  { id: 'all', name: 'All', nameMM: 'အားလုံး', icon: '🍽️' },
  { id: 'myanmar', name: 'Myanmar', nameMM: 'မြန်မာ', icon: '🍜' },
  { id: 'shan', name: 'Shan', nameMM: 'ရှမ်း', icon: '🥘' },
  { id: 'chinese', name: 'Chinese', nameMM: 'တရုတ်', icon: '🥡' },
  { id: 'drinks', name: 'Drinks', nameMM: 'အချိုရည်', icon: '🧋' },
  { id: 'snacks', name: 'Snacks', nameMM: 'မုန့်', icon: '🍿' },
  { id: 'dessert', name: 'Dessert', nameMM: 'အချိုပွဲ', icon: '🍰' },
];

// ... (Copy all restaurants data from your document) ...
// I'll include a shortened version for brevity

export const restaurants: Restaurant[] = [
  {
    id: 'r1',
    name: 'Golden Rice Home Kitchen',
    nameMM: 'ရွှေထမင်း အိမ်ချက်',
    description: 'Authentic Myanmar home-style cooking with fresh local ingredients',
    descriptionMM: 'လတ်ဆတ်သော ဒေသထွက်ပစ္စည်းများဖြင့် စစ်မှန်သော မြန်မာ အိမ်ချက် အစားအသောက်များ',
    image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=300&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop',
    rating: 4.8,
    reviewCount: 234,
    deliveryTime: '25-35 min',
    deliveryFee: 1500,
    category: 'myanmar',
    categories: ['myanmar', 'snacks'],
    isOpen: true,
    menu: [
      {
        id: 'm1-1',
        name: 'Mohinga',
        nameMM: 'မုန့်ဟင်းခါး',
        description: 'Traditional fish noodle soup - Myanmar\'s national dish',
        descriptionMM: 'ရိုးရာ ငါးဟင်းခါး ခေါက်ဆွဲ - မြန်မာ့ အမျိုးသား အစားအစာ',
        price: 2500,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
        category: 'myanmar',
        isPopular: true,
        toppings: [
          { id: 'extra-fish', name: 'Extra Fish Cake', nameMM: 'ငါးကြော် ပိုထည့်', price: 500 },
          { id: 'extra-egg', name: 'Extra Boiled Egg', nameMM: 'ကြက်ဥပြုတ် ပိုထည့်', price: 300 },
        ],
      },
      // ... other menu items
    ],
  },
  // ... other restaurants (use the full data from your document)
];

export const getRestaurantById = (id: string): Restaurant | undefined => {
  return restaurants.find((r) => r.id === id);
};

export const getRestaurantsByCategory = (category: string): Restaurant[] => {
  if (category === 'all') return restaurants;
  return restaurants.filter((r) => r.categories.includes(category));
};

export const getPopularRestaurants = (): Restaurant[] => {
  return restaurants.filter((r) => r.rating >= 4.6);
};

export const searchRestaurants = (query: string): Restaurant[] => {
  const lowerQuery = query.toLowerCase();
  return restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(lowerQuery) ||
      r.nameMM.includes(query) ||
      r.description.toLowerCase().includes(lowerQuery)
  );
};

