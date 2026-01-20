import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import Divider from './Divider'
import { ThemedText } from './themed-text'

const tags = ['All', 'Business', 'Technology', 'Entertainment', 'Sports', 'Health', 'Science']

const ScrollableTags = () => {
    return (
        <View>
            <Divider />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
                {tags.map((tag, index) => (
                    <ThemedText
                        key={index}
                        type="defaultSemiBold"
                        style={{ marginRight: 16, fontFamily: 'Switzer-SemiBold' }}
                    >
                        {tag.toUpperCase()}
                    </ThemedText>
                ))}
            </ScrollView>
            <Divider />
        </View>
    )
}

export default ScrollableTags

const styles = StyleSheet.create({})