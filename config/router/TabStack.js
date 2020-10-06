import React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import HomeStack from './HomeStack';
import FeedStack from './FeedStack';
import SubscriptionStack from './SubscriptionStack';
import NutritionStack from './NutritionStack';
import WorkoutsStack from './WorkoutsStack';
import CalendarStack from './CalendarStack';
import ProgressStack from './ProgressStack';
import Icon from '../../src/components/Shared/Icon';
import colors from '../../src/styles/colors';
import { tabColorMap } from './utils';
import { Image } from 'react-native';
import fonts from '../../src/styles/fonts';
import ChallengeStack from './ChallengeStack';
import ChallengeSubscriptionScreen from '../../src/screens/Challenges/subscription';

const TabStack = createBottomTabNavigator(
  {
    //  Home: HomeStack,
    // Nutrition: NutritionStack,
    // Workouts: WorkoutsStack,
    // Calendar: CalendarStack,
    // Progress: ProgressStack,
    

    Dashboard: FeedStack,
    Subscription: SubscriptionStack,
    Calendar: CalendarStack,
    Progress: ProgressStack,
  },
  {
    initialRouteName: 'Dashboard',
    defaultNavigationOptions: ({ navigation }) => ({
      header: null,
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        const activeState = tabColorMap[routeName];
        const inactiveState = colors.charcoal.standard;
        let icon;
     
        if (routeName === 'Dashboard') {
          icon = (
            <Image
              source={require('../../assets/icons/fitazfk2-feed.png')}
              fadeDuration={0}
              style={{width:31, height: 22}}
            />
          );
        }
        else if (routeName === 'Subscription') {
          icon = (
            <Image
              source={require('../../assets/icons/fitazfk2-subscription.png')}
              fadeDuration={0}
              style={{width:22, height: 22}}
            />
          );
        } 
   
         else if (routeName === 'Calendar') {
          icon = (
              <Image
               source={require('../../assets/icons/fitazfk2-calendar.png')}
               fadeDuration={0}
               style={{width:22, height: 22}}
              />
          
          );
        } else if (routeName === 'Progress') {
          icon = (
              <Image
              source={require('../../assets/icons/fitazfk2-progress.png')}
                fadeDuration={0}
              style={{width:22, height: 22}}
              />
        
          );
        }
        return icon;
      },
    }),
    tabBarOptions: {
      activeTintColor: colors.themeColor.color,
      inactiveTintColor: colors.charcoal.standard,
      style: {
        // shadowColor: colors.charcoal.standard,
        // shadowOffset: { width: 0, height: -1 },
        // shadowOpacity: 0.3,
        // shadowRadius: 2,
        // borderTopWidth: 0,
        height:60,
        borderTopWidth: 1,
        borderTopColor: colors.grey.light,
        backgroundColor: colors.themeColor.footerBackgroundColor,
      },
      labelStyle: {
        fontFamily: fonts.bold,
        textTransform:"uppercase",
        paddingBottom:4
      },
    },
  },
);

export default TabStack;
