import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

// Define the structure of our theme
export interface ThemeColors {
  background: string;
  text: string;
  textSecondary: string;
  accent: string;
  cardBackground: string;
  border: string;
  error: string;
  shadowColor: string;
  notification: string;
}

// Define theme colors for light and dark mode
export const theme: Record<'light' | 'dark', ThemeColors> = {
  light: {
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    accent: '#007AFF',
    cardBackground: '#F2F2F7',
    border: '#E5E5EA',
    error: '#FF3B30',
    shadowColor: '#000000',
    notification: '#FF9500',
  },
  dark: {
    background: '#121212',
    text: '#FFFFFF',
    textSecondary: '#BBBBBB',
    accent: '#0A84FF',
    cardBackground: '#1C1C1E',
    border: '#2C2C2E',
    error: '#FF453A',
    shadowColor: '#000000',
    notification: '#FFD60A',
  },
};

// Define typography, spacing, and border radius
export const typography = {
  fontSize: {
    sm: 12,
    md: 16,
    lg: 20,
  },
  fontWeight: {
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
  },
  lineHeight: {
    sm: 16,
    md: 20,
    lg: 24,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
};

// Common styles that can be reused across the app
type CommonStyles = {
  card: ViewStyle;
  container: ViewStyle;
  row: ViewStyle;
  screenContainer: ViewStyle;
  smallText: TextStyle;
  spaceBetween: ViewStyle;
  subtitle: TextStyle;
  text: TextStyle;
  title: TextStyle;
  center: ViewStyle;
};

export const commonStyles: CommonStyles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  screenContainer: {
    flex: 1,
    padding: spacing.md,
  },
  smallText: {
    fontSize: typography.fontSize.sm,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.sm,
  },
  text: {
    fontSize: typography.fontSize.md,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.md,
  },
});
