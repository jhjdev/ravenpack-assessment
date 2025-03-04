// Mock global variables used by React Native
global.window = {};
global.navigator = { product: 'ReactNative' };
global.requestAnimationFrame = function(callback) {
  return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function(id) {
  clearTimeout(id);
};

// Add any other setup code here
