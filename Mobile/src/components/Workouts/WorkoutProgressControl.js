import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { TouchableOpacity } from "react-native-gesture-handler";

export default WorkoutProgressControl = ({
  currentSet,
  exerciseList,
  workoutReps,
  progressType,
  rounds,
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
    const timer = setTimeout(() => {
      setWillGoBack(false);
    }, 3000);

    return () => clearTimeout(timer);
  });

  useEffect(() => {
    if (willGoBack) {
      const timer = setTimeout(() => {
        setWillGoBack(false);
      }, 3000);

      return () => clearTimeout(timer);
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
    if (
      currentSet > 1 &&
      exerciseList[currentExerciseIndex].type === "warmUp"
    ) {
      return (
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.buttonTextInfo}
        >
          {willGoBack
            ? exerciseList[currentExerciseIndex].displayName
            : exerciseList[currentExerciseIndex - 1].displayName}
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
            ? exerciseList[currentExerciseIndex].displayName
            : exerciseList[currentExerciseIndex - 1].displayName}
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
        {workout.workoutProcessType != "circular" &&
          exerciseList[currentExerciseIndex].type === "warmUp" && (
            <Text style={styles.buttonTextTitle}>Previous Exercise</Text>
          )}

        {workout.workoutProcessType != "circular" &&
          exerciseList[currentExerciseIndex].type != "warmUp" &&
          exerciseList[currentExerciseIndex].type != "coolDown" && (
            <Text style={styles.buttonTextTitle}>Previous Set</Text>
          )}
        {workout.workoutProcessType === "circular" && (
          <Text style={styles.buttonTextTitle}>Previous Exercise</Text>
        )}
        {workout.workoutProcessType != "circular" &&
          exerciseList[currentExerciseIndex].type === "coolDown" && (
            <Text style={styles.buttonTextTitle}>Previous Exercise</Text>
          )}

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
        {workout.workoutProcessType != "circular" &&
          exerciseList[currentExerciseIndex].type === "warmUp" && (
            <Text style={styles.buttonTextTitle}>Next Exercise</Text>
          )}

        {workout.workoutProcessType != "circular" &&
          exerciseList[currentExerciseIndex].type === "coolDown" && (
            <Text style={styles.buttonTextTitle}>Next Exercise</Text>
          )}

        {workout.workoutProcessType != "circular" &&
          exerciseList[currentExerciseIndex].type != "warmUp" &&
          currentSet != workoutReps &&
          exerciseList[currentExerciseIndex].type != "coolDown" && (
            <Text style={styles.buttonTextTitle}>Next Set</Text>
          )}

        {workout.workoutProcessType != "circular" &&
          exerciseList[currentExerciseIndex].type != "warmUp" &&
          currentSet === workoutReps &&
          exerciseList[currentExerciseIndex].type != "coolDown" && (
            <Text style={styles.buttonTextTitle}>Next Exercise</Text>
          )}

        {workout.workoutProcessType === "circular" && (
          <Text style={styles.buttonTextTitle}>Next Exercise</Text>
        )}

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
