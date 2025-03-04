// Mock for src/styles/theme.ts
import { StyleSheet } from 'react-native';

// Mock theme constants
export const lightTheme = {
  background: '#FFFFFF',
  text: '#000000',
  textSecondary: '#666666',
  accent: '#007AFF',
  cardBackground: '#F2F2F7',
  border: '#E5E5EA',
  error: '#FF3B30',
};

export const darkTheme = {
  background: '#121212',
  text: '#FFFFFF',
  textSecondary: '#BBBBBB',
  accent: '#0A84FF',
  cardBackground: '#1C1C1E',
  border: '#2C2C2E',
  error: '#FF453A',
};

// Common styles that can be reused across the app
export const commonStyles = {
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenPadding: {
    padding: 16,
  },
  card: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};

export const getThemedStyles = theme => ({
  container: {
    ...commonStyles.container,
    backgroundColor: theme.background,
  },
  card: {
    ...commonStyles.card,
    backgroundColor: theme.cardBackground,
    borderColor: theme.border,
  },
  textPrimary: {
    color: theme.text,
    fontSize: 16,
  },
  textSecondary: {
    color: theme.textSecondary,
    fontSize: 14,
  },
  button: {
    backgroundColor: theme.accent,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
