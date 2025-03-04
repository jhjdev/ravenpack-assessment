import React from 'react';
import { View, Text, StyleSheet, Switch, Pressable } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import type { ThemeType } from '../../contexts/ThemeContext';
import { theme as themeColors } from '../../styles/theme';

type ThemeOptionProps = {
  title: string;
  isSelected: boolean;
  onSelect: () => void;
};

const ThemeOption: React.FC<ThemeOptionProps> = ({ title, isSelected, onSelect }) => {
  const { currentTheme } = useTheme();
  const theme = themeColors[currentTheme];
  
  return (
    <Pressable
      style={[
        styles.themeOption,
        isSelected && styles.selectedOption,
        { backgroundColor: isSelected ? theme.accent : theme.cardBackground }
      ]}
      onPress={onSelect}
    >
      <Text
        style={[
          styles.themeOptionText,
          { color: isSelected ? theme.background : theme.text }
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

const SettingsScreen: React.FC = () => {
  const { theme: themeMode, currentTheme, setTheme } = useTheme();
  const isSystemTheme = themeMode === 'system';
  const theme = themeColors[currentTheme];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        Theme Settings
      </Text>

      <View style={styles.optionsContainer}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Choose Theme
        </Text>

        <View style={styles.themeOptions}>
          <ThemeOption
            title="Light Mode"
            isSelected={!isSystemTheme && currentTheme === 'light'}
            onSelect={() => setTheme('light')}
          />
          
          <ThemeOption
            title="Dark Mode"
            isSelected={!isSystemTheme && currentTheme === 'dark'}
            onSelect={() => setTheme('dark')}
          />
        </View>

        <View style={styles.systemThemeContainer}>
          <Text style={[styles.systemThemeText, { color: theme.text }]}>
            Use System Theme
          </Text>
          <Switch
            value={isSystemTheme}
            onValueChange={() => setTheme(isSystemTheme ? currentTheme : 'system')}
            trackColor={{ false: '#767577', true: theme.accent }}
            thumbColor="#f4f3f4"
          />
        </View>
      </View>
      
      <Text style={[styles.note, { color: theme.textSecondary }]}>
        Changes are applied immediately and saved for your next visit.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  optionsContainer: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  themeOptions: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  themeOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOption: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  themeOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  systemThemeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  systemThemeText: {
    fontSize: 16,
  },
  note: {
    fontSize: 14,
    marginTop: 20,
    fontStyle: 'italic',
  },
});

export default SettingsScreen;

