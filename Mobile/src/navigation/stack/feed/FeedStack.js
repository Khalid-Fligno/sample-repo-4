import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import Header from "../../../components/Shared/Header";
import RecipeTrainer from "../../../screens/AppStack/Nutrition/RecipeTrainer";
import RecipeTrainerSteps from "../../../screens/AppStack/Nutrition/RecipeTrainerSteps";
import { AllBlogScreen } from "../../../screens/blogs/AllBlogScreen";
import { TabScreen } from "../../../screens/tab/index";
import { TrainerScreen } from "../../../screens/trainers/TrainerScreen";


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