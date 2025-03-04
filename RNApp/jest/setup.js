// Jest setup file

// Mock React Native's StyleSheet
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  return {
    ...RN,
    StyleSheet: {
      ...RN.StyleSheet,
      create: jest.fn((styles) => styles),
      hairlineWidth: 1,
      absoluteFill: {},
      flatten: jest.fn(styles => styles),
    },
  };
});

// Mock App
jest.mock('App', () => 'App');

// Setup other global mocks if needed
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);
