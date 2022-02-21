import React from "react";
import ChallengeWorkoutCard from "../../../components/Calendar/ChallengeWorkoutCard";

const WorkOutCard = ({
  showRC,
  todayRcWorkout,
  loadExercises,
  currentChallengeDay,
  activeChallengeData,
}) => {
  todayRcWorkout && showRC && (
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
};

export default WorkOutCard;
