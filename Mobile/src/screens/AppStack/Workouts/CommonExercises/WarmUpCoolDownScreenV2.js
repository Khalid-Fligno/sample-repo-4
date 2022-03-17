import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from "react-native";
import colors from "../../../../styles/colors";
import fonts from "../../../../styles/fonts";
import { getLastExerciseWC } from "../../../../utils/workouts";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import { Video } from "expo-av";
import VideoReact from "react-native-video";
import { FileSystem } from "react-native-unimodules";
import FadeInView from "react-native-fade-in-view";
import WorkoutTimer from "../../../../components/Workouts/WorkoutTimer";
import ExerciseInfoButtonV2 from "../../../../components/Workouts/ExerciseInfoButtonV2";
import ExerciseInfoModal from "../../../../components/Workouts/ExerciseInfoModal";
import Loader from "../../../../components/Shared/Loader";
import WorkoutProgressControl from "../../../../components/Workouts/WorkoutProgressControl";
import TextTicker from "react-native-text-ticker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { VLCPlayer, VlCPlayerView } from 'react-native-vlc-media-player';
export default class WarmUpCoolDownScreenV2 extends Component {
  constructor(props) {
    super(props);
    const { exerciseIndex } = this.props.navigation.state.params;
    this.state = {
      exerciseList: [],
      timerStart: false,
      exerciseIndex: exerciseIndex ? exerciseIndex : 1,
      type: null,
      totalDuration: null,
      totalExercise: 0,
      videoPaused: false,
      exerciseInfoModalVisible: false,
      pauseModalVisible: false,
      restart: false,
      isDisabled: false,
      videoError: false
    };
  }
  componentDidMount() {
    this.setState({ isDisabled: false });
    this.loadExercise();
  }

  componentWillUnmount() {
    this.setState({ isDisabled: true });
  }

  async loadExercise() {
    const { warmUp, workout, fitnessLevel } =
      this.props.navigation.state.params;
    const { exerciseIndex } = this.state;
    const type = warmUp ? "warmUp" : "coolDown";

    const exerciseList =
      type === "warmUp" ? workout.warmUpExercises : workout.coolDownExercises;
    this.setState({
      exerciseList: exerciseList,
      timerStart: false,
      type: type,
      totalExercise: exerciseList.length,
      totalDuration:
        exerciseList[exerciseIndex - 1] &&
        exerciseList[exerciseIndex - 1].duration
          ? exerciseList[exerciseIndex - 1].duration
          : 30,
    });
    setTimeout(() => this.setState({ timerStart: true }), 100);
  }

  goToExercise() {
    const {
      workout,
      reps,
      resistanceCategoryId,
      currentExerciseIndex,
      workoutSubCategory,
      fitnessLevel,
      extraProps,
      warmUp,
      fromCalender,
      extra,
    } = this.props.navigation.state.params;
    if (warmUp) {
      this.props.navigation.replace("Exercise", {
        workout,
        reps,
        resistanceCategoryId,
        currentExerciseIndex,
        workoutSubCategory,
        fitnessLevel,
        extraProps,
        fromCalender,
      });
    } else {
      this.props.navigation.replace("WorkoutComplete", {
        workout,
        reps,
        resistanceCategoryId,
        currentExerciseIndex,
        workoutSubCategory,
        fitnessLevel,
        extraProps,
      });
    }
  }
  handleFinish() {
    const { exerciseIndex, totalExercise, exerciseList } = this.state;
    this.setState({ timerStart: false });
    const nextExerciseIndex = this.state.exerciseIndex + 1;
    const totalDuration =
      exerciseList[nextExerciseIndex - 1] &&
      exerciseList[nextExerciseIndex - 1].duration
        ? exerciseList[nextExerciseIndex - 1].duration
        : 30;
    if (totalExercise <= exerciseIndex) {
      this.goToExercise();
    } else {
      this.setState({
        exerciseIndex: nextExerciseIndex,
        totalDuration: totalDuration,
        timerStart: false,
      });
      setTimeout(() => this.setState({ timerStart: true }), 100);
    }
  }

