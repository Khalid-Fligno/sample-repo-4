import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import CalendarHomeScreen from "../../../screens/AppStack/Calendar/CalendarHomeScreen";
import Header from "../../../components/Shared/Header";
import WorkoutsSelectionScreen2 from "../../../screens/AppStack/Workouts/WorkoutsSelectionScreen2";
import WorkoutInfoScreen2V2 from "../../../screens/AppStack/Workouts/WorkoutInfoScreen2V2";
import {
  calendarBackButtonMap,
  calendarProfileButtonMap,
  activeChallengeSetting,
} from "../utils";
import RecipeScreen from "../../../screens/AppStack/Nutrition/RecipeScreen";
import RecipeStepsScreen from "../../../screens/AppStack/Nutrition/RecipeStepsScreen";
import FilterRecipeScreen from "../../../screens/AppStack/Nutrition/FilterRecipe/FilterRecipeScreen";
import { TransformTabScreen } from "../../../screens/tab/transform";

const CalendarStack = createStackNavigator(
  {
    CalendarHome: TransformTabScreen.TransformScreen,
    WorkoutsSelection: WorkoutsSelectionScreen2,
    WorkoutInfo: WorkoutInfoScreen2V2,
    Recipe: RecipeScreen,
    RecipeSteps: RecipeStepsScreen,
    FilterRecipe: FilterRecipeScreen,
  },
  {
    initialRouteName: "CalendarHome",
    defaultNavigationOptions: ({ navigation }) => ({
      header: () => {
        const { routeName } = navigation.state;
        
        return (
          <Header
            navigation={navigation}
            stack="calendar"
            withProfileButton={calendarProfileButtonMap[routeName]}
            withBackButton={calendarBackButtonMap[routeName]}
            activeChallengeSetting={activeChallengeSetting[routeName]}
          />
        );
      },
    }),
  }
);

export default CalendarStack;
