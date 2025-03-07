/* eslint-env jest */
// Mock for @react-native/js-polyfills/error-guard
module.exports = {
  ErrorUtils: {
    setGlobalHandler: jest.fn(),
    reportError: jest.fn(),
    reportFatalError: jest.fn(),
  },
};
