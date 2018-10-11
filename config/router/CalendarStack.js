import React from 'react';
import { createStackNavigator } from 'react-navigation';
import CalendarHomeScreen from '../../src/screens/AppStack/Calendar/CalendarHomeScreen';
import Header from '../../src/components/Shared/Header';

const CalendarStack = createStackNavigator(
  {
    CalendarHome: CalendarHomeScreen,
  },
  {
    initialRouteName: 'CalendarHome',
    navigationOptions: ({ navigation }) => ({
      header: () => {
        return (
          <Header
            navigation={navigation}
            stack="calendar"
            withProfileButton
            withHelpButton
          />
        );
      },
    }),
  },
);

export default CalendarStack;
