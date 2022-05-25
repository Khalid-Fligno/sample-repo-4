import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import Header from '../../../components/Shared/Header';
import { TabScreen } from "../../../screens/tab/index";

const ProgressStack = createStackNavigator(
  {
    ProgressHome: TabScreen.YouScreen,
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
