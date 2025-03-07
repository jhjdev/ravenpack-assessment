import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

// Color palettes
const colors = {
  // Primary colors
  primary: {
    light: '#007AFF',
    dark: '#0A84FF',
  },
  // Secondary colors
  secondary: {
    light: '#5856D6',
    dark: '#5E5CE6',
  },
  // Background colors
  background: {
    light: '#F2F2F7',
    dark: '#1C1C1E',
  },
  // Surface colors (cards, modals, etc.)
  surface: {
    light: '#FFFFFF',
    dark: '#2C2C2E',
  },
  // Text colors
  text: {
    primary: {
      light: '#000000',
      dark: '#FFFFFF',
    },
    secondary: {
      light: '#3C3C43',
      dark: '#EBEBF5',
    },
    tertiary: {
      light: '#8E8E93',
      dark: '#8E8E93',
    },
  },
  // Border colors
  border: {
    light: '#C6C6C8',
    dark: '#38383A',
  },
  // Error/success/warning colors
  error: {
    light: '#FF3B30',
    dark: '#FF453A',
  },
  success: {
    light: '#34C759',
    dark: '#30D158',
  },
  warning: {
    light: '#FF9500',
    dark: '#FF9F0A',
  },
};

// Typography
const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
  },
};

// Spacing
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border radius
const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

// Shadows
const shadows = {
  light: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
  dark: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2.0,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.4,
      shadowRadius: 3.84,
      elevation: 5,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.5,
      shadowRadius: 6.27,
      elevation: 10,
    },
  },
};

// Animation timing
const animation = {
  short: 150,
  medium: 300,
  long: 500,
};

// Theme objects
export const lightTheme = {
  colors: {
    primary: colors.primary.light,
    secondary: colors.secondary.light,
    background: colors.background.light,
    surface: colors.surface.light,
    text: {
      primary: colors.text.primary.light,
      secondary: colors.text.secondary.light,
      tertiary: colors.text.tertiary.light,
    },
    border: colors.border.light,
    error: colors.error.light,
    success: colors.success.light,
    warning: colors.warning.light,
  },
  shadows: shadows.light,
};

export const darkTheme = {
  colors: {
    primary: colors.primary.dark,
    secondary: colors.secondary.dark,
    background: colors.background.dark,
    surface: colors.surface.dark,
    text: {
      primary: colors.text.primary.dark,
      secondary: colors.text.secondary.dark,
      tertiary: colors.text.tertiary.dark,
    },
    border: colors.border.dark,
    error: colors.error.dark,
    success: colors.success.dark,
    warning: colors.warning.dark,
  },
  shadows: shadows.dark,
};

// Define the type for commonStyles
type CommonStylesType = {
  card: ViewStyle;
  center: ViewStyle;
  container: ViewStyle;
  marginBottom: ViewStyle;
  padding: ViewStyle;
  paddingHorizontal: ViewStyle;
  paddingVertical: ViewStyle;
  row: ViewStyle;
  spaceBetween: ViewStyle;
};

// Common styles that can be reused throughout the app
const commonStyles: CommonStylesType = StyleSheet.create({
  card: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  marginBottom: {
    marginBottom: spacing.md,
  },
  padding: {
    padding: spacing.md,
  },
  paddingHorizontal: {
    paddingHorizontal: spacing.md,
  },
  paddingVertical: {
    paddingVertical: spacing.md,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
});

// Create theme-specific styles for components
export const createThemedStyles =
  <T extends StyleSheet.NamedStyles<T>>(
    stylesCallback: (theme: typeof lightTheme, commonStyles: CommonStylesType) => T,
  ) =>
  (isLightTheme: boolean) => {
    const theme = isLightTheme ? lightTheme : darkTheme;
    return StyleSheet.create(stylesCallback(theme, commonStyles));
  };

// Export constants and styles
export { colors, typography, spacing, borderRadius, shadows, animation, commonStyles };

// Type for our theme
export type Theme = typeof lightTheme;

// Helper type for style objects
export type Styles<T extends StyleSheet.NamedStyles<T>> = {
  [K in keyof T]: ViewStyle | TextStyle;
};
