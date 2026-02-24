import { Platform, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemedView } from '@/src/components/themed-view'
import { ThemedText } from '@/src/components/themed-text'
import { useAuth } from '@/src/providers/AuthProvider'
import { listBookmarks, sourceNameFromEmbeddedNewsSources, type Article } from '@/src/services/news'
import ArticleCard from '@/src/components/ArticleCard'
import * as WebBrowser from 'expo-web-browser'

const Bookmark = () => {
    const { user, isLoading: authLoading } = useAuth()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [articles, setArticles] = useState<Article[]>([])

    useEffect(() => {
        let mounted = true
        ; (async () => {
            if (authLoading) return
            if (!user) {
                setIsLoading(false)
                setArticles([])
                return
            }
            setIsLoading(true)
            setError(null)
            const { data, error } = await listBookmarks({ userId: user.id, limit: 50 })
            if (!mounted) return
            if (error) {
                setError(error.message)
                setArticles([])
            } else {
                const rows = (data ?? []) as any[]
                const mapped = rows
                    .map((r) => {
                        const embedded = r.articles
                        const article = Array.isArray(embedded) ? embedded[0] : embedded
                        if (!article) return null
                        return {
                            ...article,
                            source_name: sourceNameFromEmbeddedNewsSources(article.news_sources),
                        } as Article
                    })
                    .filter(Boolean) as Article[]
                setArticles(mapped)
            }
            setIsLoading(false)
        })()
        return () => { mounted = false }
    }, [user, authLoading])

    return (
        <ThemedView style={{ flex: 1, padding: 32, marginTop: Platform.OS === 'web' ? 48 : 0 }}>
            <ThemedText type="title">Bookmarks</ThemedText>
            <View style={{ marginTop: 16, gap: 24 }}>
                {authLoading || isLoading ? (
                    <ActivityIndicator />
                ) : !user ? (
                    <ThemedText type="default">Sign in to see your bookmarks.</ThemedText>
                ) : error ? (
                    <ThemedText type="default">{error}</ThemedText>
                ) : articles.length === 0 ? (
                    <ThemedText type="default">No bookmarks yet.</ThemedText>
                ) : (
                    articles.map((a) => (
                        <ArticleCard
                            key={a.id}
                            sourceName={a.source_name ?? ''}
                            title={a.title}
                            content={a.summary ?? ''}
                            imageUrl={a.image_url ? { uri: a.image_url } : null}
                            date={a.published_at ? new Date(a.published_at).toLocaleDateString() : ''}
                            bookmarked={true}
                            onPress={() => WebBrowser.openBrowserAsync(a.canonical_url)}
                        />
                    ))
                )}
            </View>
        </ThemedView>
    )
}

export default Bookmark