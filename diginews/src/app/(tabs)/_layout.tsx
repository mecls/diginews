import { router, Tabs } from 'expo-router';
import React from 'react';
import Fontisto from '@expo/vector-icons/Fontisto';
import { HapticTab } from '@/src/components/haptic-tab';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { Colors } from '@/src/constants/theme';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { useFonts } from 'expo-font';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/build/FontAwesome5';
import { ThemedText } from '@/src/components/themed-text';
import { Pressable, View } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    'Switzer-Regular': require('@/assets/fonts/Switzer_Complete/Fonts/OTF/Switzer-Regular.otf'),
    'Switzer-Bold': require('@/assets/fonts/Switzer_Complete/Fonts/OTF/Switzer-Bold.otf'),
    'Switzer-Black': require('@/assets/fonts/Switzer_Complete/Fonts/OTF/Switzer-Black.otf'),
    'Switzer-Medium': require('@/assets/fonts/Switzer_Complete/Fonts/OTF/Switzer-Medium.otf'),
    'Switzer-SemiBold': require('@/assets/fonts/Switzer_Complete/Fonts/OTF/Switzer-Semibold.otf'),
    'Switzer-Light': require('@/assets/fonts/Switzer_Complete/Fonts/OTF/Switzer-Light.otf'),
  });

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0, // Remove shadow on Android
          position: 'absolute',
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <Fontisto name="search" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookmark"
        options={{
          title: 'Bookmarks',
          tabBarIcon: ({ color }) => <FontAwesome name="bookmark" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
