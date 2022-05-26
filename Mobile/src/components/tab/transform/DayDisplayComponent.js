import React from "react";
import {
  Dimensions,
  ScrollView,
  View,
} from "react-native";
import calendarStyles from "../../../screens/AppStack/Calendar/calendarStyle";
import { MealListComponent } from "./MealListComponent";
import { ProgressComponent } from "./ProgressComponent";
import { WorkoutCardComponent } from "./WorkoutCardComponent";

export const DayDisplayComponent = (props) => {
  const {
    phase,
    phaseData,
    showRC,
    activeChallengeData,
    currentChallengeDay,
    transformLevel,
    todayRcWorkout,
    loadExercises,
    AllRecipe,
    favoriteRecipe,
    todayRecommendedRecipe,
    todayRecommendedMeal,
    setLoading,
    navigation,
    activeChallengeUserData,
    phaseDefaultTags,
    challengeRecipe,
  } = props

  return (
    <ScrollView
      contentContainerStyle={calendarStyles.dayDisplayContainer}
      showsVerticalScrollIndicator={false}
      scrollEnabled={true}
    >
      {phaseData && showRC && (
        <View
          style={{
            paddingVertical: 20,
            width: Dimensions.get("window").width,
            paddingHorizontal: 20,
          }}
        >
          <ProgressComponent
            activeChallengeData={activeChallengeData}
            currentChallengeDay={currentChallengeDay}
            transformLevel={transformLevel}
            phaseData={phaseData}
            phase={phase}
          />
        </View>
      )}
      <WorkoutCardComponent
        todayRcWorkout={todayRcWorkout}
        showRC={showRC}
        currentChallengeDay={currentChallengeDay}
        activeChallengeData={activeChallengeData}
        loadExercises={loadExercises}
      />
      <MealListComponent
        AllRecipe={AllRecipe}
        favoriteRecipe={favoriteRecipe}
        todayRecommendedRecipe={todayRecommendedRecipe}
        todayRecommendedMeal={todayRecommendedMeal}
        setLoading={setLoading}
        navigation={navigation}
        showRC={showRC}
        activeChallengeUserData={activeChallengeUserData}
        phaseDefaultTags={phaseDefaultTags}
        challengeRecipe={challengeRecipe}
        activeChallengeData={activeChallengeData}
        currentChallengeDay={currentChallengeDay}
      />
    </ScrollView>
  );
}