import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import Progress1Screen from "../../src/screens/OnboardingStack/Progress1Screen";
import Progress2Screen from "../../src/screens/OnboardingStack/Progress2Screen";
import ProgressEditScreen from "../../src/screens/OnboardingStack/ProgressEditScreen"; import Header from '../../src/components/Shared/Header';
import { YouScreen } from '../../src/screens/AppStack/Progress/you/YouScreen';

const progressBackButtonMap = {
  Progress1: true,
  Progress2: true,
  ProgressEdit: true
};

const ProgressStack = createStackNavigator(
  {
    ProgressHome: YouScreen,
    Progress1: Progress1Screen,
    Progress2: Progress2Screen,
    ProgressEdit: ProgressEditScreen,
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
            withBackButton={progressBackButtonMap[routeName]}
            withProfileButton={routeName === 'ProgressHome'}
          />
        );
      },
    }),
  },
);

export default ProgressStack;
