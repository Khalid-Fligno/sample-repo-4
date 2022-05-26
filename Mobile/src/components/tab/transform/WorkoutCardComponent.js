import React, { useState } from "react";
import {
  Text,
  View
} from "react-native";
import calendarStyles from "../../../screens/AppStack/Calendar/calendarStyle";
import ChallengeWorkoutCard from "../../Calendar/ChallengeWorkoutCard";

export const WorkoutCardComponent = (
  props
) => {
  const {
    todayRcWorkout,
    showRC,
    currentChallengeDay,
    activeChallengeData,
    loadExercises
  } = props

  return todayRcWorkout && showRC ? (
    <>
      <Text style={calendarStyles.headerText}>Today's Workout</Text>
      <View style={calendarStyles.listContainer}>
        <ChallengeWorkoutCard
          onPress={() =>
            todayRcWorkout.name && todayRcWorkout.name !== "rest"
              ? loadExercises(todayRcWorkout, currentChallengeDay)
              : ""
          }
          res={todayRcWorkout}
          currentDay={currentChallengeDay}
          title={activeChallengeData?.displayName}
        />
      </View>
    </>
  ) : showRC ? (
    <>
      <Text style={calendarStyles.headerText}>Today's Workout</Text>
      <View style={calendarStyles.listContainer}>
        <ChallengeWorkoutCard
          onPress={() => null}
          res={""}
          currentDay={currentChallengeDay}
          title={activeChallengeData?.displayName}
        />
      </View>
    </>
  ) : null;
}