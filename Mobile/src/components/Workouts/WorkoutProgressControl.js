import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import PropTypes, { number } from "prop-types";
import { PieChart } from "react-native-svg-charts";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { TouchableOpacity } from "react-native-gesture-handler";

export default WorkoutProgressControl = ({
  currentExercise,
  currentSet,
  exerciseList,
  workoutReps,
  progressType,
  rounds,
  currentRound,
  rest,
  workout,
  reps,
  currentExerciseIndex,
  isPaused,
  onPlayPause,
  onPrev,
  onNext,
  fitnessLevel,
}) => {
  let array = exerciseList;
  if (progressType === "onlyOne") {
    array = new Array(rounds).fill(undefined).map((val, idx) => idx);
  }

  console.log("ExerciseList: ", exerciseList[currentExerciseIndex]);
  console.log("Current Index: ", currentExerciseIndex);
  console.log("Workout reps: ", workoutReps);

  return (
    <View style={styles.container}>
      <View />
      <TouchableOpacity
        disabled={currentExerciseIndex == 0}
        style={styles.button}
        onPress={() =>
          onPrev(exerciseList, fitnessLevel || reps, currentExerciseIndex)
        }
      >
        <Icon
          name={"skip-previous"}
          size={50}
          color={currentExerciseIndex > 0 ? colors.black : colors.smoke}
        />
        <Text style={styles.buttonTextTitle}>Previous Exercise</Text>
        {currentExerciseIndex > 0 ? (
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.buttonTextInfo}
          >
            {exerciseList[currentExerciseIndex - 1].name}
          </Text>
        ) : (
          <Text style={styles.buttonTextInfo}>-</Text>
        )}
      </TouchableOpacity>
      <View style={{ width: "5%" }} />
      <TouchableOpacity onPress={onPlayPause}>
        {isPaused ? (
          <Icon name={"play-circle"} size={80} />
        ) : (
          <Icon name={"pause-circle"} size={80} />
        )}
      </TouchableOpacity>
      <View style={{ width: "5%" }} />
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          onNext(exerciseList, fitnessLevel || reps, currentExerciseIndex)
        }
        disabled={
          !exerciseList || currentExerciseIndex >= exerciseList.length - 1
        }
      >
        <Icon
          name={"skip-next"}
          size={50}
          color={
            exerciseList && currentExerciseIndex < exerciseList.length - 1
              ? colors.black
              : colors.smoke
          }
        />
        <Text style={styles.buttonTextTitle}>Next Exercise</Text>
        {exerciseList && currentExerciseIndex < exerciseList.length - 1 ? (
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.buttonTextInfo}
          >
            {exerciseList[currentExerciseIndex + 1].name}
          </Text>
        ) : (
          <Text style={styles.buttonTextInfo}>-</Text>
        )}
      </TouchableOpacity>
      <View />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  button: {
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTextTitle: {
    fontFamily: fonts.bold,
    fontSize: 9,
  },
  buttonTextInfo: {
    fontFamily: fonts.boldNarrow,
    fontSize: 8,
  },
});
