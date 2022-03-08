import React, { createRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
  AppState,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { Video } from "expo-av";
import FadeInView from "react-native-fade-in-view";
import CountdownPauseModal from "../../components/Workouts/CountdownPauseModal";
import WorkoutTimer from "../../components/Workouts/WorkoutTimer";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";

const { width } = Dimensions.get("window");

export const workoutTimerStyle = {
  container: {
    width,
    backgroundColor: colors.charcoal.standard,
    paddingTop: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: fonts.bold,
    fontSize: 72,
    color: colors.white,
  },
};

export default class Progress5Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      timerStart: false,
      totalDuration: 60,
      appState: AppState.currentState,
      videoPaused: false,
      pauseModalVisible: false,
    };
    this.videoRef = createRef();
  }
  componentDidMount() {
    this.props.navigation.setParams({ handleSkip: this.handlePause });
    this.startTimer();
    this.videoRef.current.playAsync();
    //AppState.addEventListener("change", this.handleAppStateChange);
    AppState.addEventListener("change", this.handleAppStateChange);
  }
  componentWillUnmount() {
    AppState.addEventListener("change", this.handleAppStateChange);
    //AppState.removeEventListener("change", this.handleAppStateChange);
  }
  handleAppStateChange = async (nextAppState) => {
    const { appState } = this.state;
    if (appState === "active" && nextAppState.match(/inactive|background/)) {
      this.handlePause();
    }
    this.setState({ appState: nextAppState });
  };
  startTimer = () => {
    this.setState({ timerStart: true });
  };
  handlePause = () => {
    if (this.video && this.video.current) this.videoRef.current.pauseAsync();
    this.setState({
      videoPaused: true,
      timerStart: false,
      pauseModalVisible: true,
    });
  };
  handleUnpause = () => {
    this.videoRef.current.playAsync();
    this.setState({
      videoPaused: false,
      timerStart: true,
      pauseModalVisible: false,
    });
  };
  handleQuitWorkout = () => {
    this.setState({ pauseModalVisible: false }, () => {
      this.props.navigation.navigate("Progress");
    });
    FileSystem.deleteAsync(`${FileSystem.cacheDirectory}exercise-burpees.mp4`, {
      idempotent: true,
    });
  };
  quitWorkout = () => {
    Alert.alert(
      "Stop burpee test?",
      "Stopping means you will lose any information you have already entered",
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
  handleFinish = () => {
    this.setState({ timerStart: false });
    const { image, weight, waist, hip, isInitial, navigateTo } =
      this.props.navigation.state.params;
    this.props.navigation.replace("Progress6", {
      image,
      weight,
      waist,
      hip,
      isInitial,
      navigateTo,
    });
  };
  render() {
    const { timerStart, totalDuration, pauseModalVisible, videoPaused } =
      this.state;
    return (
      <SafeAreaView style={styles.container}>
        <FadeInView duration={1000} style={styles.flexContainer}>
          <View>
            <Video
              ref={this.videoRef}
              source={{
                uri: `${FileSystem.cacheDirectory}exercise-burpees.mp4`,
              }}
              resizeMode="contain"
              isLooping
              isMuted
              paused={videoPaused}
              style={{ width, height: width }}
            />
            <WorkoutTimer
              totalDuration={totalDuration}
              start={timerStart}
              handleFinish={() => this.handleFinish()}
              options={workoutTimerStyle}
            />
          </View>
          <View style={styles.currentExerciseTextContainer}>
            <Text style={styles.currentExerciseNameText}>BURPEES</Text>
            <Text style={styles.currentExerciseRepsText}>MAX</Text>
          </View>
          <Text style={styles.bottomText}>REMEMBER TO COUNT YOUR BURPEES!</Text>
          <CountdownPauseModal
            isVisible={pauseModalVisible}
            handleQuit={this.quitWorkout}
            handleUnpause={this.handleUnpause}
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
  flexContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
  },
  currentExerciseTextContainer: {
    width,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
  },
  currentExerciseNameText: {
    fontFamily: fonts.boldNarrow,
    fontSize: 18,
    color: colors.black,
  },
  currentExerciseRepsText: {
    fontFamily: fonts.boldNarrow,
    fontSize: 18,
  },
  bottomText: {
    fontFamily: fonts.standard,
    fontSize: 12,
    marginTop: 10,
    marginBottom: 10,
  },
});
