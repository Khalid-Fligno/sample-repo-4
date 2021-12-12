import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import Header from "../../src/components/Shared/Header";
import FeedScreen from "../../src/screens/AppStack/Home/FeedScreen";
import AllBlogs from "../../src/screens/AppStack/Home/blogs/AllBlogs"

const FeedStack = createStackNavigator(
  {
    FeedScreen: FeedScreen,
    AllBlogs: AllBlogs,
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
