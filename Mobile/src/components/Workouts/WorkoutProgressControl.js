import React from "react";
import { View, StyleSheet, Text } from "react-native";
import PropTypes, { number } from "prop-types";
import { PieChart } from "react-native-svg-charts";
import Icon from "../Shared/Icon";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";

export default WorkoutProgressControl = ({
  currentExercise,
  currentSet,
  exerciseList,
  workoutReps,
  progressType,
  rounds,
  currentRound,
  rest,
}) => {
  let array = exerciseList;
  if (progressType === "onlyOne") {
    array = new Array(rounds).fill(undefined).map((val, idx) => idx);
  }
};
