import { createStackNavigator } from 'react-navigation-stack';
import CalendarStack from './CalendarStack';
import ChallengeSubscriptionStack from './ChallengeSubscriptionStack';


const ChallengesStack = createStackNavigator(
  {
    ChallengeSubscription: ChallengeSubscriptionStack,
    Calendar: CalendarStack
  },
  {
    initialRouteName: 'Calendar',
    defaultNavigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      headerShown: false,
    }),
  },
);

export default ChallengesStack;

