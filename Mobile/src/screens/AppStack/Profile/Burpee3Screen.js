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
// import Video from "react-native-video";
import FadeInView from "react-native-fade-in-view";
import CountdownPauseModal from "../../../components/Workouts/CountdownPauseModal";
import WorkoutTimer from "../../../components/Workouts/WorkoutTimer";
import colors from "../../../styles/colors";
import fonts from "../../../styles/fonts";
import { Video, AVPlaybackStatus } from "expo-av";
import { useRef } from "react";

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
    this.video = createRef();
  }
  componentDidMount() {
    this.props.navigation.setParams({ handleCancel: this.handlePause });
    this.startTimer();
    AppState.addEventListener("change", this.handleAppStateChange);
  }
  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);
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
    this.video.current.playAsync();
    // setTimeout(() => this.setState({ videoPaused: false }), 1500);
  };
  handlePause = () => {
    this.video.current.pauseAsync();
    this.setState({
      videoPaused: true,
      timerStart: false,
      pauseModalVisible: true,
    });
  };
  handleUnpause = () => {
    this.video.current.playAsync();
    this.setState({
      videoPaused: false,
      timerStart: true,
      pauseModalVisible: false,
    });
  };
  handleQuitWorkout = () => {
    this.setState({ pauseModalVisible: false }, () => {
      if (this.props.navigation.getParam("fromScreen")) {
        const screen = this.props.navigation.getParam("fromScreen");
        const params = this.props.navigation.getParam("screenReturnParams");
        this.props.navigation.navigate(screen, params);
        return;
      }
      this.props.navigation.navigate("Home");
    });
    FileSystem.deleteAsync(`${FileSystem.cacheDirectory}exercise-burpees.mp4`, {
      idempotent: true,
    });
  };
  quitWorkout = () => {
    Alert.alert(
      "Stop burpee test?",
      "",
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
    const { image, weight, waist, hip } = this.props.navigation.state.params;
    if (this.props.navigation.getParam("fromScreen")) {
      const screen = this.props.navigation.getParam("fromScreen");
      const params = this.props.navigation.getParam("screenReturnParams");
      this.props.navigation.replace("Burpee4", {
        image,
        weight,
        waist,
        hip,
        fromScreen: screen,
        screenReturnParams: params,
      });
      return;
    }
    this.props.navigation.replace("Burpee4", {
      image,
      weight,
      waist,
      hip,
    });
  };
  render() {
    const { timerStart, totalDuration, pauseModalVisible, videoPaused } =
      this.state;
    return (
      <SafeAreaView style={styles.container}>
        <FadeInView duration={1000} style={styles.flexContainer}>
          <View>
            <View>
              <Video
                ref={this.video}
                source={{
                  uri: `${FileSystem.cacheDirectory}exercise-burpees.mp4`,
                }}
                resizeMode="contain"
                isLooping
                isMuted
                style={{ width, height: width }}
              />
            </View>
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
