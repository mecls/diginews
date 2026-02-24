import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useAuth } from '@/src/providers/AuthProvider'

const Other = () => {
    const { signOut } = useAuth()
    return (
        <View>
            <Text onPress={signOut} style={styles.signOut}>Logout</Text>
        </View>
    )
}

export default Other

const styles = StyleSheet.create({
    signOut: {
        marginTop: 20,
        color: 'red',
    },
})