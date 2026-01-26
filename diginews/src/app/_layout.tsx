import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useFonts } from 'expo-font';
import { Stack, SplashScreen } from 'expo-router';
import { AuthProvider, useAuth } from '@/src/providers/AuthProvider';
import { useColorScheme } from '@/src/hooks/use-color-scheme';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function SplashScreenController() {
  const { isLoading } = useAuth();

  if (!isLoading) {
    SplashScreen.hideAsync();
  }

  return null;
}

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootNavigator() {
  const { session } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Protected routes - only accessible when authenticated */}
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>

      {/* Public routes - only accessible when NOT authenticated */}
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)/login" />
      </Stack.Protected>
    </Stack>
  );
}

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
      <AuthProvider>
        <SplashScreenController />
        <RootNavigator />
        {/* <StatusBar style="auto" /> */}
      </AuthProvider>
    </ThemeProvider>
  );
}
