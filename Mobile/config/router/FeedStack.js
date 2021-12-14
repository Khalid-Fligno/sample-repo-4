import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import Header from "../../src/components/Shared/Header";
import FeedScreen from "../../src/screens/AppStack/Home/FeedScreen";
import AllBlogs from "../../src/screens/AppStack/Home/blogs/AllBlogs"
import Trainers from "../../src/screens/AppStack/Home/trainers/Trainers"


const FeedStack = createStackNavigator(
  {
    FeedScreen: FeedScreen,
    AllBlogs: AllBlogs,
    Trainers: Trainers,
  },
  {
    initialRouteName: "FeedScreen",
    defaultNavigationOptions: ({ navigation }) => ({
      header: () => {
        const { routeName } = navigation.state;
        return (
          <Header
            stack="home"
            navigation={navigation}
            withProfileButton={routeName === "FeedScreen"}
            withBackButton={routeName === "AllBlogs"}
            // withHomeButton={true}
          />
        );
      },
    }),
  }
);

export default FeedStack;
