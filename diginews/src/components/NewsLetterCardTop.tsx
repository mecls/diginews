import { StyleSheet, View, ImageBackground, Pressable } from 'react-native'
import React, { useState } from 'react'
import { ThemedView } from './themed-view'
import { ThemedText } from './themed-text'
import Divider from './Divider'
import FontAwesome from '@expo/vector-icons/FontAwesome'

type Props = {
    title: string;
    content: string;
    imageUrl: any;
    date: string;
    bookmarked: boolean;
    onPress?: () => void;
    onBookmarkPress?: () => void;
    onSharePress?: () => void;
}

const NewsLetterCard = (props: Props) => {
    const [isBookmarked, setIsBookmarked] = useState(props.bookmarked);

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
        props.onBookmarkPress?.();
    };

    return (
        <ThemedView style={styles.container}>
            {/* Offset border */}
            <View style={styles.offsetBorder} />

            {/* Card */}
            <View style={styles.card}>
                <ImageBackground
                    source={props.imageUrl}
                    style={styles.image}
                    imageStyle={styles.imageStyle}
                >
                    {/* Overlay for readability */}
                    <View style={styles.overlay} />

                    {/* Text content */}
                    <View style={styles.textOverlay}>
                        <ThemedText type="cardTitle" style={styles.title}>
                            {props.title}
                        </ThemedText>
                        <ThemedText type="cardContent" style={styles.content}>
                            {props.content}
                        </ThemedText>
                    </View>
                </ImageBackground>

                <View style={styles.footer}>
                    <View style={styles.actions}>
                        <Pressable onPress={props.onPress} style={styles.actionButton}>
                            <FontAwesome name="expand" size={18} color="#black" />
                        </Pressable>

                        <Pressable onPress={handleBookmark} style={styles.actionButton}>
                            <FontAwesome
                                name={isBookmarked ? "bookmark" : "bookmark-o"}
                                size={18}
                                color={isBookmarked ? "black" : "black"}
                            />
                        </Pressable>

                        <Pressable onPress={props.onSharePress} style={styles.actionButton}>
                            <FontAwesome name="share" size={18} color="#black" />
                        </Pressable>
                    </View>

                    <ThemedText type="cardDate" style={styles.date}>
                        {props.date}
                    </ThemedText>
                </View>
            </View>
        </ThemedView>
    )
}

export default NewsLetterCard
const styles = StyleSheet.create({
    container: {
        width: '100%',
        position: 'relative',
        paddingTop: 4,
    },

    offsetBorder: {
        position: 'absolute',
        top: 6,
        left: 6,
        right: 0,
        height: 220,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 2,
    },

    card: {
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },

    image: {
        height: 220,
        borderWidth: 1,
        justifyContent: 'flex-end',
    },

    imageStyle: {
        resizeMode: 'cover',
    },

    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },

    textOverlay: {
        padding: 16,
        gap: 6,
    },

    title: {
        color: '#fff',
    },

    content: {
        color: '#fcfcfc',
    },

    // Footer styles
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 4,
        marginTop: 8
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    actionButton: {
        padding: 4,
    },
    date: {
        opacity: 0.6,
        fontSize: 12,
    }
})
