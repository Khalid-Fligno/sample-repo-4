import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Dimensions,
  StatusBar,
  Alert,
  AppState,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { Video } from "expo-av";
import FadeInView from "react-native-fade-in-view";
import WorkoutTimer from "../../../../components/Workouts/WorkoutTimer";
import WorkoutPauseModal from "../../../../components/Workouts/WorkoutPauseModal";
import ExerciseInfoModal from "../../../../components/Workouts/ExerciseInfoModal";
import ExerciseInfoButton from "../../../../components/Workouts/ExerciseInfoButton";
import PauseButtonRow from "../../../../components/Workouts/PauseButtonRow";
import colors from "../../../../styles/colors";
import fonts from "../../../../styles/fonts";
import appsFlyer from "react-native-appsflyer";
import { db } from "../../../../../config/firebase";
import AsyncStorage from "@react-native-community/async-storage";
import FastImage from "react-native-fast-image";
import {
  findWorkoutType,
  getLastExercise,
  getRandomRestImages,
  showNextExerciseFlag,
} from "../../../../utils/workouts";
import { isActiveChallenge } from "../../../../utils/challenges";
import firebase from "firebase";
import moment from "moment";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { object } from "prop-types";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
const { width, height } = Dimensions.get("window");
import ExerciseInfoButtonV2 from "../../../../components/Workouts/ExerciseInfoButtonV2";
import WorkoutProgressControl from "../../../../components/Workouts/WorkoutProgressControl";
import { Platform } from "react-native";
import TextTicker from "react-native-text-ticker";

const updateWeeklyTargets = (obj, field, newTally) => {
  return Object.assign({}, obj, { [field]: newTally });
};

export default class ExercisesScreenV2 extends React.PureComponent {
  constructor(props) {
    super(props);
    const workout = props.navigation.getParam("workout", null);
    const currentExerciseIndex = props.navigation.getParam(
      "currentExerciseIndex",
      0
    );
    const currentExercise = workout["exercises"][currentExerciseIndex];
    const workoutSubCategory = props.navigation.getParam(
      "workoutSubCategory",
      null
    );
    const fitnessLevel = props.navigation.getParam("fitnessLevel", null);
    let rest = props.navigation.getParam("rest", false);
    const setCount = this.props.navigation.getParam("setCount", 1);
    let restImage = "";

    let totalDuration = 0;

    if (rest) {
      totalDuration = workout.restIntervalMap[fitnessLevel - 1];
      getRandomRestImages().then((res) => {
        this.setState({ restRandomImage: res });
      });
    } else {
      totalDuration = workout.workIntervalMap[fitnessLevel - 1];
    }
    //For count true workout Rest
    if (
      workout.count &&
      currentExercise &&
      currentExercise.name === "rest" &&
      currentExercise["restIntervalMap"]
    ) {
      totalDuration =
        currentExercise["restIntervalMap"][String(setCount)][
          String(fitnessLevel - 1)
        ];
      rest = true;
    }

    //for count false and rest varible false in workoutProcessType === 'circular workout
    if (
      workout.count === false &&
      currentExercise &&
      currentExercise.name === "rest" &&
      workout["restIntervalMap"]
    ) {
      totalDuration = workout["restIntervalMap"][String(fitnessLevel - 1)];
      rest = true;
    }

    this.state = {
      workout: workout,
      exerciseList: workout["exercises"],
      currentExercise: currentExercise,
      reps: props.navigation.getParam("reps", null),
      resistanceCategoryId: props.navigation.getParam(
        "resistanceCategoryId",
        null
      ),
      extraProps: props.navigation.getParam("extraProps", {}),
      fitnessLevel: fitnessLevel,
      workoutSubCategory: workoutSubCategory,
      currentExerciseIndex: currentExerciseIndex, // Start from 0
      timerStart: false,
      totalDuration: totalDuration,
      pauseModalVisible: false,
      videoPaused: false,
      exerciseInfoModalVisible: false,
      appState: AppState.currentState,
      rest: rest,
      setCount: setCount,
      restRandomImage: "",
    };
  }

  componentDidMount() {
    this.startTimer();

    AppState.addEventListener("change", this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);
  }

