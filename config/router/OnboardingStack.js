import React from 'react';
import { createStackNavigator } from 'react-navigation';
import Onboarding1Screen from '../../src/screens/OnboardingStack/Onboarding1Screen';
import Progress1Screen from '../../src/screens/OnboardingStack/Progress1Screen';
import Progress2Screen from '../../src/screens/OnboardingStack/Progress2Screen';
import Progress3Screen from '../../src/screens/OnboardingStack/Progress3Screen';
import Progress4Screen from '../../src/screens/OnboardingStack/Progress4Screen';
import Progress5Screen from '../../src/screens/OnboardingStack/Progress5Screen';
import Progress6Screen from '../../src/screens/OnboardingStack/Progress6Screen';
import Header from '../../src/components/Header';
import { fadeSpec, fade, onboardingBackButtonMap, onboardingSkipButtonMap } from './utils';

const OnboardingStack = createStackNavigator(
  {
    Onboarding1: Onboarding1Screen,
    Progress1: Progress1Screen,
    Progress2: Progress2Screen,
    Progress3: Progress3Screen,
    Progress4: Progress4Screen,
    Progress5: Progress5Screen,
    Progress6: Progress6Screen,
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
            stack="onboarding"
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
