import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { theme as themeColors, commonStyles } from '../../styles/theme';

type TechnologyItemProps = {
  name: string;
  description: string;
  url: string;
};

const TechnologyItem: React.FC<TechnologyItemProps> = ({ name, description, url }) => {
  const { currentTheme } = useTheme();
  const theme = themeColors[currentTheme];
  const handlePress = async () => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.techItem,
        {
          backgroundColor: theme.cardBackground,
          shadowColor: theme.text,
        },
      ]}
      onPress={handlePress}>
      <Text style={[styles.techName, styles.techNameText, { color: theme.accent }]}>{name}</Text>
      <Text style={[styles.techDescription, styles.techDescriptionText, { color: theme.text }]}>
        {description}
      </Text>
    </TouchableOpacity>
  );
};

const AboutScreen: React.FC = () => {
  const { currentTheme } = useTheme();
  const theme = themeColors[currentTheme];
  const technologies: TechnologyItemProps[] = [
    {
      name: 'React Native',
      description: 'A framework for building native apps using React',
      url: 'https://reactnative.dev/',
    },
    {
      name: 'TypeScript',
      description: 'A strongly typed programming language that builds on JavaScript',
      url: 'https://www.typescriptlang.org/',
    },
    {
      name: 'TanStack Query',
      description: 'Powerful asynchronous state management for data fetching',
      url: 'https://tanstack.com/query/latest',
    },
    {
      name: 'Axios',
      description: 'Promise based HTTP client for the browser and node.js',
      url: 'https://axios-http.com/',
    },
    {
      name: 'React Navigation',
      description: 'Routing and navigation for React Native apps',
      url: 'https://reactnavigation.org/',
    },
    {
      name: 'date-fns',
      description: 'Modern JavaScript date utility library',
      url: 'https://date-fns.org/',
    },
    {
      name: 'ESLint',
      description: 'Pluggable JavaScript linter',
      url: 'https://eslint.org/',
    },
    {
      name: 'Prettier',
      description: 'Opinionated code formatter',
      url: 'https://prettier.io/',
    },
    {
      name: 'JSONPlaceholder',
      description: 'Free fake API for testing and prototyping',
      url: 'https://jsonplaceholder.typicode.com/',
    },
  ];

  return (
    <View
      style={[
        commonStyles.screenContainer,
        styles.container,
        { backgroundColor: theme.background },
      ]}>
      <Text style={[commonStyles.title, styles.titleText, { color: theme.text }]}>
        About This App
      </Text>

      <Text style={[styles.description, styles.descriptionText, { color: theme.text }]}>
        This is a simple blog post reading application created with React Native that uses the
        JSONPlaceholder API.
      </Text>

      <Text style={[commonStyles.subtitle, styles.subtitleText, { color: theme.text }]}>
        Technologies Used
      </Text>

      <ScrollView style={styles.techList}>
        {technologies.map((tech, index) => (
          <TechnologyItem key={index} {...tech} />
        ))}
      </ScrollView>

      <Text style={[styles.footer, styles.footerText, { color: theme.textSecondary }]}>
        Tap on any technology to learn more about it.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
  },
  descriptionText: {
    textAlign: 'left',
  },
  footer: {
    fontSize: 14,
    marginBottom: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  footerText: {
    fontStyle: 'italic',
  },
  subtitleText: {
    marginVertical: 10,
  },
  techDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  techDescriptionText: {
    fontWeight: 'normal',
  },
  techItem: {
    borderRadius: 8,
    elevation: 2,
    marginBottom: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  techList: {
    flex: 1,
    marginBottom: 16,
  },
  techName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  techNameText: {
    textTransform: 'none',
  },
  titleText: {
    marginBottom: 16,
  },
});

export default AboutScreen;
