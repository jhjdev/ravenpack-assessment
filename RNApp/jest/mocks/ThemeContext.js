// Mock for src/context/ThemeContext
import React from 'react';

const lightTheme = {
  colors: {
    background: '#FFFFFF',
    text: '#000000',
    primary: '#007AFF',
    secondary: '#5856D6',
    accent: '#FF2D55',
    error: '#FF3B30',
    card: '#F2F2F2',
    border: '#C7C7CC',
    notification: '#FF3B30',
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
  typography: {
    fontSize: {
      small: 12,
      medium: 16,
      large: 20,
      xlarge: 24,
    },
    fontWeight: {
      regular: '400',
      medium: '600',
      bold: '700',
    },
  },
};

const darkTheme = {
  colors: {
    background: '#000000',
    text: '#FFFFFF',
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    accent: '#FF375F',
    error: '#FF453A',
    card: '#1C1C1E',
    border: '#38383A',
    notification: '#FF453A',
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
  typography: {
    fontSize: {
      small: 12,
      medium: 16,
      large: 20,
      xlarge: 24,
    },
    fontWeight: {
      regular: '400',
      medium: '600',
      bold: '700',
    },
  },
};

export const ThemeContext = React.createContext({
  currentTheme: 'light',
  theme: lightTheme,
  isDarkMode: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider
      value={{
        currentTheme: 'light',
        theme: lightTheme,
        isDarkMode: false,
        toggleTheme: () => {},
        setTheme: () => {},
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return React.useContext(ThemeContext);
};

export default {
  ThemeContext,
  ThemeProvider,
  useTheme,
};

export const lightTheme = lightTheme;
export const darkTheme = darkTheme;
