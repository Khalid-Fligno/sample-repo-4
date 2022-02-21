import React from "react";
import { Text, View } from "react-native";
import ChallengeWorkoutCard from "../../../components/Calendar/ChallengeWorkoutCard";
import calendarStyles from "./calendarStyle";

const WorkOutCard = ({
  todayRcWorkout,
  loadExercises,
  currentChallengeDay,
  activeChallengeData,
}) => (
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
        title={activeChallengeData.displayName}
      />
    </View>
  </>
);

export default WorkOutCard;
