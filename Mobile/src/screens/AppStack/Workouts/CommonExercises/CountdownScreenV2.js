import React, {useState, useEffect, useCallback} from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  AppState,
  Alert,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import CountdownTimer from "../../../../components/Workouts/CountdownTimer";
import CountdownPauseModal from "../../../../components/Workouts/CountdownPauseModal";
import colors from "../../../../styles/colors";
import fonts from "../../../../styles/fonts";

const CountDownScreenV2 = ({navigation}) => {
  const workout = navigation.getParam("workout", null);
  const reps = navigation.getParam("reps", null);
  const resistanceCategoryId = navigation.getParam("resistanceCategoryId", null);
  const workoutSubCategory = navigation.getParam("workoutSubCategory", null);
  const fitnessLevel = navigation.getParam("fitnessLevel", null);
  const lifestyle = navigation.getParam("lifestyle");
  const extraProps = navigation.getParam("extraProps", {});

  const [countdownDuration, setCountdownDurtion] = useState(3);
  const [timerStart, setTimerStart] = useState(false);
  const [pauseModalVisible, setPauseModalVisible] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    let isMounted = true; // for memory leak
    const handleAppStateChange = async (nextAppState) => {
      if (appState === "active" && nextAppState.match(/inactive|background/) && isMounted) {
        handlePause();
        await Audio.setIsEnabledAsync(true);
      }
      if(isMounted) setAppState(nextAppState);
    };
    AppState.addEventListener("change", handleAppStateChange);
    return () => {
      isMounted = false;
    }
  }, []);
  
  const startTimer = () => {
    setTimerStart(true);
  }

  useEffect(() => {
    startTimer();
  }, []);

  const handlePause = () => {
    setTimerStart(false);
    setPauseModalVisible(true);
  }

  const handleUnpause = () => {
    setTimerStart(true);
    setPauseModalVisible(false);
  }

  const handleQuitWorkout = () => {
    setPauseModalVisible(false);
    navigation.navigate("WorkoutsSelection");
    FileSystem.readDirectoryAsync(`${FileSystem.cacheDirectory}`).then(
      (res) => {
        Promise.all(
          res.map(async (item, index) => {
            if (item.includes("exercise-")) {
              try {
                await FileSystem.deleteAsync(
                  `${FileSystem.cacheDirectory}${item}`,
                  {
                    idempotent: true,
                  }
                );
              } catch (err) {
                console.log(err);
              }
            }
          })
        );
      }
    );
  };

  const quitWorkout = () => {
    Alert.alert(
      "Warning",
      "Are you sure you want to quit this workout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: handleQuitWorkout(),
        },
      ],
      { cancelable: false }
    );
  };

  const finishCountdown = (test, workout, reps, resistanceCategoryId) => {
    workout["lifestyle"] = lifestyle;
    if (workout.newWorkout) {
      navigation.replace("ExerciseWC", {
        workout,
        reps,
        resistanceCategoryId,
        currentExerciseIndex: 0,
        workoutSubCategory,
        fitnessLevel,
        extraProps,
        warmUp: true,
      });
    } else {
      navigation.replace("Exercise", {
        workout,
        reps,
        resistanceCategoryId,
        currentExerciseIndex: 0,
        workoutSubCategory,
        fitnessLevel,
        extraProps,
        test,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.countdownContainer}>
        <CountdownTimer
          totalDuration={countdownDuration}
          start={timerStart}
          handleFinish={() =>
            finishCountdown("test", workout, reps, resistanceCategoryId)
          }
        />
        <Text style={styles.countdownText}>GET READY!</Text>
        <CountdownPauseModal
          isVisible={pauseModalVisible}
          handleQuit={quitWorkout}
          handleUnpause={handleUnpause}
        />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  countdownContainer: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  countdownText: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.charcoal.standard,
  },
});

export default CountDownScreenV2;
