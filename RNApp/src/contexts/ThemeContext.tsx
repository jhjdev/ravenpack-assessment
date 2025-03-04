import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Appearance, ColorSchemeName, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Theme types
export type ThemeType = 'light' | 'dark' | 'system';
export type ActualTheme = 'light' | 'dark';

// Theme context interface
interface ThemeContextType {
  theme: ThemeType;
  currentTheme: ActualTheme; // The actual theme being applied (resolved from system if needed)
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
  isDarkMode: boolean; // Convenience property
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Storage key for persisting theme preference
const THEME_STORAGE_KEY = '@theme_preference';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get device color scheme
  const deviceTheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>('system');
  const [currentTheme, setCurrentTheme] = useState<ActualTheme>(deviceTheme === 'dark' ? 'dark' : 'light');

  // Load saved theme preference from storage on initial render
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
          setThemeState(savedTheme as ThemeType);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };

    loadThemePreference();
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (theme === 'system') {
        setCurrentTheme(colorScheme === 'dark' ? 'dark' : 'light');
      }
    });

    return () => {
      subscription.remove();
    };
  }, [theme]);

  // Update currentTheme when theme changes
  useEffect(() => {
    const updateCurrentTheme = () => {
      if (theme === 'system') {
        const systemTheme: ColorSchemeName = Appearance.getColorScheme();
        setCurrentTheme(systemTheme === 'dark' ? 'dark' : 'light');
      } else {
        setCurrentTheme(theme);
      }
    };

    updateCurrentTheme();
  }, [theme]);

  // Save theme preference to storage whenever it changes
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
      } catch (error) {
        console.error('Failed to save theme preference:', error);
      }
    };

    saveThemePreference();
  }, [theme]);

  // Toggle between light, dark and system themes
  const toggleTheme = () => {
    setThemeState((prevTheme) => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'system';
      return 'light';
    });
  };

  // Directly set the theme
  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  // Compute isDarkMode for convenience
  const isDarkMode = currentTheme === 'dark';

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      currentTheme, 
      toggleTheme, 
      setTheme,
      isDarkMode
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Utility function to get colors based on the current theme
export const getThemeColors = (isDarkMode: boolean) => {
  return {
    background: isDarkMode ? '#121212' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    card: isDarkMode ? '#1E1E1E' : '#F5F5F5',
    border: isDarkMode ? '#383838' : '#E0E0E0',
    primary: '#0066CC',
    secondary: '#6C757D',
    accent: '#FF9800',
    error: '#DC3545',
    success: '#28A745',
    warning: '#FFC107',
    info: '#17A2B8',
  };
};

// Export default for convenient imports
export default ThemeContext;

