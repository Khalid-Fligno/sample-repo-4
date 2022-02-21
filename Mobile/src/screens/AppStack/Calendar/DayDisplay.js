import React from "react";
import { ScrollView, View, Dimensions } from "react-native";
import calendarStyles from "./calendarStyle";
import MealsList from "./MealsList";
import Progress from "./Progress";
import WorkOutCard from "./WorkoutCard";

const DayDisplay = ({
  isSwiping,
  showRC,
  phaseData,
  activeChallengeData,
  setState,
  currentChallengeDay,
  width,
  phase,
  transformLevel,
  todayRcWorkout,
  loadExercises,
  AllRecipe,
  favoriteRecipe,
  todayRecommendedRecipe,
  todayRecommendedMeal,
  goToRecipe,
  getToFilter,
}) => (
  <ScrollView
    contentContainerStyle={calendarStyles.dayDisplayContainer}
    scrollEnabled={!isSwiping}
    showsVerticalScrollIndicator={false}
  >
    {phaseData && showRC && (
      <View
        style={{
          paddingVertical: 20,
          width: Dimensions.get("window").width,
          paddingHorizontal: 20,
        }}
      >
        <Progress
          activeChallengeData={activeChallengeData}
          setState={setState}
          currentChallengeDay={currentChallengeDay}
          width={width}
          phaseData={phaseData}
          phase={phase}
          transformLevel={transformLevel}
        />
      </View>
    )}
    {todayRcWorkout && showRC && (
      <WorkOutCard
        loadExercises={loadExercises}
        currentChallengeDay={currentChallengeDay}
        activeChallengeData={activeChallengeData}
      />
    )}
    {showRC && (
      <MealsList
        AllRecipe={AllRecipe}
        favoriteRecipe={favoriteRecipe}
        todayRecommendedRecipe={todayRecommendedRecipe}
        todayRecommendedMeal={todayRecommendedMeal}
        goToRecipe={goToRecipe}
        getToFilter={getToFilter}
      />
    )}
  </ScrollView>
);

export default DayDisplay;
