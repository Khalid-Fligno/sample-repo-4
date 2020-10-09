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
var { height } = Dimensions.get("window")

const HiddenView = () => <View style={{ display: 'none' }} />
const TouchableWithoutFeedbackWrapper = ({
  onPress,
  onLongPress,
  testID,
  accessibilityLabel,
  ...props
}) => {
  return (
      <TouchableWithoutFeedback
          onPress={onPress}
          onLongPress={onLongPress}
          testID={testID}
          hitSlop={{
              left: 15,
              right: 15,
              top: 5,
              bottom: 5,
          }}
          accessibilityLabel={accessibilityLabel}
      >
          <View {...props} />
      </TouchableWithoutFeedback>
  )
}
const TabBarComponent = props => {
  return <BottomTabBar
      {...props}
      style={styles.bottomBarStyle}
      getButtonComponent={({ route }) => {
          if (route.key === "Home" )
              return HiddenView
          else return TouchableWithoutFeedbackWrapper
      }}
  />
}


const TabStack = createBottomTabNavigator(
  {

    Home: DashboardStack,
    Feed:LifestyleStack,
    LifeStyle: SubscriptionStack,
    Calendar: CalendarStack,
    Progress: ProgressStack,
    
  },
  {
    initialRouteName: 'Home',
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
        else if (routeName === 'LifeStyle' ) {
          icon = (
            <SubSVG 
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
        fontFamily: fonts.bold,
        textTransform:"uppercase",
        paddingBottom:4,
      },
      
    },
  },
);

export default TabStack;


const styles = StyleSheet.create({
  bottomBarStyle: {
      // height: (height * 10.625) / 100   //your header height (10.625 is the %)
      height: (height * 6.625) / 100   //your header height (10.625 is the %)
  }
})