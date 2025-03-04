module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: [
    './jest/setup.js'
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
      configFile: './babel.jest.config.js'
    }]
  },
  moduleNameMapper: {
    // Mock problematic modules
    '@react-native/js-polyfills/error-guard': '<rootDir>/jest/mocks/error-guard.js',
    'react-native': '<rootDir>/jest/mocks/react-native.js',
    '@react-native-community/netinfo': '<rootDir>/jest/mocks/netinfo.js',
    // Mock the ThemeContext
    '^src/context/ThemeContext$': '<rootDir>/jest/mocks/ThemeContext.js',
    // Mock the theme styles
    '^src/styles/theme$': '<rootDir>/jest/mocks/src/styles/theme.js',
    // Mock App.tsx
    '^App$': '<rootDir>/jest/mocks/App.js',
    // Mock NewAppScreen
    'react-native/Libraries/NewAppScreen': '<rootDir>/jest/mocks/NewAppScreen.js',
    // Map virtual path for style files
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/jest/mocks/fileMock.js',
    '\\.(css|less)$': '<rootDir>/jest/mocks/styleMock.js'
  },
  // Transform files in node_modules that could be causing issues
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-navigation|@react-navigation|@tanstack/react-query))'
  ],
};
