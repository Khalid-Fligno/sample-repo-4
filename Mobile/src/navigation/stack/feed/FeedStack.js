import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import Header from "../../../components/Shared/Header";
import FeedScreen from "../../../screens/AppStack/Home/FeedScreen";
import AllBlogs from "../../../screens/AppStack/Home/blogs/AllBlogs"
import Trainers from "../../../screens/AppStack/Home/trainers/Trainers"
import RecipeTrainer from "../../../screens/AppStack/Nutrition/RecipeTrainer";
import RecipeTrainerSteps from "../../../screens/AppStack/Nutrition/RecipeTrainerSteps";

const backButtonMap ={
    AllBlogs:true,
    Trainers:true,
    RecipeTrainer: true,
    RecipeTrainerSteps: true,
};

const FeedStack = createStackNavigator(
  {
    FeedScreen: FeedScreen,
    AllBlogs: AllBlogs,
    Trainers: Trainers,
    RecipeTrainer: RecipeTrainer,
    RecipeTrainerSteps: RecipeTrainerSteps

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
            withBackButton={backButtonMap[routeName]}
          />
        );
      },
    }),
  }
);

export default FeedStack;
