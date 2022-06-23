import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import Header from "../../src/components/Shared/Header";
import { FeedScreen } from "../../src/screens/AppStack/Home/FeedScreen";
import { AllBlogs } from "../../src/screens/AppStack/Home/blogs/AllBlogs";
import { Trainers } from "../../src/screens/AppStack/Home/trainers/Trainers"
import RecipeTrainer from "../../src/screens/AppStack/Nutrition/RecipeTrainer";
import RecipeTrainerSteps from "../../src/screens/AppStack/Nutrition/RecipeTrainerSteps";
const backButtonMap ={
    AllBlogs:true,
    Trainers:true,
    RecipeTrainer: true,
    RecipeTrainerSteps: true,
};

const FeedStack = createStackNavigator(
  {
    FeedScreen: TabScreen.FeedScreen,
    AllBlogs: AllBlogScreen,
    Trainers: TrainerScreen,
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