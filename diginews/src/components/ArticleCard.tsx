import { StyleSheet, View, Image, Pressable } from 'react-native'
import React, { useState } from 'react'
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';
import FontAwesome from '@expo/vector-icons/build/FontAwesome';

type LayoutType = 'thumbnail' | 'banner' | 'full';

type Props = {
    sourceName?: string;
    title: string;
    content: string;
    imageUrl: any;
    date: string;
    bookmarked: boolean;
    layout?: LayoutType;  // 'thumbnail' | 'banner' | 'full'
    onPress?: () => void;
    onBookmarkPress?: () => void;
    onSharePress?: () => void;
}

const ArticleCard = (props: Props) => {
    const [isBookmarked, setIsBookmarked] = useState(props.bookmarked);
    const layout = props.layout || 'thumbnail';
    const [imageError, setImageError] = useState(false)
    const hasImage = !!props.imageUrl && !imageError

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
        props.onBookmarkPress?.();
    };

    // Render different layouts based on image type
    const renderContent = () => {
        switch (layout) {
            case 'banner':
                return (
                    <View style={styles.bannerContainer}>
                        {/* Banner image at top */}
                        {hasImage ? (
                            <View style={styles.bannerImageWrapper}>
                                <View style={styles.bannerShadow} />
                                <Image
                                    source={props.imageUrl}
                                    style={styles.bannerImage}
                                    onError={() => setImageError(true)}
                                />
                            </View>
                        ) : null}

                        {/* Text below */}
                        <View style={styles.bannerTextContainer}>
                            {props.sourceName ? (
                                <ThemedText type="cardDate" style={styles.sourcePill}>
                                    {props.sourceName.toUpperCase()}
                                </ThemedText>
                            ) : null}
                            <ThemedText type="cardTitle" numberOfLines={2}>
                                {props.title}
                            </ThemedText>
                            <ThemedText type="cardContent" numberOfLines={3} style={{ marginTop: 4 }}>
                                {props.content}
                            </ThemedText>
                        </View>
                    </View>
                );

            case 'full':
                return (
                    <View style={styles.fullContainer}>
                        {/* Full width image */}
                        {hasImage ? (
                            <Image
                                source={props.imageUrl}
                                style={styles.fullImage}
                                onError={() => setImageError(true)}
                            />
                        ) : null}

                        {/* Overlaid or below text */}
                        <View style={styles.fullTextContainer}>
                            {props.sourceName ? (
                                <ThemedText type="cardDate" style={styles.sourcePill}>
                                    {props.sourceName.toUpperCase()}
                                </ThemedText>
                            ) : null}
                            <ThemedText type="cardTitle" numberOfLines={2}>
                                {props.title}
                            </ThemedText>
                            <ThemedText type="cardContent" numberOfLines={2} style={{ marginTop: 6 }}>
                                {props.content}
                            </ThemedText>
                        </View>
                    </View>
                );

            case 'thumbnail':
            default:
                return (
                    <View style={styles.thumbnailContainer}>
                        {/* Text on left */}
                        <View style={styles.thumbnailTextContainer}>
                            {props.sourceName ? (
                                <ThemedText type="cardDate" style={styles.sourcePill}>
                                    {props.sourceName.toUpperCase()}
                                </ThemedText>
                            ) : null}
                            <ThemedText type="cardTitle" numberOfLines={2}>
                                {props.title}
                            </ThemedText>
                            <ThemedText type="cardContent" numberOfLines={3} style={{ marginTop: 8 }}>
                                {props.content}
                            </ThemedText>
                        </View>

                        {/* Thumbnail on right */}
                        {hasImage ? (
                            <View style={styles.thumbnailImageWrapper}>
                                <View style={styles.thumbnailShadow} />
                                <Image
                                    source={props.imageUrl}
                                    style={styles.thumbnailImage}
                                    onError={() => setImageError(true)}
                                />
                            </View>
                        ) : null}
                    </View>
                );
        }
    };

    return (
        <Pressable
            onPress={props.onPress}
            style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed
            ]}
        >
            <ThemedView style={styles.cardContent}>
                {renderContent()}

                {/* Footer with actions */}
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
            </ThemedView>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
    },
    cardPressed: {
        opacity: 0.95,
    },
    cardContent: {
        flex: 1,
        paddingVertical: 16,
    },

    // Thumbnail layout (text left, small image right)
    thumbnailContainer: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    thumbnailTextContainer: {
        flex: 1,
    },
    sourcePill: {
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#000',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
        fontSize: 10,
        opacity: 0.75,
        marginBottom: 6,
    },
    thumbnailImageWrapper: {
        position: 'relative',
        width: 120,
        height: 120,
    },
    thumbnailShadow: {
        position: 'absolute',
        top: 3,
        left: 3,
        width: '100%',
        height: '100%',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 2,
    },
    thumbnailImage: {
        width: 120,
        height: 120,
        borderRadius: 2,
        borderColor: '#000',
        borderWidth: 1,
        resizeMode: 'cover',
    },

    // Banner layout (image top, text below)
    bannerContainer: {
        marginBottom: 12,
    },
    bannerImageWrapper: {
        position: 'relative',
        width: '100%',
        height: 80,
        marginBottom: 12,
    },
    bannerShadow: {
        position: 'absolute',
        top: 8,
        left: 4,
        width: '100%',
        height: '90%',
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 2,
    },
    bannerImage: {
        width: '100%',
        height: 80,
        resizeMode: 'contain',
    },
    bannerTextContainer: {
        gap: 4,
    },

    // Full width layout (large image with text)
    fullContainer: {
        marginBottom: 12,
    },
    fullImage: {
        width: '100%',
        height: 240,
        borderRadius: 4,
        resizeMode: 'cover',
        marginBottom: 12,
    },
    fullTextContainer: {
        gap: 4,
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
    },
})

export default ArticleCard

