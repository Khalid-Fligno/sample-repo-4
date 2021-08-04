import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import SubscriptionScreen from '../../src/screens/OnboardingStack/SubscriptionScreen';
import Onboarding1Screen from '../../src/screens/OnboardingStack/Onboarding1Screen';
import Progress1Screen from '../../src/screens/OnboardingStack/Progress1Screen';
import Progress2Screen from '../../src/screens/OnboardingStack/Progress2Screen';
import Progress3Screen from '../../src/screens/OnboardingStack/Progress3Screen';
import Progress4Screen from '../../src/screens/OnboardingStack/Progress4Screen';
import Progress5Screen from '../../src/screens/OnboardingStack/Progress5Screen';
import Progress6Screen from '../../src/screens/OnboardingStack/Progress6Screen';
import ProgressEditScreen from '../../src/screens/OnboardingStack/ProgressEditScreen';
import Header from '../../src/components/Shared/Header';
import { fadeSpec, fade, onboardingBackButtonMap, onboardingSkipButtonMap } from './utils';
import Onboarding2Screen from '../../src/screens/OnboardingStack/Onboarding2Screen';

const OnboardingStack = createStackNavigator(
  {
    Subscription: SubscriptionScreen,
    Onboarding1: Onboarding1Screen,
    Onboarding2: Onboarding2Screen,
    Progress1: Progress1Screen,
    Progress2: Progress2Screen,
    Progress3: Progress3Screen,
    Progress4: Progress4Screen,
    Progress5: Progress5Screen,
    Progress6: Progress6Screen,
    ProgressEdit: ProgressEditScreen
  },
  {
    initialRouteName: 'Subscription',
    transitionConfig: () => ({
      transitionSpec: fadeSpec,
      screenInterpolator: (props) => {
        return fade(props);
      },
    }),
    defaultNavigationOptions: ({ navigation }) => ({
      gesturesEnabled:false,
      header: () => {
        const { routeName } = navigation.state;
        return (
          <Header
            stack="onboarding"
            navigation={navigation}
            withBackButton={onboardingBackButtonMap[routeName]}
            withLogoutButton={routeName === 'Subscription'}
            // withSkipButton={onboardingSkipButtonMap[routeName]}
            withHelpButton={routeName === 'Progress1'}
            withRestoreButton={routeName === 'Subscription'}
          />
        );
      },
    }),
  },
);

export default OnboardingStack;
