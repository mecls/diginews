import { Platform, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ThemedView } from '@/src/components/themed-view'

const bookmark = () => {
    return (
        <ThemedView style={{ flex: 1, padding: 32, marginTop: Platform.OS === 'web' ? 48 : 0 }}>
            <Text>bookmark</Text>
        </ThemedView>
    )
}

export default bookmark

const styles = StyleSheet.create({})