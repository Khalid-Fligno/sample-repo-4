import React, { useState, useEffect } from "react";
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
  onRestart,
  fitnessLevel,
  lastExercise,
}) => {
  const [willGoBack, setWillGoBack] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setWillGoBack(false);
    }, 3000);
  });

  useEffect(() => {
    if (willGoBack) {
      setTimeout(() => {
        setWillGoBack(false);
      }, 3000);
    }
  }, [willGoBack]);

  const handleOnPrevPressed = (exerciseList, reps, currentExerciseIndex) => {
    if (willGoBack) {
      onPrev(exerciseList, reps, currentExerciseIndex);
    } else {
      onRestart(exerciseList, reps, currentExerciseIndex);
    }
  };

  let array = exerciseList;
  if (progressType === "onlyOne") {
    array = new Array(rounds).fill(undefined).map((val, idx) => idx);
  }

  console.log("ExerciseList: ", exerciseList[currentExerciseIndex]);
  console.log("Current Index: ", currentExerciseIndex);
  console.log("Workout reps: ", workoutReps);
  console.log("Workout process type: ", workout.workoutProcessType);
  console.log("Last exercise: ", lastExercise);

  const nextExerciseText = () => {
    if (exerciseList && currentExerciseIndex < exerciseList.length - 1) {
      return (
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.buttonTextInfo}
        >
          {exerciseList[currentExerciseIndex + 1].displayName}
        </Text>
      );
    } else if (workout.workoutProcessType !== "onlyOne") {
      if (
        lastExercise.nextExerciseName &&
        lastExercise.nextExerciseName !== ""
      ) {
        return (
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.buttonTextInfo}
          >
            {lastExercise.nextExerciseName}
          </Text>
        );
      } else {
        return <Text style={styles.buttonTextInfo}>-</Text>;
      }
    } else {
      return <Text style={styles.buttonTextInfo}>NEARLY DONE!</Text>;
    }
  };

  const prevExerciseText = () => {
    if (currentSet > 1) {
      return (
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.buttonTextInfo}
        >
          {exerciseList[currentExerciseIndex].displayName}
        </Text>
      );
    } else if (currentExerciseIndex > 0) {
      return (
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.buttonTextInfo}
        >
          {willGoBack
            ? exerciseList[currentExerciseIndex - 1].displayName
            : exerciseList[currentExerciseIndex].displayName}
        </Text>
      );
    } else {
      return (
        <Text style={styles.buttonTextInfo}>
          {willGoBack ? "-" : exerciseList[currentExerciseIndex].displayName}
        </Text>
      );
    }
  };

  const isPrevButtonDisabled = () => {
    if (currentSet > 1) {
      return false;
    }
    return willGoBack ? currentExerciseIndex == 0 : false;
  };

  return (
    <View style={styles.container}>
      <View />
      <TouchableOpacity
        disabled={isPrevButtonDisabled()}
        style={styles.button}
        onPress={() =>
          handleOnPrevPressed(
            exerciseList,
            fitnessLevel || reps,
            currentExerciseIndex
          )
        }
      >
        <Icon
          name={"skip-previous"}
          size={50}
          color={!isPrevButtonDisabled() ? colors.black : colors.smoke}
        />
        <Text style={styles.buttonTextTitle}>Previous Set</Text>
        {prevExerciseText()}
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
        disabled={false}
      >
        <Icon
          name={"skip-next"}
          size={50}
          color={true ? colors.black : colors.smoke}
        />
        <Text style={styles.buttonTextTitle}>Next Set</Text>
        {nextExerciseText()}
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
