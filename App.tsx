import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import { PostDetailsScreen } from './src/screens/PostDetailsScreen';
import UserPostsScreen from './src/screens/UserPostsScreen';
import { theme as themeColors } from './src/styles/theme';

// Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Create a stack navigator for main screens and modals
const Stack = createNativeStackNavigator();

// Navigation theming based on current theme mode
const NavigationTheme = () => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const theme = themeColors[currentTheme];

  const customDefaultTheme = {
    ...DefaultTheme,
    colors: {
      background: themeColors.light.background,
      card: themeColors.light.cardBackground,
      text: themeColors.light.text,
      primary: theme.accent,
      border: themeColors.light.border,
      notification: themeColors.light.notification,
    },
  };

  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      background: themeColors.dark.background,
      card: themeColors.dark.cardBackground,
      text: themeColors.dark.text,
      primary: theme.accent,
      border: themeColors.dark.border,
      notification: themeColors.dark.notification,
    },
  };

  return (
    <NavigationContainer theme={isDark ? customDarkTheme : customDefaultTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}>
        {/* Main tab navigator */}
        <Stack.Screen name="Main" component={AppNavigator} />

        {/* Modal screens */}
        <Stack.Screen
          name="PostDetails"
          component={PostDetailsScreen}
          options={{
            headerShown: true,
            headerTitle: 'Post Details',
            headerTintColor: theme.text,
            headerStyle: {
              backgroundColor: theme.cardBackground,
            },
          }}
        />
        <Stack.Screen
          name="UserPosts"
          component={UserPostsScreen}
          options={{
            headerShown: true,
            headerTitle: 'User Posts',
            headerTintColor: theme.text,
            headerStyle: {
              backgroundColor: theme.cardBackground,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Main app component
const App = () => (
  <SafeAreaProvider>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar translucent />
        <NavigationTheme />
      </QueryClientProvider>
    </ThemeProvider>
  </SafeAreaProvider>
);

export default App;
