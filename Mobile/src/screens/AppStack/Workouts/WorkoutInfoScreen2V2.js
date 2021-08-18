import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
  Linking,
  Image,
  FlatList,
  Platform,
  UIManager,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import * as FileSystem from "expo-file-system";
import DateTimePicker from "@react-native-community/datetimepicker";
import Video from "react-native-video";
import Modal from "react-native-modal";
import Carousel from "react-native-carousel";
import { DotIndicator } from "react-native-indicators";
import { db } from "../../../../config/firebase";
import Loader from "../../../components/Shared/Loader";
import Icon from "../../../components/Shared/Icon";
import AddToCalendarButton from "../../../components/Shared/AddToCalendarButton";
import {
  findFocus,
  findLocation,
  findFocusIcon,
  findWorkoutType,
} from "../../../utils/workouts";
import colors from "../../../styles/colors";
// import fonts from '../../../styles/fonts';
import globalStyle from "../../../styles/globalStyles";
import WorkoutScreenStyle from "./WorkoutScreenStyle";
import TimeSvg from "../../../../assets/icons/time";
import CustomBtn from "../../../components/Shared/CustomBtn";
import fonts from "../../../styles/fonts";
import NutritionStyles from "../Nutrition/NutritionStyles";
import { StackActions } from "react-navigation";

const moment = require("moment");

