import { Image } from 'expo-image';
import { Platform, StyleSheet, View, ScrollView } from 'react-native';

import { ThemedText } from '@/src/components/themed-text';
import { ThemedView } from '@/src/components/themed-view';
import { Link } from 'expo-router';
import ScrollableTags from '@/src/components/Scrollable-tags';
import NewsLetterCardTop from '@/src/components/NewsLetterCardTop';
import NewsLetterCard from '@/src/components/NewsLetterCard';
export default function HomeScreen() {
  return (
    <ThemedView style={{ flex: 1, padding: 32, marginTop: Platform.OS === 'web' ? 48 : 0 }}>
      <View style={styles.stepContainer}>
        <ThemedText type="title" style={styles.titleContainer}>
          DIGINEWS
        </ThemedText>
        <ScrollableTags />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 16,
            paddingBottom: 32,
            gap: 24,
          }}
        >
          <NewsLetterCardTop
            title="The AI revolution is here. Will the economy survive the transition?"
            content="The man who predicted the 2008 crash, Anthropic’s co-founder, and..."
            imageUrl={require('@/assets/images/news-feed-preview.jpg')}
            date="12 Jun, 2024"
            bookmarked={false}
          />

          <NewsLetterCard
            title="Maduro in Minneapolis"
            content="Murderous Lies..."
            imageUrl={require('@/assets/images/secondimg.jpg')}
            layout="banner"
            date="12 Jun, 2024"
            bookmarked={false}
          />
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
