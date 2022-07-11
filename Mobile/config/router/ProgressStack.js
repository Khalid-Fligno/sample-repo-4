import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import Header from '../../src/components/Shared/Header';
import { YouScreen } from '../../src/screens/AppStack/Progress/you/YouScreen';

const ProgressStack = createStackNavigator(
  {
    ProgressHome: YouScreen,
  },
  {
    initialRouteName: 'ProgressHome',
    defaultNavigationOptions: ({ navigation }) => ({
      header: () => {
        const { routeName } = navigation.state;
        return (
          <Header
            navigation={navigation}
            stack="progress"
            withProfileButton={routeName === 'ProgressHome'}
            // withHomeButton={true}
          />
        );
      },
    }),
  },
);

export default ProgressStack;
