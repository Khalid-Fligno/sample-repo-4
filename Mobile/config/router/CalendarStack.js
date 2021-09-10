import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import CalendarHomeScreen from "../../src/screens/AppStack/Calendar/CalendarHomeScreen";
import Header from "../../src/components/Shared/Header";
import WorkoutsSelectionScreen2 from "../../src/screens/AppStack/Workouts/WorkoutsSelectionScreen2";
// import WorkoutInfoScreen2 from "../../src/screens/AppStack/Workouts/WorkoutInfoScreen2";
import WorkoutInfoScreen2V2 from "../../src/screens/AppStack/Workouts/WorkoutInfoScreen2V2";
import {
  calendarStartButtonMap,
  calendarBackButtonMap,
  calendarProfileButtonMap,
  activeChallengeSetting,
} from "./utils";
import RecipeScreen from "../../src/screens/AppStack/Nutrition/RecipeScreen";
import RecipeStepsScreen from "../../src/screens/AppStack/Nutrition/RecipeStepsScreen";

const CalendarStack = createStackNavigator(
  {
    CalendarHome: CalendarHomeScreen,
    WorkoutsSelection: WorkoutsSelectionScreen2,
    WorkoutInfo: WorkoutInfoScreen2V2,
    Recipe: RecipeScreen,
    RecipeSteps: RecipeStepsScreen,
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
            // withStartButton={calendarStartButtonMap[routeName]}
            withBackButton={calendarBackButtonMap[routeName]}
            activeChallengeSetting={activeChallengeSetting[routeName]}
            // withHomeButton={true}
          />
        );
      },
    }),
  }
);

export default CalendarStack;