  showExerciseInfoModal = () => {
    this.setState({
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
    this.props.navigation.navigate("CalendarHome");
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
  restartWorkout = () => {
    this.handleExerciseReplace(this.state.exerciseIndex);
  };
  prevExercise = () => {
    this.handleExerciseReplace(this.state.exerciseIndex - 1);
  };
  skipExercise = () => {
    const { exerciseIndex, totalExercise } = this.state;
    if (totalExercise <= exerciseIndex) {
      this.goToExercise();
    } else {
      this.handleExerciseReplace(this.state.exerciseIndex + 1);
    }
  };
  handleExerciseReplace(exerciseIndex) {
    const {
      workout,
      reps,
      resistanceCategoryId,
      currentExerciseIndex,
      workoutSubCategory,
      fitnessLevel,
      extraProps,
      warmUp,
    } = this.props.navigation.state.params;
    this.props.navigation.replace("ExerciseWC", {
      workout,
      reps,
      resistanceCategoryId,
      currentExerciseIndex: currentExerciseIndex,
      exerciseIndex,
      workoutSubCategory,
      fitnessLevel,
      extraProps,
      warmUp: warmUp,
    });
  }
  handleUnpause = () => {
    this.setState({
      videoPaused: false,
      pauseModalVisible: false,
      timerStart: true,
    });
  };
  handlePause = () => {
    this.setState({
      videoPaused: true,
      timerStart: false,
      pauseModalVisible: true,
    });
  };
  handleVideoError = ()=>{
    this.setState({
      videoError:true
    })
  }

  render() {
    const {
      exerciseList,
      timerStart,
      exerciseIndex,
      type,
      totalDuration,
      videoPaused,
      exerciseInfoModalVisible,
    } = this.state;
    const { warmUp, workout } = this.props.navigation.state.params;
    const showInfoBtn =
      exerciseList.length > 0 &&
      exerciseList[exerciseIndex - 1].coachingTip &&
      exerciseList[exerciseIndex - 1].coachingTip.length > 0;
    const workoutTimer = () => {
      return (
        <WorkoutTimer
          totalDuration={Number(totalDuration)}
          start={timerStart}
          handleFinish={() => {
            this.handleFinish();
          }}
          exerciseIndex={exerciseIndex}
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
    };

    let currentExercise = exerciseList[exerciseIndex - 1];

    let lastExercise =
      exerciseList.length > 0
        ? getLastExerciseWC(exerciseList, exerciseIndex - 1, workout, 1)
        : {};
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <FadeInView duration={1000} style={styles.flexContainer}>
          <View>
            <View style={styles.header}>
              <View style={{ width: 25 }} />
              <View>
                <Text style={styles.title}>
                  {type === "warmUp" ? "Warm Up" : "Cool Down"}
                </Text>
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
            <View>
              {exerciseList.length > 0 && (
                this.state.videoError?
                // <View style={{
                //   width, height: width,
                //   justifyContent:'center'
                // }}>
                //   <Text style={{
                //     fontSize: 10, fontFamily: fonts.StyreneAWebThin,textAlign:"center"
                //   }}>
                //     YOUR DEVICE DOES NOT SUPPORT THIS VIDEO YET. PLEASE TELL US YOUR DEVICE INFO SO THAT WE'LL FIX THE ISSUE SOON.
                //   </Text>
                // </View>
                <VLCPlayer
                  style={{ width, height: width }}
                  videoAspectRatio="16:9"
                  onBuffering={()=>console.log("buffering")}
                  source={{
                    uri: `${exerciseList[exerciseIndex-1].videoUrls[0].url}`,
                  }}
                  paused={videoPaused}
                  repeat={true}
                  seek={0}
                  volume={1.0}
                  muted={false}
                  rate={1.0}
                  onError={()=>console.log(exerciseList[exerciseIndex].videoUrls[0].url)}
                />
                :
                <Video
                  source={{
                    uri: `${FileSystem.cacheDirectory}exercise-${type}-${exerciseIndex}.mp4`,
                  }}
                  rate={1.0}
                  volume={1.0}
                  isMuted={false}
                  resizeMode="cover"
                  shouldPlay={!videoPaused}
                  isLooping={true}
                  style={{ width, height: width }}
                  onError={this.handleVideoError}
                />
              )}
              {showInfoBtn && (
                <ExerciseInfoButtonV2 onPress={this.showExerciseInfoModal} />
              )}
              {/* //TODO:workout Timer */}

              {/* {exerciseList.length > 0 && (
              <View style={styles.textContainer}>
                <Text style={styles.label}>
                  {type === "warmUp" ? "Warm Up" : "Cool Down"}
                </Text>
                
              </View>
            )} */}
            </View>
          </View>

          {exerciseList.length > 0 && (
            <View style={styles.currentExerciseTextContainer}>
              {totalDuration !== null && workoutTimer()}
              <Text
                style={styles.currentExerciseTextCount}
              >{`Exercise ${exerciseIndex} of ${exerciseList.length}`}</Text>
              <View style={styles.currentExerciseNameTextContainer}>
                <TextTicker
                  style={styles.currentExerciseNameText}
                  duration={6000}
                  loop
                  bounce
                  bounceSpeed={10}
                  repeatSpacer={50}
                  marqueeDelay={1000}
                  disabled={this.state.isDisabled}
                >
                  {currentExercise.name.toUpperCase()}
                </TextTicker>
              </View>
            </View>
          )}

          {exerciseList.length > 0 && (
            <View>
              <WorkoutProgressControl
                currentExerciseIndex={exerciseIndex - 1}
                currentSet={exerciseIndex - 1}
                exerciseList={exerciseList}
                workoutReps={workout.workoutReps}
                rounds={workout.workoutReps}
                progressType={workout.workoutProcessType}
                rest={false}
                reps={1}
                currentRound={1}
                workout={workout}
                isPaused={videoPaused}
                lastExercise={lastExercise}
                onPrev={this.prevExercise}
                onRestart={this.restartWorkout}
                onNext={this.skipExercise}
                onPlayPause={
                  videoPaused ? this.handleUnpause : this.handlePause
                }
              />
            </View>
          )}

          <View />
        </FadeInView>

        {showInfoBtn && (
          <ExerciseInfoModal
            exercise={exerciseList[exerciseIndex - 1]}
            exerciseInfoModalVisible={exerciseInfoModalVisible}
            hideExerciseInfoModal={this.hideExerciseInfoModal}
          />
        )}
        <Loader
          loading={exerciseList.length === 0}
          color={colors.coral.standard}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  flexContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
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

  currentExerciseNameText: {
    fontFamily: fonts.boldNarrow,
    fontSize: 18,
    color: colors.black,
    textTransform: "uppercase",
  },

  textContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontFamily: fonts.SimplonMonoMedium,
    fontSize: wp("8%"),
    marginVertical: 15,
    marginTop: wp("10%"),
    textTransform: "uppercase",
  },
  currentExerciseTextContainer: {
    width,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  currentExerciseNameTextContainer: {
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
    alignItems: "flex-end",
    justifyContent: "center",
  },
  currentExerciseRepsText: {
    fontFamily: fonts.boldNarrow,
    fontSize: 18,
  },
});