  async updateWeekly() {
    const { workout } = this.state;
    let workoutName = "none";
    if (this.state.workout.filters.includes("circuit")) {
      workoutName = "circuit";
    } else if (this.state.workout.filters.includes("interval")) {
      workoutName = "interval";
    } else if (this.state.workout.filters.includes("strength")) {
      workoutName = "strength";
    }
    if (workoutName === "none") {
      return null;
    }
    const uid = await AsyncStorage.getItem("uid");
    const userRef = db.collection("users").doc(uid);

    console.log('workoutworkout', workout['lifestyle'])

    if (workout['lifestyle']) {
      return db.runTransaction((transaction) => {
        return transaction.get(userRef).then((userDoc) => {
          const newWeeklyComplete = userDoc.data().weeklyTargets[workoutName] + 1;
          const workoutCount = userDoc.data().totalWorkoutCompleted + 1;
          const oldWeeklyTargets = userDoc.data().weeklyTargets;
          const newWeeklyTargets = updateWeeklyTargets(
            oldWeeklyTargets,
            workoutName,
            newWeeklyComplete
          );
          transaction.update(userRef, {
            weeklyTargets: newWeeklyTargets,
            totalWorkoutCompleted: workoutCount,
          });
        });
      });
    } else {
      isActiveChallenge().then((res) => {
        if (res && res.status === "Active") {
          // const userRef = db.collection("users").doc(uid);
          var challengeRef = db
            .collection("users")
            .doc(uid)
            .collection("challenges")
            .doc(res.id);
          // challengeRef.onSnapshot((doc) => {
          //   const totalIntervalCompleted =
          //     doc.data().workouts.filter(
          //       (res) => res.target === "interval"
          //     );
          //   const totalCircuitCompleted =
          //     doc.data().workouts.filter(
          //       (res) => res.target === "circuit"
          //     );
          //   const totalStrengthCompleted =
          //     doc.data().workouts.filter(
          //       (res) => res.target === "strength"
          //     );
          //   userRef.set({
          //     "totalChallengeWorkoutCompleted": totalIntervalCompleted.length + totalCircuitCompleted.length + totalStrengthCompleted.length,
          //     "challengeStrength": totalStrengthCompleted.length,
          //     "challengeCircuit": totalCircuitCompleted.length,
          //     "challengeInterval": totalIntervalCompleted.length,
          //   }, {merge: true});
          // });
          // Atomically add a new region to the "regions" array field.
          var workouts = challengeRef
            .update({
              workouts: firebase.firestore.FieldValue.arrayUnion({
                date: moment(new Date()).format("YYYY-MM-DD"),
                id: workout.id,
                name: workout.name,
                displayName: workout.displayName,
                target: workoutName,
                time: new Date().getTime(),
              }),
            })
            .then((res) => console.log("Adeed to challenge", res));
        }
      });
    }
  }

  handleAppStateChange = (nextAppState) => {
    const { appState } = this.state;
    if (appState === "active" && nextAppState.match(/inactive|background/)) {
      this.handlePause();
    }
    this.setState({ appState: nextAppState });
  };

  startTimer = () => {
    this.setState({ timerStart: true });
  };

  checkFinished(currentExerciseIndex, setCount) {
    const { workout } = this.state;
    if (workout.workoutProcessType === "onlyOne") {
      return setCount === this.state.workout.workoutReps;
    }
    return (
      currentExerciseIndex === this.state.exerciseList.length - 1 &&
      setCount === this.state.workout.workoutReps
    );
  }

