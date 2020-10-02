import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import Header from '../../src/components/Shared/Header';
import ChallengeSubscriptionScreen from '../../src/screens/Challenges/subscription';
import OnBoarding1 from '../../src/screens/Challenges/Onboardings/OnBoarding1';
import OnBoarding2 from '../../src/screens/Challenges/Onboardings/OnBoarding2';
import OnBoarding3 from '../../src/screens/Challenges/Onboardings/OnBoarding3';
import OnBoarding4 from '../../src/screens/Challenges/Onboardings/OnBoarding4';
import OnBoarding5 from '../../src/screens/Challenges/Onboardings/OnBoarding5';
import OnBoarding6 from '../../src/screens/Challenges/Onboardings/OnBoarding6';
import CompleteBoarding from '../../src/screens/Challenges/Onboardings/CompleteBoarding';

const ChallengeStack = createStackNavigator(
  {
    ChallengeSubscription: ChallengeSubscriptionScreen,
    ChallengeOnBoarding1:OnBoarding1,
    ChallengeOnBoarding2:OnBoarding2,
    ChallengeOnBoarding3:OnBoarding3,
    ChallengeOnBoarding4:OnBoarding4,
    ChallengeOnBoarding5:OnBoarding5,
    ChallengeOnBoarding6:OnBoarding6,
    ChallengeCompleteBoarding:CompleteBoarding,
    
  },
  {
    initialRouteName: 'ChallengeSubscription',
    defaultNavigationOptions: ({ navigation }) => ({
      header: () => {
        const { routeName } = navigation.state;
        return (
          <Header
            stack="Subscription"
            navigation={navigation}
            withProfileButton={routeName === 'ChallengeSubscription'}
            withBackButton={routeName !== 'ChallengeSubscription'}
          />
        );
      },
    }),
  },
);

export default ChallengeStack;