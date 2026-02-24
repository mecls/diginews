import { StyleSheet, View, ImageBackground, Pressable } from 'react-native'
import React, { useState } from 'react'
import { ThemedView } from './themed-view'
import { ThemedText } from './themed-text'
import FontAwesome from '@expo/vector-icons/FontAwesome'

type Props = {
    sourceName?: string;
    title: string;
    content: string;
    imageUrl: any;
    date: string;
    bookmarked: boolean;
    onPress?: () => void;
    onBookmarkPress?: () => void;
    onSharePress?: () => void;
}

const ArticleCardTop = (props: Props) => {
    const [isBookmarked, setIsBookmarked] = useState(props.bookmarked);
    const [imageError, setImageError] = useState(false);
    const hasImage = !!props.imageUrl && !imageError

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
        props.onBookmarkPress?.();
    };

    return (
        <ThemedView style={styles.container}>
            <Pressable onPress={props.onPress} style={styles.pressable}>
                {/* Offset border */}
                <View style={styles.offsetBorder} />

                {/* Card */}
                <View style={styles.card}>
                    {hasImage ? (
                        <ImageBackground
                            source={props.imageUrl}
                            style={styles.image}
                            imageStyle={styles.imageStyle}
                            onError={() => setImageError(true)}
                        >
                            {/* Overlay for readability */}
                            <View style={styles.overlay} />

                            {/* Text content */}
                            <View style={styles.textOverlay}>
                                {props.sourceName ? (
                                    <ThemedText type="cardDate" style={styles.sourcePillOnHero}>
                                        {props.sourceName.toUpperCase()}
                                    </ThemedText>
                                ) : null}
                                <ThemedText type="cardTitle" style={styles.heroTitle} numberOfLines={3}>
                                    {props.title}
                                </ThemedText>
                                <ThemedText type="cardContent" style={styles.content} numberOfLines={3}>
                                    {props.content}
                                </ThemedText>
                            </View>
                        </ImageBackground>
                    ) : (
                        <View style={styles.textOnlyHero}>
                            {props.sourceName ? (
                                <ThemedText type="cardDate" style={styles.sourcePillTextOnly}>
                                    {props.sourceName.toUpperCase()}
                                </ThemedText>
                            ) : null}
                            <ThemedText type="cardTitle" style={styles.heroTitleTextOnly} numberOfLines={3}>
                                {props.title}
                            </ThemedText>
                            <ThemedText type="cardContent" style={{ marginTop: 8 }} numberOfLines={4}>
                                {props.content}
                            </ThemedText>
                        </View>
                    )}

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
            </Pressable>
        </ThemedView>
    )
}

export default ArticleCardTop
const styles = StyleSheet.create({
    container: {
        width: '100%',
        position: 'relative',
        paddingTop: 4,
    },
    pressable: {
        width: '100%',
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

    content: {
        color: '#fcfcfc',
    },
    heroTitle: {
        color: '#fff',
        fontSize: 26,
        lineHeight: 30,
    },

    sourcePillOnHero: {
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#fff',
        color: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 999,
        fontSize: 10,
        opacity: 0.95,
        marginBottom: 6,
    },

    textOnlyHero: {
        borderWidth: 1,
        borderColor: '#000',
        padding: 16,
        minHeight: 220,
        justifyContent: 'flex-end',
        gap: 6,
    },
    sourcePillTextOnly: {
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#000',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 999,
        fontSize: 10,
        opacity: 0.75,
        marginBottom: 6,
    },
    heroTitleTextOnly: {
        fontSize: 26,
        lineHeight: 30,
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

