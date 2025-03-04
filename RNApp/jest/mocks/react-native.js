// Mock for react-native
const reactNative = jest.requireActual('react-native');

module.exports = {
  ...reactNative,
  StyleSheet: {
    ...reactNative.StyleSheet,
    create: styles => styles,
    flatten: jest.fn(styles => styles),
  },
  Platform: {
    ...reactNative.Platform,
    OS: 'ios',
    select: jest.fn(obj => obj.ios || obj.default),
  },
  Animated: {
    ...reactNative.Animated,
    timing: jest.fn(() => ({
      start: jest.fn(cb => cb && cb({ finished: true })),
    })),
  },
  Alert: {
    ...reactNative.Alert,
    alert: jest.fn(),
  },
  NativeModules: {
    ...reactNative.NativeModules,
    KeyboardObserver: { addListener: jest.fn() },
    StatusBarManager: { getHeight: jest.fn((cb) => cb(0)) },
  },
  Dimensions: {
    ...reactNative.Dimensions,
    get: jest.fn(() => ({ width: 375, height: 812 })),
  },
  useColorScheme: jest.fn(() => 'light'),
};
