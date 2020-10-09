import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import CalendarHomeScreen from '../../src/screens/AppStack/Calendar/CalendarHomeScreen';
import Header from '../../src/components/Shared/Header';

const CalendarStack = createStackNavigator(
  {
    CalendarHome: CalendarHomeScreen,
  },
  {
    initialRouteName: 'CalendarHome',
    defaultNavigationOptions: ({ navigation }) => ({
      header: () => {
        const { routeName } = navigation.state;
        return (
          <Header
            navigation={navigation}
            stack="calendar"
            withProfileButton={routeName === 'CalendarHome'}
            withHomeButton={true}
          />
        );
      },
    }),
  },
);

export default CalendarStack;
