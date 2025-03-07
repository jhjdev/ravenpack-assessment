import React from 'react';
import {
  createBottomTabNavigator,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import { useTheme } from '../contexts/ThemeContext';
import { theme as themeColors } from '../styles/theme';
import Icon from 'react-native-vector-icons/Feather';

// Import actual screen components
import HomeScreen from '../screens/HomeScreen';
import AboutScreen from '../screens/AboutScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

// Define the type for the getTabIcon function parameters
type TabIconProps = {
  route: { name: string };
  focused: boolean;
  color: string;
  size: number;
};

// Extract this function outside the render method to prevent React from creating
// a new component on every render
const getTabIcon = ({ route, color, size }: TabIconProps) => {
  let iconName = 'help-circle';

  if (route.name === 'Home') {
    iconName = 'home';
  } else if (route.name === 'About') {
    iconName = 'info';
  } else if (route.name === 'Settings') {
    iconName = 'settings';
  }

  // Render the icon
  return <Icon name={iconName} size={size} color={color} />;
};

const AppNavigator = () => {
  const { currentTheme } = useTheme();
  const theme = themeColors[currentTheme];

  return (
    <Tab.Navigator
      screenOptions={({ route }) =>
        ({
          tabBarIcon: props => getTabIcon({ route, ...props }),
          tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.background,
            borderTopColor: theme.border,
          },
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: theme.text,
        } as BottomTabNavigationOptions)
      }>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="About" component={AboutScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default AppNavigator;
