import React from 'react';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import SubscriptionStack from './SubscriptionStack';
import CalendarStack from './CalendarStack';
import ProgressStack from './ProgressStack';
import Icon from '../../src/components/Shared/Icon';
import colors from '../../src/styles/colors';
import { tabColorMap } from './utils';
import { Image, Text ,TouchableWithoutFeedback, StyleSheet, Dimensions, View} from 'react-native';
import fonts from '../../src/styles/fonts';
import DashboardStack from './DashboardStack';
import LifestyleStack from './LifestyleStack';
import FeedSvg from '../../assets/icons/Feed';
import CalenderSvg from '../../assets/icons/calender';
import SubSVG from '../../assets/icons/subscriptionSVG';
import ProgressSvg from '../../assets/icons/progress';
import TabBarComponent from '../../src/components/Shared/TabBarComponent';
import ChallengeSvg from '../../assets/icons/challengeSvg';


const TabStack = createBottomTabNavigator(
  {

    // Dashboard: DashboardStack,
    Feed:LifestyleStack,
    Lifestyle: DashboardStack,
    Challenges: SubscriptionStack,
    Calendar: CalendarStack,
    Progress: ProgressStack,
    
  },
  {
    initialRouteName: 'Lifestyle',
    tabBarComponent: (props) => (<TabBarComponent  {...props} />), //remember to import it,
    defaultNavigationOptions: ({ navigation }) => ({
      header: null,
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        const activeState = colors.themeColor.color;
        const inactiveState = colors.themeColor.color;
        // const inactiveState = colors.charcoal.standard;
        let icon;
        if (routeName === 'Home') {
          icon = (
            <Icon
              name={ 'home-outline'}
              size={22}
              color={focused ? activeState : inactiveState}
            />
          );
        } 
        if ( routeName === 'Feed') {
          icon = (
            <FeedSvg 
                width = {22}
                height = {22}
                fill ={focused ? activeState : inactiveState}
            />
          );
        }
        else if (routeName === 'Lifestyle' ) {
          icon = (
            <SubSVG 
                width = {22}
                height = {22}
                fill ={focused ? activeState : inactiveState}
            />
          );
        } 
        else if (routeName === 'Challenges' ) {
          icon = (
            <ChallengeSvg 
                width = {22}
                height = {22}
                fill ={focused ? activeState : inactiveState}
            />
          );
        } 
   
         else if (routeName === 'Calendar') {
          icon = (
              <CalenderSvg 
                  width = {22}
                  height = {22}
                  fill ={focused ? activeState : inactiveState} 
              />
          
          );
        } else if (routeName === 'Progress') {
          icon = (
              <ProgressSvg
                  width = {22}
                  height = {22}
                  fill ={focused ? activeState : inactiveState} 
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
        fontFamily: fonts.GothamMedium,
        textTransform:"uppercase",
        paddingBottom:4,
        fontSize:10
      },
      
    },
  },
);

export default TabStack;


