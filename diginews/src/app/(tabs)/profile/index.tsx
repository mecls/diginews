import { Platform, StyleSheet, Text, View, Image, ScrollView, Pressable } from 'react-native'
import { ThemedView } from '@/src/components/themed-view'
import React from 'react'
import { ThemedText } from '@/src/components/themed-text'
import { IconSymbol } from '@/src/components/ui/icon-symbol'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router'

const profile = () => {
    return (
        <ScrollView style={{ flex: 1, padding: 32, marginTop: Platform.OS === 'web' ? 48 : 0, backgroundColor: 'white' }} >
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                <Image source={require('@/assets/images/avatar.jpg')} style={{ width: 100, height: 100, borderRadius: 2, marginBottom: 16, borderWidth: 2, borderColor: 'black' }} />
                <ThemedText type='title' style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>First Name</ThemedText>
                <ThemedText type='unselected' style={{ fontSize: 16, color: '#666' }} >@user_name</ThemedText>
            </View>
            <View style={{ flex: 2, marginTop: 32 }}>
                <ThemedText type='default' style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>Account Settings</ThemedText>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomColor: '#eee' }}>
                    <View style={{ borderColor: 'black', borderWidth: 2, borderRadius: 2, padding: 4 }} >
                        <IconSymbol size={24} name="person.fill" color="black" />
                    </View>
                    <View style={{ flexDirection: 'column', alignContent: 'flex-start', flex: 1, marginLeft: 16 }}>
                        <ThemedText type='default' style={{ fontSize: 16 }}>Profile Information</ThemedText>
                        <ThemedText type='cardDate' style={{ fontSize: 12, marginTop: 0 }}>Edit and view your profile info</ThemedText>
                    </View>
                    <IconSymbol size={18} name="chevron.right" color="#888" />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomColor: '#eee' }}>
                    <View style={{ borderColor: 'black', borderWidth: 2, borderRadius: 2, padding: 4 }} >
                        <FontAwesome5 name="newspaper" size={24} color="black" />
                    </View>
                    <View style={{ flexDirection: 'column', alignContent: 'flex-start', flex: 1, marginLeft: 16 }}>
                        <ThemedText type='default' style={{ fontSize: 16, flex: 1 }}>Newsletters</ThemedText>
                        <ThemedText type='cardDate' style={{ fontSize: 12, marginTop: 0 }}>Configure your newsletter preferences</ThemedText>
                    </View>
                    <IconSymbol size={18} name="chevron.right" color="#888" />
                </View>
                <View style={{ marginTop: 32 }}>
                    <ThemedText type='default' style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>App Settings</ThemedText>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomColor: '#eee' }}>
                        <View style={{ borderColor: 'black', borderWidth: 2, borderRadius: 2, padding: 4 }} >
                            <AntDesign name="sun" size={24} color="black" />
                        </View>
                        <View style={{ flexDirection: 'column', alignContent: 'flex-start', flex: 1, marginLeft: 16 }}>
                            <ThemedText type='default' style={{ fontSize: 16 }}>Display Information</ThemedText>
                            <ThemedText type='cardDate' style={{ fontSize: 12, marginTop: 0 }}>Adjust your display</ThemedText>
                        </View>
                        <IconSymbol size={18} name="chevron.right" color="#888" />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomColor: '#eee' }}>
                        <View style={{ borderColor: 'black', borderWidth: 2, borderRadius: 2, padding: 4 }} >
                            <AntDesign name="bell" size={24} color="black" />
                        </View>
                        <View style={{ flexDirection: 'column', alignContent: 'flex-start', flex: 1, marginLeft: 16 }}>
                            <ThemedText type='default' style={{ fontSize: 16 }}>Notifications</ThemedText>
                            <ThemedText type='cardDate' style={{ fontSize: 12, marginTop: 0 }}>Personalize your notification settings</ThemedText>
                        </View>
                        <IconSymbol size={18} name="chevron.right" color="#888" />
                    </View>
                    <Pressable onPress={() => router.push('/(tabs)/profile/settings/other')}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomColor: '#eee' }}>
                            <View style={{ borderColor: 'black', borderWidth: 2, borderRadius: 2, padding: 4 }} >
                                <Feather name="settings" size={24} color="black" />
                            </View>
                            <View style={{ flexDirection: 'column', alignContent: 'flex-start', flex: 1, marginLeft: 16 }}>
                                <ThemedText type='default' style={{ fontSize: 16 }}>Other</ThemedText>
                                <ThemedText type='cardDate' style={{ fontSize: 12, marginTop: 0 }}>Other app settings</ThemedText>
                            </View>
                            <IconSymbol size={18} name="chevron.right" color="#888" />
                        </View>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    )
}

export default profile

const styles = StyleSheet.create({})