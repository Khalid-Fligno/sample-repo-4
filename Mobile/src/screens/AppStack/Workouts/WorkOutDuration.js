import React from "react";
import { View, Text } from "react-native";
import { convertDuration } from "../../../utils/workouts";
import WorkoutScreenStyle from "./WorkoutScreenStyle";

const WorkOutDuration = ({
  type,
  title,
  isRest,
  exercise,
  lifestyle,
  workIntervalTimeinSec,
  restIntervalTimeinSec,
  count,
  workout,
  reps,
  workIntervalMap,
  fitnessLevel,
  restIntervalMap,
}) => {
  renderByCondition = () => {
    switch (type) {
      case "oneByOne":
        if (title !== "Workout" && !isRest) {
          return (
            <Text style={WorkoutScreenStyle.exerciseTileHeaderBarRight}>
              {exercise.duration} {"secs"}
            </Text>
          );
        } else if (title === "Workout" && !isRest) {
          return (
            <Text style={WorkoutScreenStyle.exerciseTileHeaderBarRight}>
              {workout["workoutReps"]} x {reps}
            </Text>
          );
        } else if (isRest) {
          return (
            <Text style={WorkoutScreenStyle.exerciseTileHeaderBarRight}>
              {workIntervalTimeinSec}s on/{restIntervalTimeinSec}s off
            </Text>
          );
        }
        return null;

      case "onlyOne":
        if (title !== "Workout" && !isRest) {
          return (
            <Text style={WorkoutScreenStyle.exerciseTileHeaderBarRight}>
              {exercise.duration} {"secs"}
            </Text>
          );
        } else if (
          title === "Workout" &&
          lifestyle != true &&
          exercise.duration <= 60
        ) {
          return (
            <Text style={WorkoutScreenStyle.exerciseTileHeaderBarRight}>
              {exercise.duration}s
            </Text>
          );
        } else if (
          title === "Workout" &&
          lifestyle != true &&
          exercise.duration > 60
        ) {
          return (
            <Text style={WorkoutScreenStyle.exerciseTileHeaderBarRight}>
              {convertDuration(exercise.duration)}
            </Text>
          );
        } else if (
          title === "Workout" &&
          lifestyle === true &&
          workIntervalTimeinSec <= 60
        ) {
          return (
            <Text style={WorkoutScreenStyle.exerciseTileHeaderBarRight}>
              {workIntervalTimeinSec}s
            </Text>
          );
        } else if (
          title === "Workout" &&
          lifestyle === true &&
          workIntervalTimeinSec > 60
        ) {
          <Text style={WorkoutScreenStyle.exerciseTileHeaderBarRight}>
            {workIntervalTimeinSec / 60}mins
          </Text>;
        }
        return null;

      case "circular":
        if (title !== "Workout" && !isRest) {
          return (
            <Text style={WorkoutScreenStyle.exerciseTileHeaderBarRight}>
              {exercise.duration} {"secs"}
            </Text>
          );
        } else if (title === "Workout" && !count) {
          return (
            <Text style={WorkoutScreenStyle.exerciseTileHeaderBarRight}>
              {workIntervalMap[fitnessLevel - 1]}s on/
              {restIntervalMap[fitnessLevel - 1]}s off
            </Text>
          );
        }
        return null;

      default:
        return null;
    }
  };
  return <View>{renderByCondition()}</View>;
};

export default WorkOutDuration;
