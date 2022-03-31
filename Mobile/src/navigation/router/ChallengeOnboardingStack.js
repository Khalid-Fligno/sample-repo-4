import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import Header from '../../components/Shared/Header';
import OnBoarding1 from '../../screens/Challenges/Onboardings/OnBoarding1';
import OnBoarding2 from '../../screens/Challenges/Onboardings/OnBoarding2';
import OnBoarding3 from '../../screens/Challenges/Onboardings/OnBoarding3';
import OnBoarding4 from '../../screens/Challenges/Onboardings/OnBoarding4';
import OnBoarding6 from '../../screens/Challenges/Onboardings/OnBoarding6';
import CompleteBoarding from '../../screens/Challenges/Onboardings/CompleteBoarding';

const ChallengeOnboardingStack = createStackNavigator(
  {
    ChallengeOnBoarding1:OnBoarding1,
    ChallengeOnBoarding2:OnBoarding2,
    ChallengeOnBoarding3:OnBoarding3,
    ChallengeOnBoarding4:OnBoarding4,
    ChallengeOnBoarding6:OnBoarding6,
    ChallengeCompleteBoarding:CompleteBoarding,
    
  },
  {
    initialRouteName: 'ChallengeOnBoarding1',
  
    defaultNavigationOptions: ({ navigation }) => ({
      gesturesEnabled:false,
      header: () => {
        const { routeName } = navigation.state;
        
        return (
          <Header
            stack="Subscription"
            navigation={navigation}
            withBackButton={routeName === 'ChallengeOnBoarding1'}
          />
        );
      },
    }),
  },
);

export default ChallengeOnboardingStack;