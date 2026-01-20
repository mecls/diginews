import { Image } from 'expo-image';
import { Platform, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/src/components/themed-text';
import { ThemedView } from '@/src/components/themed-view';
import { Link } from 'expo-router';
import ScrollableTags from '@/src/components/Scrollable-tags';

export default function HomeScreen() {
  return (
    <ThemedView style={{ flex: 1, padding: 32, marginTop: Platform.OS === 'web' ? 48 : 0 }}>
      <View style={styles.stepContainer}>
        <ThemedText type="title" style={styles.titleContainer}>
          DIGINEWS
        </ThemedText>
        <ScrollableTags />
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
