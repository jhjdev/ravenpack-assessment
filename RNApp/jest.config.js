module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest/setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', {
      configFile: './babel.jest.config.js'
    }],
    '^.+\\.(ts|tsx)$': ['babel-jest', {
      configFile: './babel.jest.config.js'
    }]
  },
  // Transform files in node_modules that could be causing issues
  transformIgnorePatterns: [
    'node_modules/(?!(@tanstack/react-query|@react-native|react-native))'
  ],
  moduleNameMapper: {
    '@react-native/js-polyfills/error-guard': '<rootDir>/jest/mocks/errorGuardMock.js'
  }
};
