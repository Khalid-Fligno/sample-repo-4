import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import Header from "../../../components/Shared/Header";
import RecipeTrainer from "../../../screens/AppStack/Nutrition/RecipeTrainer";
import RecipeTrainerSteps from "../../../screens/AppStack/Nutrition/RecipeTrainerSteps";
import { FeedTabScreen } from "../../../screens/tab/feed";

const backButtonMap ={
    AllBlogs:true,
    Trainers:true,
    RecipeTrainer: true,
    RecipeTrainerSteps: true,
};

const FeedStack = createStackNavigator(
  {
    FeedScreen: FeedTabScreen.FeedScreen,
    AllBlogs: FeedTabScreen.AllBlogScreen,
    Trainers: FeedTabScreen.TrainerScreen,
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
