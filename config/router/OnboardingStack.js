import React from 'react';
import { createStackNavigator } from 'react-navigation';
import Onboarding1Screen from '../../src/screens/OnboardingStack/Onboarding1Screen';
import Onboarding2Screen from '../../src/screens/OnboardingStack/Onboarding2Screen';
import Onboarding3Screen from '../../src/screens/OnboardingStack/Onboarding3Screen';
import Onboarding4Screen from '../../src/screens/OnboardingStack/Onboarding4Screen';
import Header from '../../src/components/Header';
import { fadeSpec, fade, onboardingBackButtonMap, onboardingSkipButtonMap } from './utils';

const OnboardingStack = createStackNavigator(
  {
    Onboarding1: Onboarding1Screen,
    Onboarding2: Onboarding2Screen,
    Onboarding3: Onboarding3Screen,
    Onboarding4: Onboarding4Screen,
  },
  {
    initialRouteName: 'Onboarding1',
    transitionConfig: () => ({
      transitionSpec: fadeSpec,
      screenInterpolator: (props) => {
        return fade(props);
      },
    }),
    navigationOptions: ({ navigation }) => ({
      header: () => {
        const { routeName } = navigation.state;
        return (
          <Header
            navigation={navigation}
            withBackButton={onboardingBackButtonMap[routeName]}
            withSkipButton={onboardingSkipButtonMap[routeName]}
          />
        );
      },
    }),
  },
);

export default OnboardingStack;
