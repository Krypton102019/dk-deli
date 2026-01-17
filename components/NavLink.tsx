import { useNavigation, useRoute } from '@react-navigation/native';
import React, { forwardRef } from 'react';
import {
    GestureResponderEvent,
    Pressable,
    PressableProps,
    StyleProp,
    StyleSheet,
    ViewStyle,
} from 'react-native';

interface NavLinkProps extends Omit<PressableProps, 'style' | 'onPress'> {
  to: string;
  style?: StyleProp<ViewStyle>;
  activeStyle?: StyleProp<ViewStyle>;
  pendingStyle?: StyleProp<ViewStyle>;
  onPress?: (event: GestureResponderEvent) => void;
}

const NavLink = forwardRef<React.ElementRef<typeof Pressable>, NavLinkProps>(
  ({ to, style, activeStyle, pendingStyle, onPress, children, ...props }, ref) => {
    const navigation = useNavigation<any>();
    const route = useRoute();

    // Check if current route matches the target
    const isActive = route.name === to;

    const handlePress = (event: GestureResponderEvent) => {
      if (onPress) {
        onPress(event);
      }
      
      // Navigate to the target screen
      navigation.navigate(to);
    };

    // Combine styles based on active state
    const combinedStyle = StyleSheet.flatten([
      style,
      isActive && activeStyle,
    ]);

    return (
      <Pressable
        ref={ref}
        onPress={handlePress}
        style={combinedStyle}
        {...props}
      >
        {children}
      </Pressable>
    );
  }
);

NavLink.displayName = 'NavLink';

export { NavLink };
export type { NavLinkProps };

