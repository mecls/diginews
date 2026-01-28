import { ThemedText } from '@/src/components/themed-text';
import { Colors } from '@/src/constants/theme';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { router, Stack } from 'expo-router';
import { useColorScheme, View, Pressable } from 'react-native';

export default function ProfileLayout() {
    const colorScheme = useColorScheme();

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Profile',
                    headerShown: true,
                    headerShadowVisible: false,
                    headerLeft: () => <Pressable onPress={router.back}><Ionicons name="chevron-back" size={24} color={Colors[colorScheme ?? 'light'].text} style={{ marginLeft: 16 }} /></Pressable>,
                    headerRight: () =>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
                            <FontAwesome5 name="edit" size={18} color="black" />
                            <ThemedText
                                type="defaultSemiBold"
                                style={{ fontSize: 14, marginLeft: 4 }}
                            >
                                Edit
                            </ThemedText>
                        </View>
                }}
            />

            <Stack.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    headerShown: false,
                }}
            />
        </Stack>
    );
}
