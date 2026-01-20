import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/src/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'unselected' | 'cardTitle' | 'cardContent' | 'cardDate';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'unselected' ? styles.unselected : undefined,
        type === 'cardTitle' ? styles.cardTitle : undefined,
        type === 'cardContent' ? styles.cardContent : undefined,
        type === 'cardDate' ? styles.cardDate : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Switzer-Regular',
  },
  defaultSemiBold: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'Switzer-Bold',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Switzer-Black',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: 'Switzer-Bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
    fontFamily: 'Switzer-Regular',
  },
  unselected: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Switzer-Light',
    color: '#6e6e7e',
  },
  cardTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'Switzer-Black',
  },
  cardContent: {
    fontSize: 12,
    lineHeight: 20,
    fontFamily: 'Switzer-Regular',
  },
  cardDate: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Switzer-Light',
    color: '#6e6e7e',
  },
});