const { width } = Dimensions.get("window");

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default class WorkoutInfoScreen2V2 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      workout: undefined,
      reps: undefined,
      workoutSubCategory: undefined,
      fitnessLevel: undefined,
      extraProps: undefined,
      chosenDate: new Date(),
      calendarModalVisible: false,
      addingToCalendar: false,
      musicModalVisible: false,
      appleMusicAvailable: undefined,
      spotifyAvailable: undefined,
      userChallengesList: [],
      notificationBanner: false,
    };
  }

  onFocusFunction() {
    this.setState({ loading: true });
    this.setState({
      workout: this.props.navigation.getParam("workout", null),
      reps: this.props.navigation.getParam("reps", null),
      workoutSubCategory: this.props.navigation.getParam("workoutSubCategory"),
      fitnessLevel: this.props.navigation.getParam("fitnessLevel", null),
      extraProps: this.props.navigation.getParam("extraProps", {}),
      loading: false,
    });
  }

  fetchProfile = async () => {
    const uid = await AsyncStorage.getItem("uid");
    try {
      this.unsubscribeUserChallenges = db
        .collection("users")
        .doc(uid)
        .collection("challenges")
        .onSnapshot(async (querySnapshot) => {
          const userChallengesList = [];
          await querySnapshot.forEach(async (doc) => {
            await userChallengesList.push(await doc.data());
          });
          this.setState({ userChallengesList });
          this.fetchChallenges();
        });
    } catch (err) {
      Alert.alert("Something went wrong");
    }
  };

  fetchChallenges = async () => {
    let { userChallengesList } = this.state;
    this.unsubscribeChallenges = await db
      .collection("challenges")
      .onSnapshot(async (querySnapshot) => {
        const challengesList = [];
        await querySnapshot.forEach(async (doc) => {
          const check = userChallengesList.findIndex((challenge) => {
            return doc.id === challenge.id;
          });
          if (check === -1) await challengesList.push(await doc.data());
        });
        this.setState({ challengesList });
      });
  };

  setDate = async (event, selectedDate) => {
    if (selectedDate && Platform.OS === "android") {
      this.setState({ loading: true });
      this.addWorkoutToCalendar(selectedDate);
    }
    if (selectedDate && Platform.OS === "ios") {
      const currentDate = selectedDate;
      this.setState({ chosenDate: currentDate });
    }
  };

  handleStart = () => {
    // this.toggleMusicModal();
    this.handleWorkoutStart();
  };

  openApp = (url) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Cannot open this app");
        }
      })
      .catch((err) => Alert.alert("An error occurred", err));
  };

  showCalendarModal = () => {
    this.setState({ calendarModalVisible: true });
  };

  hideCalendarModal = () => {
    this.setState({ calendarModalVisible: false, loading: false });
  };

  addWorkoutToCalendar = async (date) => {
    if (this.state.addingToCalendar) {
      return;
    }
    this.setState({ addingToCalendar: true });
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const { workoutSubCategory } = this.state;
    const uid = await AsyncStorage.getItem("uid");
    const calendarRef = db
      .collection("users")
      .doc(uid)
      .collection("calendarEntries")
      .doc(formattedDate);
    let workout = Object.assign({}, this.state.workout, { workoutSubCategory });
    const data = {
      workout,
    };
    await calendarRef.set(data, { merge: true });

    if (Platform.OS === "android") {
      this.hideCalendarModal();
      Alert.alert("", "Added to calendar!", [{ text: "OK", style: "cancel" }], {
        cancelable: false,
      });
    } else {
      this.setState({ addingToCalendar: false });
      Alert.alert(
        "",
        "Added to calendar!",
        [{ text: "OK", onPress: this.hideCalendarModal, style: "cancel" }],
        { cancelable: false }
      );
    }
  };

  handleWorkoutStart = () => {
    const { workout, reps, extraProps } = this.state;
    this.setState({ musicModalVisible: false });
    // this.props.navigation.navigate('Countdown', { exerciseList: workout.exercises, reps, resistanceCategoryId: workout.resistanceCategoryId });
    this.props.navigation.navigate("Countdown", {
      workout: workout,
      reps,
      resistanceCategoryId: workout.id,
      workoutSubCategory: this.state.workoutSubCategory,
      fitnessLevel: this.state.fitnessLevel,
      extraProps,
    });
  };

  keyExtractor = (exercise, index) => String(index);

  componentDidMount = async () => {
    this.fetchProfile();
    this.setState({ loading: true });
    // this.focusListener = this.props.navigation.addListener('willFocus', () => {
    //   console.log("will focued call")
    //   this.onFocusFunction()
    // })
    this.onFocusFunction();
    await this.props.navigation.setParams({
      handleStart: () => this.handleStart(),
    });
    this.checkMusicAppAvailability();
  };

  componentWillUnmount = async () => {
    console.log("unmount");
    // this.focusListener.remove()
  };

  renderItem = ({ item: exercise, index }) => {
    let showRR =
      exercise.recommendedResistance &&
      !exercise.recommendedResistance.includes("N/A")
        ? true
        : false;
    let showCT =
      exercise.coachingTip &&
      exercise.coachingTip.length > 0 &&
      !exercise.coachingTip.includes("none")
        ? true
        : false;
    const workIntervalTimeinSec =
      this.state.workout.workIntervalMap[this.state.fitnessLevel - 1];
    const restIntervalTimeinSec =
      this.state.workout.restIntervalMap[this.state.fitnessLevel - 1];
    return (
      <View style={WorkoutScreenStyle.carouselContainer}>
        <Carousel
          key={exercise.id}
          width={width}
          inactiveIndicatorColor={colors.themeColor.color}
          indicatorColor={colors.themeColor.color}
          indicatorOffset={Platform.OS === "ios" ? -3 : -10}
          indicatorSize={10}
          inactiveIndicatorText="○"
          indicatorText="●"
          animate={false}
          hideIndicators={showCT ? false : true}
        >
          <View key={exercise.id} style={WorkoutScreenStyle.exerciseTile}>
            <View style={WorkoutScreenStyle.exerciseTileHeaderBar}>
              <View>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={WorkoutScreenStyle.exerciseTileHeaderTextLeft}
                >
                  {index + 1}. {exercise.name.toUpperCase()}
                </Text>
              </View>
              <View>
                {this.state.workout.workoutProcessType === "oneByOne" &&
                  !this.state.workout.rest && (
                    <Text style={WorkoutScreenStyle.exerciseTileHeaderBarRight}>
                      {this.state.workout["workoutReps"]} x {this.state.reps}
                    </Text>
                  )}
                {this.state.workout.workoutProcessType === "oneByOne" &&
                  this.state.workout.rest && (
                    <Text style={WorkoutScreenStyle.exerciseTileHeaderBarRight}>
                      {workIntervalTimeinSec}s on/{restIntervalTimeinSec}s off
                    </Text>
                  )}
                {this.state.workout.workoutProcessType === "onlyOne" &&
                  workIntervalTimeinSec <= 60 && (
                    <Text style={WorkoutScreenStyle.exerciseTileHeaderBarRight}>
                      {workIntervalTimeinSec}s
                      {restIntervalTimeinSec > 0 &&
                        `/${restIntervalTimeinSec}s off`}
                    </Text>
                  )}
                {this.state.workout.workoutProcessType === "onlyOne" &&
                  workIntervalTimeinSec > 60 && (
                    <Text style={WorkoutScreenStyle.exerciseTileHeaderBarRight}>
                      {workIntervalTimeinSec / 60}m on
                      {restIntervalTimeinSec > 0 &&
                        `/${restIntervalTimeinSec / 60}m off`}
                    </Text>
                  )}
                {this.state.workout.workoutProcessType === "circular" &&
                  !this.state.workout.count && (
                    <Text style={WorkoutScreenStyle.exerciseTileHeaderBarRight}>
                      {
                        this.state.workout.workIntervalMap[
                          this.state.fitnessLevel - 1
                        ]
                      }
                      s on/
                      {
                        this.state.workout.restIntervalMap[
                          this.state.fitnessLevel - 1
                        ]
                      }
                      s off
                    </Text>
                  )}
              </View>
            </View>
            <Video
              key={exercise.name.toUpperCase()}
              ref={(ref) => (this.videoRef = ref)}
              source={{
                uri: `${FileSystem.cacheDirectory}exercise-${index + 1}.mp4`,
              }}
              playWhenInactive
              resizeMode="contain"
              repeat
              muted
              selectedAudioTrack={{
                type: "disabled",
              }}
              style={{ width: width - 30, height: width - 30 }}
            />
          </View>

          {showCT && (
            <View style={WorkoutScreenStyle.exerciseDescriptionContainer}>
              <View style={WorkoutScreenStyle.exerciseTileHeaderBar}>
                <View>
                  <Text style={WorkoutScreenStyle.exerciseTileHeaderTextLeft}>
                    ADDITIONAL INFORMATION
                  </Text>
                </View>
              </View>
              <View style={WorkoutScreenStyle.exerciseDescriptionTextContainer}>
                {showRR && (
                  <Text style={WorkoutScreenStyle.exerciseDescriptionHeader}>
                    Recommended Resistance:
                  </Text>
                )}
                {showRR && (
                  <Text style={WorkoutScreenStyle.exerciseDescriptionText}>
                    {" "}
                    {exercise.recommendedResistance}
                  </Text>
                )}
                {showCT ? (
                  <Text style={WorkoutScreenStyle.exerciseDescriptionHeader}>
                    Coaching tip:
                  </Text>
                ) : null}
                {showCT &&
                  exercise.coachingTip.map((tip, index) =>
                    tip ? (
                      <View style={{ flexDirection: "row" }} key={index}>
                        <Text style={NutritionStyles.ingredientsText}> • </Text>
                        <Text style={NutritionStyles.ingredientsText}>
                          {tip.trim().replace("-", "")}
                        </Text>
                      </View>
                    ) : null
                  )}
                {exercise.scaledVersion && (
                  <Text style={WorkoutScreenStyle.exerciseDescriptionHeader}>
                    Scaled version:
                  </Text>
                )}
                {exercise.scaledVersion && (
                  <Text style={WorkoutScreenStyle.exerciseDescriptionText}>
                    {exercise.scaledVersion}
                  </Text>
                )}
                {exercise.otherInfo &&
                  exercise.otherInfo.map((text, index) => (
                    <Text
                      key={index}
                      style={WorkoutScreenStyle.exerciseDescriptionHeader}
                    >
                      {text}
                    </Text>
                  ))}
              </View>
            </View>
          )}
        </Carousel>
      </View>
    );
  };

  render() {}
}
