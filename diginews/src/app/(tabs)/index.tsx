import { Platform, StyleSheet, View, ScrollView, ActivityIndicator, Pressable } from 'react-native';

import { ThemedText } from '@/src/components/themed-text';
import { ThemedView } from '@/src/components/themed-view';
import ScrollableTags from '@/src/components/Scrollable-tags';
import ArticleCard from '@/src/components/ArticleCard';
import ArticleCardTop from '@/src/components/ArticleCardTop';
import { useEffect, useMemo, useState } from 'react';
import { listArticles, sourceNameFromEmbeddedNewsSources, type Article } from '@/src/services/news';
import * as WebBrowser from 'expo-web-browser';
export default function HomeScreen() {
  const [tag, setTag] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setIsLoading(true);
      setError(null);
      const { data, error } = await listArticles({ category: tag, limit: 30 });
      if (!isMounted) return;
      if (error) {
        setError(error.message);
        setArticles([]);
      } else {
        const mapped = ((data ?? []) as any[]).map((a) => ({
          ...a,
          source_name: sourceNameFromEmbeddedNewsSources(a.news_sources),
        })) as Article[];
        setArticles(mapped);
      }
      setIsLoading(false);
    })();
    return () => {
      isMounted = false;
    };
  }, [tag]);

  const hero = articles[0];
  const rest = useMemo(() => articles.slice(1), [articles]);

  return (
    <ThemedView style={{ flex: 1, padding: 32, marginTop: Platform.OS === 'web' ? 48 : 0 }}>
      <View style={styles.stepContainer}>
        <ThemedText type="title" style={styles.titleContainer}>
          DIGINEWS
        </ThemedText>
        <ScrollableTags value={tag} onChange={setTag} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 16,
            paddingBottom: 32,
            gap: 24,
          }}
        >
          {isLoading ? (
            <View style={{ paddingVertical: 32 }}>
              <ActivityIndicator />
            </View>
          ) : error ? (
            <ThemedText type="default">{error}</ThemedText>
          ) : articles.length === 0 ? (
            <ThemedText type="default">No articles yet. Ingestion should populate this soon.</ThemedText>
          ) : (
            <>
              {hero ? (
                <ArticleCardTop
                  sourceName={hero.source_name ?? ''}
                  title={hero.title}
                  content={hero.summary ?? ''}
                  imageUrl={hero.image_url ? { uri: hero.image_url } : null}
                  date={hero.published_at ? new Date(hero.published_at).toLocaleDateString() : ''}
                  bookmarked={false}
                  onPress={() => {
                    WebBrowser.openBrowserAsync(hero.canonical_url)
                  }}
                />
              ) : null}

              {rest.map((a) => (
                <ArticleCard
                  key={a.id}
                  sourceName={a.source_name ?? ''}
                  title={a.title}
                  content={a.summary ?? ''}
                  imageUrl={a.image_url ? { uri: a.image_url } : null}
                  layout="thumbnail"
                  date={a.published_at ? new Date(a.published_at).toLocaleDateString() : ''}
                  bookmarked={false}
                  onPress={() => WebBrowser.openBrowserAsync(a.canonical_url)}
                />
              ))}
            </>
          )}
        </ScrollView>

      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    marginTop: 48,
    gap: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
