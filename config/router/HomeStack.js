import React from 'react';
import { createStackNavigator } from 'react-navigation';
import HomeScreen from '../../src/screens/AppStack/Home/HomeScreen';
import Header from '../../src/components/Header';

const HomeStack = createStackNavigator(
  {
    HomeHome: HomeScreen,
  },
  {
    initialRouteName: 'HomeHome',
    navigationOptions: ({ navigation }) => ({
      header: () => {
        const { routeName } = navigation.state;
        return (
          <Header
            navigation={navigation}
            withProfileButton={routeName === 'HomeHome'}
          />
        );
      },
    }),
  },
);

export default HomeStack;
