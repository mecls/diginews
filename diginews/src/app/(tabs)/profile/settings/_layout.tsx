import { ThemedText } from '@/src/components/themed-text';
import { Colors } from '@/src/constants/theme';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from 'expo-router';
import { Pressable, useColorScheme, View } from 'react-native';

export default function SettingsLayout() {
    const colorScheme = useColorScheme();

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Settings',
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="other"
                options={{
                    title: 'Other',
                    headerShown: true,
                    headerShadowVisible: false,
                    headerLeft: () => <Pressable onPress={router.back}><Ionicons name="chevron-back" size={24} color={Colors[colorScheme ?? 'light'].text} style={{ marginLeft: 16 }} /></Pressable>,
                }}
            />

            <Stack.Screen
                name="notifications"
                options={{
                    title: 'Notifications',
                }}
            />

            <Stack.Screen
                name="display"
                options={{
                    title: 'Display',
                }}
            />
        </Stack>
    );
}