  handleFinish = async (reps, resistanceCategoryId, currentExerciseIndex) => {
    console.log('diri musulod kung dili e skip')
    this.setState({ timerStart: false });
    let setCount = this.props.navigation.getParam("setCount", 1); //start from 1
    const { workout } = this.state;
    if (workout.workoutProcessType === "oneByOne") {
      console.log('if')
      if (this.checkFinished(currentExerciseIndex, setCount)) {
        // console.log("update weekly targets")
        this.updateWeekly();
        appsFlyer.trackEvent("resistance_workout_complete");
        this.workoutComplete(reps, resistanceCategoryId);
      } else if (setCount === this.state.workout.workoutReps) {
        // console.log("Go to next  exercise")
        this.goToExercise(
          1,
          reps,
          resistanceCategoryId,
          currentExerciseIndex + 1
        );
      } else {
        // console.log("Incresase count")
        if (workout.rest && !this.state.rest) {
          //for workout.rest === true
          this.goToExercise(
            setCount,
            reps,
            resistanceCategoryId,
            currentExerciseIndex,
            true
          );
        } else {
          this.goToExercise(
            setCount + 1,
            reps,
            resistanceCategoryId,
            currentExerciseIndex
          );
        }
      }
    } else if (workout.workoutProcessType === "circular") {
      console.log('else if 1')
      if (this.checkFinished(currentExerciseIndex, setCount)) {
        // console.log("finished");
        this.updateWeekly();
        appsFlyer.trackEvent("complete_hiit_circuit_workout");

        this.workoutComplete(reps, resistanceCategoryId);
      } else if (currentExerciseIndex === this.state.exerciseList.length - 1) {
        // console.log("Increase Count")
        setCount += 1; //increase count when 1st,2nd... round finished
        this.goToExercise(setCount, reps, resistanceCategoryId, 0);
      } else {
        // console.log("Go to next Exercise") //go to next exercise if round not finished
        this.goToExercise(
          setCount,
          reps,
          resistanceCategoryId,
          currentExerciseIndex + 1
        );
      }
    } else if (workout.workoutProcessType === "onlyOne") {
      console.log('else if 2')
      if (this.checkFinished(currentExerciseIndex, setCount)) {
        // console.log("Finished") //finished when all rounds are finished
        this.updateWeekly();
        appsFlyer.trackEvent("complete_hiit_workout");
        this.workoutComplete(reps, resistanceCategoryId);
      } else {
        // console.log("Go to next round")
        this.goToExercise(
          setCount + 1,
          reps,
          resistanceCategoryId,
          currentExerciseIndex
        );
      }
    }
  };

  workoutComplete(reps, resistanceCategoryId) {
    if (this.state.workout.newWorkout) {
      this.props.navigation.replace("ExerciseWC", {
        workout: this.state.workout,
        reps,
        resistanceCategoryId,
        workoutSubCategory: this.state.workoutSubCategory,
        fitnessLevel: this.state.fitnessLevel,
        extraProps: this.state.extraProps,
        warmUp: false,
      });
    } else {
      this.props.navigation.replace("WorkoutComplete", {
        workout: this.state.workout,
        reps,
        resistanceCategoryId,
        workoutSubCategory: this.state.workoutSubCategory,
        fitnessLevel: this.state.fitnessLevel,
        extraProps: this.state.extraProps,
      });
    }
  }

  goToExercise(
    setCount,
    reps,
    resistanceCategoryId,
    currentExerciseIndex,
    rest = false
  ) {
    let {
      workoutSubCategory,
      fitnessLevel,
      fromCalender,
      extraProps,
      workout,
    } = this.state;
    this.props.navigation.replace("Exercise", {
      workout: this.state.workout,
      setCount,
      reps,
      resistanceCategoryId,
      currentExerciseIndex,
      workoutSubCategory,
      fitnessLevel,
      rest,
      fromCalender,
      extraProps,
    });
  }

  restControl = (reps, resistanceCategoryId, currentExerciseIndex) => {
    const { workout, setCount } = this.state;
    // console.log("rest call")
    if (workout.workoutProcessType === "oneByOne") {
      this.handleFinish(reps, resistanceCategoryId, currentExerciseIndex);
    } else if (workout.workoutProcessType === "circular") {
      if (workout.rest === undefined)
        this.goToExercise(
          setCount,
          reps,
          resistanceCategoryId,
          currentExerciseIndex,
          true
        );
      else this.handleFinish(reps, resistanceCategoryId, currentExerciseIndex);
    } else if (workout.workoutProcessType === "onlyOne") {
      this.goToExercise(
        setCount,
        reps,
        resistanceCategoryId,
        currentExerciseIndex,
        true
      );
    }
  };

  handlePause = () => {
    this.setState({
      videoPaused: true,
      timerStart: false,
      pauseModalVisible: true,
      // isRunning:false
    });
  };

  handleUnpause = () => {
    if (this.state.workout && this.state.workout.count) {
      this.setState({
        videoPaused: false,
        pauseModalVisible: false,
        // isRunning:true,
        timerStart: true,
      });
    } else {
      this.setState({
        videoPaused: false,
        timerStart: true,
        pauseModalVisible: false,
      });
    }
  };

