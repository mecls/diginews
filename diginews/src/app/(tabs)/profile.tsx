import { Platform, StyleSheet, Text, View } from 'react-native'
import { ThemedView } from '@/src/components/themed-view'
import React from 'react'

const profile = () => {
    return (
        <ThemedView style={{ flex: 1, padding: 32, marginTop: Platform.OS === 'web' ? 48 : 0 }}>
            <Text>profile</Text>
        </ThemedView>
    )
}

export default profile

const styles = StyleSheet.create({})