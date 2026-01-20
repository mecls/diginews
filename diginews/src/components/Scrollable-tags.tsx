import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native'
import React, { useState } from 'react'
import Divider from './Divider'
import { ThemedText } from './themed-text'

const tags = ['All', 'Business', 'Technology', 'Entertainment', 'Sports', 'Health', 'Science']

const ScrollableTags = () => {
    const [selectedTag, setSelectedTag] = useState('All');

    return (
        <View>
            <Divider />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
                {tags.map((tag, index) => (
                    <Pressable key={index} onPress={() => setSelectedTag(tag)}>
                        <ThemedText
                            key={index}
                            type={selectedTag === tag ? 'defaultSemiBold' : 'unselected'}
                            style={{ marginRight: 16 }}
                        >
                            {tag.toUpperCase()}
                        </ThemedText>
                    </Pressable>
                ))}
            </ScrollView>
            <Divider />
        </View>
    )
}

export default ScrollableTags

const styles = StyleSheet.create({})