  handleQuitWorkout = async () => {
    this.setState({ pauseModalVisible: false });

    FileSystem.readDirectoryAsync(`${FileSystem.cacheDirectory}`).then(
      (res) => {
        Promise.all(
          res.map(async (item, index) => {
            if (item.includes("exercise-")) {
              // console.log(`${FileSystem.cacheDirectory}${item}`)
              FileSystem.deleteAsync(`${FileSystem.cacheDirectory}${item}`, {
                idempotent: true,
              }).then(() => {
                // console.log("deleted...",item)
              });
            }
          })
        );
      }
    );
    if (this.state.extraProps["fromCalender"]) {
      this.props.navigation.navigate("CalendarHome");
    } else {
      this.props.navigation.navigate("WorkoutsSelection");
    }
  };

  quitWorkout = () => {
    Alert.alert(
      "Warning",
      "Are you sure you want to quit this workout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: this.handleQuitWorkout,
        },
      ],
      { cancelable: false }
    );
  };

  restartWorkout = (exerciseList, reps, currentExerciseIndex) => {
    const setCount = this.props.navigation.getParam("setCount", 1);
    this.goToExercise(setCount, reps, null, currentExerciseIndex, false);
  };

  skipExercise = (exerciseList, reps, currentExerciseIndex) => {
    // console.log(exerciseList, reps,currentExerciseIndex)
    let setCount = this.props.navigation.getParam("setCount", 1);

    if (this.checkFinished(currentExerciseIndex, setCount)) {
      // console.log("update weekly target")
      this.updateWeekly();
      appsFlyer.trackEvent("resistance_workout_complete");
      this.workoutComplete(reps, null);
    } else {
      let { workout } = this.state;
      if (currentExerciseIndex < workout.exercises.length - 1)
        this.goToExercise(1, reps, null, currentExerciseIndex + 1, false);
      else {
        this.updateWeekly();
        appsFlyer.trackEvent("resistance_workout_complete");
        this.workoutComplete(reps, null);
      }
      // if (workout.workoutProcessType === "oneByOne") {
      //   if (currentExerciseIndex < workout.exercises.length - 1)
      //     this.goToExercise(1, reps, null, currentExerciseIndex + 1, false);
      //   else {
      //     this.goToExercise(
      //       workout.workoutReps,
      //       reps,
      //       null,
      //       currentExerciseIndex,
      //       false
      //     );
      //   }
      // } else if (workout.workoutProcessType === "circular") {
      //   if (currentExerciseIndex < workout.exercises.length - 1) {
      //     this.goToExercise(
      //       setCount,
      //       reps,
      //       null,
      //       currentExerciseIndex + 1,
      //       false
      //     );
      //   } else if (currentExerciseIndex === workout.exercises.length - 1) {
      //     this.goToExercise(setCount + 1, reps, null, 0, false);
      //   }
      // }
    }
  };

  prevExercise = (exerciseList, reps, currentExerciseIndex) => {
    // console.log(exerciseList, reps,currentExerciseIndex)
    let setCount = this.props.navigation.getParam("setCount", 1);

    let { workout } = this.state;
    if (workout.workoutProcessType === "oneByOne") {
      if (setCount > 1) {
        this.goToExercise(
          setCount - 1,
          reps,
          null,
          currentExerciseIndex,
          false
        );
      } else if (currentExerciseIndex > 0)
        this.goToExercise(1, reps, null, currentExerciseIndex - 1, false);
      else {
        this.goToExercise(
          workout.workoutReps,
          reps,
          null,
          currentExerciseIndex,
          false
        );
      }
    } else if (workout.workoutProcessType === "circular") {
      if (currentExerciseIndex > 0) {
        this.goToExercise(
          setCount,
          reps,
          null,
          currentExerciseIndex - 1,
          false
        );
      } else if (currentExerciseIndex === 0 && setCount > 1) {
        this.goToExercise(setCount - 1, reps, null, 0, false);
      }
    }
  };

  showExerciseInfoModal = () => {
    this.setState({
      videoPaused: true,
      timerStart: false,
      exerciseInfoModalVisible: true,
    });
  };

  hideExerciseInfoModal = () => {
    this.setState({
      videoPaused: false,
      timerStart: true,
      exerciseInfoModalVisible: false,
    });
  };

  setCounterView = () => {
    const setCount = this.props.navigation.getParam("setCount", 1);
    const { reps, workout, rest } = this.state;
    if (workout.count && this.repsInterval) {
      return (
        <View style={styles.invisibleView}>
          <View style={styles.setCounter}>
            <Text style={styles.setCounterText}>{`Set ${setCount} of ${
              workout.workoutReps
            } - ${this.repsInterval} ${rest ? "sec" : ""}`}</Text>
          </View>
        </View>
      );
    }
    if (this.state.workout.filters.includes("strength")) {
      return (
        <View style={styles.invisibleView}>
          <View style={styles.setCounter}>
            <Text
              style={styles.setCounterText}
            >{`Set ${setCount} of ${workout.workoutReps} - ${reps} Reps`}</Text>
          </View>
        </View>
      );
    } else if (this.state.workout.filters.includes("interval")) {
      return (
        <View style={styles.invisibleView}>
          <View style={styles.setCounter}>
            <Text style={styles.setCounterText}>
              Non Stop Until Time Runs Out
            </Text>
          </View>
        </View>
      );
    } else if (this.state.workout.filters.includes("circuit")) {
      return (
        <View style={styles.invisibleView}>
          <View style={styles.setCounter}>
            <Text style={styles.setCounterText}>
              Non Stop Until Time Runs Out
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.invisibleView}>
          <View style={styles.setCounter}>
            <Text
              style={styles.setCounterText}
            >{`Set ${setCount} of ${workout.workoutReps}`}</Text>
          </View>
        </View>
      );
    }
  };

  render() {
    const {
      currentExercise,
      currentExerciseIndex,
      exerciseList,
      timerStart,
      totalDuration,
      reps,
      pauseModalVisible,
      resistanceCategoryId,
      videoPaused,
      exerciseInfoModalVisible,
      workoutSubCategory,
      fitnessLevel,
      rest,
      workout,
      restRandomImage,
      // isRunning
    } = this.state;

    const setCount = this.props.navigation.getParam("setCount", 1);

    let handleSkip = false;
    if (workout.workoutProcessType !== "onlyOne" && !workout.count) {
      handleSkip = true;
    }

    //TODO : calculate next exercise show flag
    let showNextExercise = showNextExerciseFlag(workout, setCount, rest);

    //TODO : calculate when count true
    if (
      workout.count &&
      currentExercise &&
      currentExercise["workIntervalMap"]
    ) {
      this.repsInterval =
        currentExercise["workIntervalMap"][String(setCount)][
          String(fitnessLevel - 1)
        ];
    }
    if (
      workout.count &&
      currentExercise &&
      currentExercise.name === "rest" &&
      currentExercise["restIntervalMap"]
    ) {
      this.repsInterval =
        currentExercise["restIntervalMap"][String(setCount)][
          String(fitnessLevel - 1)
        ];
    }

    //TODO : calculate flag to show last exercise
    let lastExercise = getLastExercise(
      exerciseList,
      currentExerciseIndex,
      workout,
      setCount
    );

    let showCT =
      currentExercise.coachingTip &&
      currentExercise.coachingTip.length > 0 &&
      !currentExercise.coachingTip.includes("none")
        ? true
        : false;

    const workoutTimer = () => {
      if (!workout.count && !rest)
        return (
          <WorkoutTimer
            totalDuration={Number(totalDuration)}
            start={timerStart}
            handleFinish={() => {
              if (!rest)
                this.restControl(
                  reps,
                  resistanceCategoryId,
                  currentExerciseIndex
                );
              else
                this.handleFinish(
                  reps,
                  resistanceCategoryId,
                  currentExerciseIndex
                );
            }}
            customContainerStyle={{
              marginTop: 0,
              paddingTop: 5,
              height: 50,
              paddingBottom: 5,
              backgroundColor: colors.white,
            }}
            customTextStyle={{
              color: colors.black,
              fontFamily: fonts.bold,
            }}
          />
        );
      else if (rest)
        return (
          <WorkoutTimer
            totalDuration={totalDuration}
            start={timerStart}
            handleFinish={() => {
              if (!rest)
                this.restControl(
                  reps,
                  resistanceCategoryId,
                  currentExerciseIndex
                );
              else
                this.handleFinish(
                  reps,
                  resistanceCategoryId,
                  currentExerciseIndex
                );
            }}
            customContainerStyle={{
              marginTop: 0,
              paddingTop: 10,
              height: 75,
              paddingBottom: 10,
              backgroundColor: colors.white,
            }}
            customTextStyle={{
              color: colors.black,
              fontFamily: fonts.bold,
            }}
          />
        );
      else if (workout.count && !rest)
        return <View style={styles.containerEmptyBlackBox}></View>;
    };

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <FadeInView duration={1000} style={styles.flexContainer}>
          <View>
            <View style={styles.header}>
              <View style={{ width: 25 }} />
              <View>
                <Text style={styles.title}>Workout</Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <TouchableOpacity
                  style={styles.exitButton}
                  onPress={this.quitWorkout}
                >
                  <Icon name="close" size={25} />
                  <Text
                    style={{ fontSize: 10, fontFamily: fonts.StyreneAWebThin }}
                  >
                    Exit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {!rest && (
              <Video
                source={{
                  uri: `${FileSystem.cacheDirectory}exercise-${
                    currentExerciseIndex + 1
                  }.mp4`,
                }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay={!videoPaused}
                isLooping
                style={{
                  width,
                  height: width > height / 2 ? height / 2 : width,
                }}
              />
            )}
            {rest && (
              <FastImage
                // source={require('../../../../../assets/images/hiit-rest-placeholder.jpg')}
                source={{ uri: restRandomImage, cache: "immutable" }}
                style={{ width, height: width }}
              />
            )}
            {showCT && (
              <ExerciseInfoButtonV2 onPress={this.showExerciseInfoModal} />
            )}
            {this.setCounterView()}
          </View>

          <View style={styles.currentExerciseTextContainer}>
            {workoutTimer()}
            <Text style={styles.currentExerciseTextCount}>{`Exercise ${
              currentExerciseIndex + 1
            } of ${exerciseList.length}`}</Text>
            <View style={styles.currentExerciseNameTextContainer}>
              <TextTicker
                style={styles.currentExerciseNameText}
                duration={6000}
                loop
                bounce
                bounceSpeed={10}
                repeatSpacer={50}
                marqueeDelay={1000}
              >
                {rest ? "Rest" : currentExercise.name.toUpperCase()}
              </TextTicker>
            </View>
          </View>

          <View>
            <WorkoutProgressControl
              currentExercise={currentExercise}
              currentExerciseIndex={currentExerciseIndex}
              currentSet={setCount}
              exerciseList={exerciseList}
              workoutReps={workout.workoutReps}
              rounds={workout.workoutReps}
              progressType={workout.workoutProcessType}
              rest={rest}
              reps={reps}
              currentRound={setCount}
              workout={workout}
              isPaused={videoPaused}
              onPrev={this.prevExercise}
              lastExercise={lastExercise}
              onRestart={this.restartWorkout}
              onNext={
                handleSkip
                  ? this.skipExercise
                  : () => {
                      this.handleFinish(
                        reps,
                        resistanceCategoryId,
                        currentExerciseIndex
                      );
                    }
              }
              onPlayPause={videoPaused ? this.handleUnpause : this.handlePause}
            />
          </View>

          <View />

          <ExerciseInfoModal
            exercise={currentExercise}
            exerciseInfoModalVisible={exerciseInfoModalVisible}
            hideExerciseInfoModal={this.hideExerciseInfoModal}
          />
        </FadeInView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    width,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    borderBottomWidth: 0,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey.light,
    elevation: 1,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    zIndex: 1,
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight + 1 : 0,
  },
  exitButton: { alignSelf: "flex-end", paddingRight: 20 },
  title: {
    alignSelf: "flex-end",
    fontSize: 20,
    fontFamily: fonts.bold,
    paddingLeft: 20,
  },
  setCounter: {
    borderColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    paddingRight: 10,
    paddingLeft: 10,
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  setCounterText: {
    fontFamily: fonts.bold,
    fontSize: 17,
  },
  invisibleView: {
    height: 0,
    width,
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? 60 : 60 + StatusBar.currentHeight,
    position: "absolute",
  },
  flexContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
  },
  currentExerciseTextContainer: {
    width,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  currentExerciseNameTextContainer: {
    // width: width - 50,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  currentExerciseNameText: {
    fontFamily: fonts.bold,
    fontSize: 25,
    color: colors.black,
    textAlign: "center",
    marginLeft: 10,
    marginRight: 10,
  },
  currentExerciseTextCount: {
    fontFamily: fonts.boldNarrow,
    fontSize: 20,
    color: colors.black,
  },
  currentExerciseRepsTextContainer: {
    // width: 30,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  currentExerciseRepsText: {
    fontFamily: fonts.boldNarrow,
    fontSize: 18,
  },
  containerEmptyBlackBox: {
    width,
    height: hp("10%"),
    backgroundColor: colors.white,
    paddingVertical: height > 800 ? 25 : 15,
    alignItems: "center",
    justifyContent: "center",
  },
});
