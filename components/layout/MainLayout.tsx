import React, { ReactNode } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/lib/store';
import { BottomNav } from '@/BottomNav';
import { Header } from './Header';

interface MainLayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
  hideNav?: boolean;
  navigation?: any;
  currentRoute?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  hideHeader = false,
  hideNav = false,
  navigation,
  currentRoute = 'Home',
}) => {
  const isDarkMode = useAppStore((state) => state.isDarkMode);

  return (
    <SafeAreaView
      style={[styles.container, isDarkMode && styles.containerDark]}
      edges={['top']}
    >
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#1F2937' : '#EF4444'}
      />
      
      {!hideHeader && <Header />}
      
      <View style={styles.content}>
        {children}
      </View>
      
      {!hideNav && navigation && (
        <BottomNav
          activeRoute={currentRoute}
          navigation={navigation}
          isDarkMode={isDarkMode}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  content: {
    flex: 1,
  },
});
