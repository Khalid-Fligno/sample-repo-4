jest.mock('react-native-appsflyer', () => {
  return {
    initSdk: jest.fn(),
  };
});
