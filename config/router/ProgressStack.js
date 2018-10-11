import React from 'react';
import { createStackNavigator } from 'react-navigation';
import ProgressHomeScreen from '../../src/screens/AppStack/Progress/ProgressHomeScreen';
import Header from '../../src/components/Shared/Header';

const ProgressStack = createStackNavigator(
  {
    ProgressHome: ProgressHomeScreen,
  },
  {
    initialRouteName: 'ProgressHome',
    navigationOptions: ({ navigation }) => ({
      header: () => {
        const { routeName } = navigation.state;
        return (
          <Header
            navigation={navigation}
            stack="progress"
            withProfileButton={routeName === 'ProgressHome'}
            withHelpButton={routeName === 'ProgressHome'}
          />
        );
      },
    }),
  },
);

export default ProgressStack;
