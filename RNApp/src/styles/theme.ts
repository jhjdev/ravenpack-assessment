import {StyleSheet} from 'react-native';

// Define the structure of our theme
export interface ThemeColors {
  background: string;
  text: string;
  textSecondary: string;
  accent: string;
  cardBackground: string;
  border: string;
  error: string;
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
  },
  dark: {
    background: '#121212',
    text: '#FFFFFF',
    textSecondary: '#BBBBBB',
    accent: '#0A84FF',
    cardBackground: '#1C1C1E',
    border: '#2C2C2E',
    error: '#FF453A',
  },
};

// Common styles that can be reused across the app
export const commonStyles = StyleSheet.create({
  card: {
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
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
    padding: 16,
  },
  smallText: {
    fontSize: 14,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
