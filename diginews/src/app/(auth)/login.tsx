import { useAuth } from '@/src/providers/AuthProvider';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { View, StyleSheet, useColorScheme, Platform } from 'react-native';
import { ThemedText } from '@/src/components/themed-text';
import { Colors } from '@/src/constants/theme';

export default function Login() {
    const { signIn } = useAuth();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <ThemedText type='title' style={styles.appName}>
                    DIGINEWS
                </ThemedText>

                <ThemedText style={styles.tagline}>
                    Stay informed with curated news
                </ThemedText>

                <View style={styles.signInSection}>
                    <GoogleSigninButton
                        size={GoogleSigninButton.Size.Wide}
                        color={GoogleSigninButton.Color.Dark}
                        onPress={() => {
                            signIn();
                        }}
                        style={styles.googleButton}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    appName: {
        fontSize: 48,
        letterSpacing: -1,
        marginBottom: 12,
        lineHeight: 52,     // Add explicit line height to prevent clipping
    },
    tagline: {
        fontSize: 16,
        opacity: 0.7,
        marginBottom: 80,
        textAlign: 'center',
    },
    signInSection: {
        alignItems: 'center',
        marginBottom: 60,
    },
    signInText: {
        fontSize: 18,
        marginBottom: 20,
    },
    googleButton: {
        width: 250,
        height: 48,
    }
});
