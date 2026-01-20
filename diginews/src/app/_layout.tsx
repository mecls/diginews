import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useFonts } from 'expo-font';

import { useColorScheme } from '@/src/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Switzer-Regular': require('@/assets/fonts/Switzer_Complete/Fonts/OTF/Switzer-Regular.otf'),
    'Switzer-Bold': require('@/assets/fonts/Switzer_Complete/Fonts/OTF/Switzer-Bold.otf'),
    'Switzer-Black': require('@/assets/fonts/Switzer_Complete/Fonts/OTF/Switzer-Black.otf'),
    'Switzer-Medium': require('@/assets/fonts/Switzer_Complete/Fonts/OTF/Switzer-Medium.otf'),
    'Switzer-SemiBold': require('@/assets/fonts/Switzer_Complete/Fonts/OTF/Switzer-Semibold.otf'),
    'Switzer-Light': require('@/assets/fonts/Switzer_Complete/Fonts/OTF/Switzer-Light.otf'),
  });


  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme} >
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
