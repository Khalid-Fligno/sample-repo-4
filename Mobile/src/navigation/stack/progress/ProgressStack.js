import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import ProgressHomeScreen from '../../../screens/AppStack/Progress/ProgressHomeScreen';
import Header from '../../../components/Shared/Header';
import { YouTabScreen } from '../../../screens/tab/you';

const ProgressStack = createStackNavigator(
  {
    ProgressHome: YouTabScreen.YouScreen,
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
          />
        );
      },
    }),
  },
);

export default ProgressStack;
