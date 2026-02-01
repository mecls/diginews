// src/app/(auth)/login.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/providers/AuthProvider';
import { Image } from 'expo-image';
import { HelloWave } from '@/src/components/hello-wave';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/src/lib/supabase';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';

export default function AuthScreen() {
    const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

    //Sign In states
    const { signIn } = useAuth();
    const redirectTo = Linking.createURL('email-confirmed');     // Sign Up states

    // Sign In states
    const [signInEmail, setSignInEmail] = useState('');
    const [signInPassword, setSignInPassword] = useState('');
    const [showSignInPassword, setShowSignInPassword] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showSignUpPassword, setShowSignUpPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const signUpNewUser = async () => {
        const { data, error } = await supabase.auth.signUp({
            email: signUpEmail,
            password: signUpPassword,
            options: {
                emailRedirectTo: redirectTo,
                'data': {

                    first_name: firstName,
                    last_name: lastName,
                }
            }
        })

        if (error) {
            console.error('Error signing up:', error);

        } else {
            router.replace('/login');
            console.log('Sign up successful! Please check your email to confirm your account.', data);
        }

    }
    const signInWithEmail = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: signInEmail,
            password: signInPassword,
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>WELCOME</Text>
                        <Text style={styles.subtitle}>
                            Please sign in there are news coming out{'\n'}and they won't wait for you!
                        </Text>
                    </View>

                    {/* Tab Switcher */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[
                                styles.tab,
                                activeTab === 'signin' && styles.activeTab,
                            ]}
                            onPress={() => setActiveTab('signin')}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === 'signin' && styles.activeTabText,
                                ]}
                            >
                                Sign in
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.tab,
                                activeTab === 'signup' && styles.activeTab,
                            ]}
                            onPress={() => setActiveTab('signup')}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === 'signup' && styles.activeTabText,
                                ]}
                            >
                                Sign up
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Conditional Rendering based on Active Tab */}
                    {activeTab === 'signin' ? (
                        <>
                            {/* Sign In Form */}
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your email"
                                    placeholderTextColor="#999"
                                    value={signInEmail}
                                    onChangeText={setSignInEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />

                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        placeholder="Enter your password"
                                        placeholderTextColor="#999"
                                        value={signInPassword}
                                        onChangeText={setSignInPassword}
                                        secureTextEntry={!showSignInPassword}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowSignInPassword(!showSignInPassword)}
                                        style={styles.eyeIcon}
                                    >
                                        <Ionicons
                                            name={showSignInPassword ? 'eye-off-outline' : 'eye-outline'}
                                            size={24}
                                            color="#999"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Sign In Button */}
                            <TouchableOpacity style={styles.actionButton} onPress={signInWithEmail}>
                                <View style={styles.buttonContent}>
                                    <Text style={styles.actionButtonText}>Sign In</Text>
                                    <Ionicons name="arrow-forward" size={24} color="#000" />
                                </View>
                            </TouchableOpacity>

                            {/* Divider */}
                            <View style={styles.divider}>
                                <View style={styles.dividerLine} />
                            </View>
                            <View style={{ alignItems: 'center', marginBottom: 12, marginTop: -12 }}>
                                <Text style={{ color: '#666', fontFamily: 'Switzer-Medium' }}>Or continue with</Text>
                            </View>

                            {/* Social Sign In Buttons */}
                            <View style={styles.socialContainer}>
                                <TouchableOpacity style={styles.socialButton} onPress={signIn}>
                                    <Image source={require('@/assets/images/devicon_google.svg')} style={{ width: 20, height: 20 }} />
                                    <Text style={styles.socialButtonText}>Sign in with Google</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.socialButton}>
                                    <Ionicons name="logo-apple" size={20} color="#000" />
                                    <Text style={styles.socialButtonText}>Sign in with Apple</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <>
                            {/* Sign Up Form */}
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="First Name"
                                    placeholderTextColor="#999"
                                    value={firstName}
                                    onChangeText={setFirstName}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Last Name"
                                    placeholderTextColor="#999"
                                    value={lastName}
                                    onChangeText={setLastName}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your email"
                                    placeholderTextColor="#999"
                                    value={signUpEmail}
                                    onChangeText={setSignUpEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />

                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        placeholder="Enter your password"
                                        placeholderTextColor="#999"
                                        value={signUpPassword}
                                        onChangeText={setSignUpPassword}
                                        secureTextEntry={!showSignUpPassword}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowSignUpPassword(!showSignUpPassword)}
                                        style={styles.eyeIcon}
                                    >
                                        <Ionicons
                                            name={showSignUpPassword ? 'eye-off-outline' : 'eye-outline'}
                                            size={24}
                                            color="#999"
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        placeholder="Confirm password"
                                        placeholderTextColor="#999"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry={!showConfirmPassword}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={styles.eyeIcon}
                                    >
                                        <Ionicons
                                            name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                                            size={24}
                                            color="#999"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Create Account Button */}
                            <TouchableOpacity style={styles.actionButton} onPress={signUpNewUser}>
                                <View style={styles.buttonContent}>
                                    <Text style={styles.actionButtonText}>Create account</Text>
                                    <Ionicons name="arrow-forward" size={24} color="#000" />
                                </View>
                            </TouchableOpacity>
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        fontFamily: 'Switzer-Black',
        color: '#000',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        color: '#000',
        fontFamily: 'Switzer-Regular',
        lineHeight: 24,
    },
    tabContainer: {
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 0,
        marginBottom: 32,
        overflow: 'hidden',
    },
    tab: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    activeTab: {
        backgroundColor: '#000',
    },
    tabText: {
        fontSize: 16,
        fontFamily: 'Switzer-SemiBold',
        fontWeight: '600',
        color: '#000',
    },
    activeTabText: {
        color: '#FFF',
    },
    inputContainer: {
        marginBottom: 32,
        gap: 16,
    },
    input: {
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 0,
        fontFamily: 'Switzer-Regular',
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 16,
        backgroundColor: '#FFF',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 0,
        backgroundColor: '#FFF',
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 16,
    },
    eyeIcon: {
        paddingRight: 16,
    },
    actionButton: {
        backgroundColor: '#FFE55C',
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 0,
        overflow: 'hidden',
        marginBottom: 24,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 24,
    },
    actionButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Switzer-Bold',
        color: '#000',
    },
    divider: {
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        width: '100%',
        height: 1,
        backgroundColor: '#D0D0D0',
    },
    socialContainer: {
        gap: 16,
        marginBottom: 40,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        gap: 12,
    },
    socialButtonText: {
        fontSize: 16,
        color: '#000',
        fontFamily: 'Switzer-Medium',
        fontWeight: '500',
    },
});
