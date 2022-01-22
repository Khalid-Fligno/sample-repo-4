import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
  UIManager,
  LayoutAnimation,
  SectionList,
  Picker,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import * as FileSystem from "expo-file-system";
import DateTimePicker from "@react-native-community/datetimepicker";
import Video from "react-native-video";
import Modal from "react-native-modal";
import Carousel from "react-native-carousel";
import { DotIndicator } from "react-native-indicators";
import { db } from "../../../../config/firebase";
import Icon from "../../../components/Shared/Icon";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  findFocus,
  findFocusIcon,
  findWorkoutType,
} from "../../../utils/workouts";
import colors from "../../../styles/colors";
// import fonts from '../../../styles/fonts';
import globalStyle from "../../../styles/globalStyles";
import WorkoutScreenStyle from "./WorkoutScreenStyle";
import TimeSvg from "../../../../assets/icons/time";
import fonts from "../../../styles/fonts";
import NutritionStyles from "../Nutrition/NutritionStyles";
import Loader from "../../../components/Shared/Loader";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
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
      expandedExercise: true,
      expandedWarmup: false,
      expandedCooldown: false,
      lifestyle: false,
      mode: "home",
      showPickerMode: false,
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
      lifestyle: this.props.navigation.getParam("lifestyle"),
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
    const { workout, reps, extraProps, lifestyle } = this.state;
    this.setState({ musicModalVisible: false });
    // this.props.navigation.navigate('Countdown', { exerciseList: workout.exercises, reps, resistanceCategoryId: workout.resistanceCategoryId });
    this.props.navigation.navigate("Countdown", {
      lifestyle,
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
    // this.checkMusicAppAvailability();
  };

  componentWillUnmount = async () => {
    console.log("unmount");
    // this.focusListener.remove()
  };

  togglePreview = (section) => {
    if (section.key === 0) {
      this.setState({ expandedWarmup: !this.state.expandedWarmup });
    } else if (section.key === 1) {
      this.setState({ expandedExercise: !this.state.expandedExercise });
    } else if (section.key === 2) {
      this.setState({ expandedCooldown: !this.state.expandedCooldown });
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  renderItem = (render) => {
    const section = render.section;
    const { expandedWarmup, expandedExercise, expandedCooldown } = this.state;
    if (section.key === 0) {
      return expandedWarmup ? (
        this.renderExercise(render)
      ) : (
        <View style={{ height: 0 }} />
      );
    } else if (section.key === 1) {
      return expandedExercise ? (
        this.renderExercise(render)
      ) : (
        <View style={{ height: 0 }} />
      );
    } else if (section.key === 2) {
      return expandedCooldown ? (
        this.renderExercise(render)
      ) : (
        <View style={{ height: 0 }} />
      );
    }
    return <View />;
  };

  renderExercise = ({ item: exercise, index, section }) => {
    // console.log("Workout: ", this.state.workout.exercises[0].duration);
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

    const convert = (exerciseDur) => {
      var mins = Math.trunc(exerciseDur / 60);
      var sec = exerciseDur % 60;
      return mins + "min " + sec + "s";
    };

    let videoUrl = "";
    switch (section.key) {
      case 0:
        videoUrl = `${FileSystem.cacheDirectory}warmUpExercise-${
          index + 1
        }.mp4`;
        break;
      case 1:
        videoUrl = `${FileSystem.cacheDirectory}exercise-${index + 1}.mp4`;
        break;
      case 2:
        videoUrl = `${FileSystem.cacheDirectory}coolDownExercise-${
          index + 1
        }.mp4`;
        break;
    }
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
          <View key={exercise.id}>
            <View style={WorkoutScreenStyle.exerciseTile}>
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
                    section.title != "Workout" &&
                    !this.state.workout.rest && (
                      <Text
                        style={WorkoutScreenStyle.exerciseTileHeaderBarRight}
                      >
                        {exercise.duration} {"secs"}
                      </Text>
                    )}
                  {this.state.workout.workoutProcessType === "onlyOne" &&
                    section.title != "Workout" &&
                    !this.state.workout.rest && (
                      <Text
                        style={WorkoutScreenStyle.exerciseTileHeaderBarRight}
                      >
                        {exercise.duration} {"secs"}
                      </Text>
                    )}

                  {this.state.workout.workoutProcessType === "circular" &&
                    section.title != "Workout" &&
                    !this.state.workout.rest && (
                      <Text
                        style={WorkoutScreenStyle.exerciseTileHeaderBarRight}
                      >
                        {exercise.duration} {"secs"}
                      </Text>
                    )}

                  {this.state.workout.workoutProcessType === "oneByOne" &&
                    section.title === "Workout" &&
                    !this.state.workout.rest && (
                      <Text
                        style={WorkoutScreenStyle.exerciseTileHeaderBarRight}
                      >
                        {this.state.workout["workoutReps"]} x {this.state.reps}
                      </Text>
                    )}

                  {this.state.workout.workoutProcessType === "oneByOne" &&
                    this.state.workout.rest && (
                      <Text
                        style={WorkoutScreenStyle.exerciseTileHeaderBarRight}
                      >
                        {workIntervalTimeinSec}s on/{restIntervalTimeinSec}s off
                      </Text>
                    )}
                  {this.state.workout.workoutProcessType === "onlyOne" &&
                    section.title === "Workout" &&
                    this.state.lifestyle != true &&
                    exercise.duration <= 60 && (
                      <Text
                        style={WorkoutScreenStyle.exerciseTileHeaderBarRight}
                      >
                        {exercise.duration}s
                        {/* {restIntervalTimeinSec > 0 &&
                          `/${restIntervalTimeinSec}s off`} */}
                      </Text>
                    )}
                  {this.state.workout.workoutProcessType === "onlyOne" &&
                    section.title === "Workout" &&
                    this.state.lifestyle != true &&
                    exercise.duration > 60 && (
                      <Text
                        style={WorkoutScreenStyle.exerciseTileHeaderBarRight}
                      >
                        {convert(exercise.duration)}
                        {/* {restIntervalTimeinSec > 0 &&
                          `/${restIntervalTimeinSec}s off`} */}
                      </Text>
                    )}

                  {this.state.workout.workoutProcessType === "onlyOne" &&
                    section.title === "Workout" &&
                    this.state.lifestyle === true &&
                    workIntervalTimeinSec <= 60 && (
                      <Text
                        style={WorkoutScreenStyle.exerciseTileHeaderBarRight}
                      >
                        {workIntervalTimeinSec}s
                        {/* {restIntervalTimeinSec > 0 &&
                          `/${restIntervalTimeinSec}s off`} */}
                      </Text>
                    )}
                  {this.state.workout.workoutProcessType === "onlyOne" &&
                    section.title === "Workout" &&
                    this.state.lifestyle === true &&
                    workIntervalTimeinSec > 60 && (
                      <Text
                        style={WorkoutScreenStyle.exerciseTileHeaderBarRight}
                      >
                        {workIntervalTimeinSec / 60}mins
                        {/* {restIntervalTimeinSec > 0 &&
                          `/${restIntervalTimeinSec}s off`} */}
                      </Text>
                    )}

                  {/* {this.state.workout.workoutProcessType === "onlyOne" && section.title ==='Workout' &&
                    workIntervalTimeinSec > 60 && (
                      <Text style={WorkoutScreenStyle.exerciseTileHeaderBarRight}>
                        {this.state.workout.exercises[0].duration / 60} mins
                        {restIntervalTimeinSec > 0 &&
                          `/${restIntervalTimeinSec / 60}m off`}
                      </Text>
                    )} */}
                  {this.state.workout.workoutProcessType === "circular" &&
                    section.title === "Workout" &&
                    !this.state.workout.count && (
                      <Text
                        style={WorkoutScreenStyle.exerciseTileHeaderBarRight}
                      >
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
                  // uri: `${FileSystem.cacheDirectory}exercise-${index + 1}.mp4`,
                  uri: videoUrl,
                }}
                playWhenInactive
                resizeMode="contain"
                repeat
                muted
                selectedAudioTrack={{
                  type: "disabled",
                }}
                style={{
                  width: width - 30,
                  height: width - 30,
                  position: "relative",
                  zIndex: 0,
                }}
              />
            </View>
            <View style={styles.invisibleView}>
              <View style={styles.setCounter}>
                <Text style={styles.setCounterText}>Swipe for more info</Text>
                <Icon name="chevron-right" size={10} style={styles.icon} />
              </View>
            </View>
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

  render() {
    const {
      loading,
      workout,
      reps,
      chosenDate,
      calendarModalVisible,
      addingToCalendar,
      musicModalVisible,
      appleMusicAvailable,
      spotifyAvailable,
      workoutSubCategory,
      fitnessLevel,
      extraProps,
      notificationBanner,
      expandedExercise,
      expandedWarmup,
      expandedCooldown,
      mode,
    } = this.state;

    if (workout) {
      console.log(workout, "workout");
    }

    let workoutTime = 0;
    let warmupInterval = 0;
    let workoutInterval = 0;
    let cooldownInterval = 0;
    if (workout) {
      workoutTime = workout.workoutTime;
      if (workout.coolDownExercises) {
        let seconds = 0;
        workout.coolDownExercises.map((exercise) => {
          seconds += exercise.duration;
        });
        cooldownInterval = Math.floor(seconds / 60);
      }

      if (workout.warmUpExercises) {
        let seconds = 0;
        workout.warmUpExercises.map((exercise) => {
          seconds += exercise.duration;
        });
        warmupInterval = Math.floor(seconds / 60);
      }
      if (workout.exercises) {
        workoutInterval =
          workout.workoutTime - (warmupInterval + cooldownInterval);
      }
      // workoutTime = ((workout.workIntervalMap[fitnessLevel-1]+workout.restIntervalMap[fitnessLevel-1])*workout.exercises.length*workout.workoutReps)/60;
    }

    return (
      <View
        style={[
          globalStyle.container,
          { paddingHorizontal: 0, backgroundColor: colors.smoke },
        ]}
      >
        {Platform.OS === "ios" && (
          <Modal
            isVisible={calendarModalVisible}
            animationIn="fadeIn"
            animationInTiming={600}
            animationOut="fadeOut"
            animationOutTiming={600}
            onBackdropPress={this.hideCalendarModal}
          >
            <View style={globalStyle.modalContainer}>
              <DateTimePicker
                mode="date"
                value={chosenDate}
                onChange={this.setDate}
                minimumDate={new Date()}
              />
              <TouchableOpacity
                onPress={() => this.addWorkoutToCalendar(chosenDate)}
                style={globalStyle.modalButton}
              >
                {addingToCalendar ? (
                  <DotIndicator color={colors.white} count={3} size={6} />
                ) : (
                  <Text style={globalStyle.modalButtonText}>
                    ADD TO CALENDAR
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </Modal>
        )}
        {Platform.OS === "android" && calendarModalVisible && !loading && (
          <DateTimePicker
            mode="date"
            value={chosenDate}
            onChange={this.setDate}
            minimumDate={new Date()}
          />
        )}
        <View
          style={{
            width: widthPercentageToDP(50),
            padding: heightPercentageToDP(1),
          }}
        >
          <View>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  showPickerMode: true,
                });
              }}
              style={{
                padding: 15,
                backgroundColor: colors.white,
                borderWidth: 1,
                borderColor: colors.grey.light,
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: 14,
                  color: colors.charcoal.dark,
                }}
              >
                {mode === "GYM" ? "GYM" : "HOME"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {workout && workout[this.state.mode] && !loading && (
          <View style={WorkoutScreenStyle.flatListContainer}>
            <SectionList
              sections={
                workout.warmUpExercises && workout.coolDownExercises
                  ? [
                      {
                        data: workout.warmUpExercises,
                        title: "Warmup",
                        key: 0,
                      },
                      {
                        data: workout.exercises,
                        title: "Workout",
                        key: 1,
                      },
                      {
                        data: workout.coolDownExercises,
                        title: "Cooldown",
                        key: 2,
                      },
                    ]
                  : [
                      {
                        data: workout.exercises,
                        title: "Workout",
                        key: 1,
                      },
                    ]
              }
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
              ListHeaderComponent={
                <View style={WorkoutScreenStyle.workoutInfoContainer}>
                  <View style={WorkoutScreenStyle.workoutNameContainer}>
                    <Text style={WorkoutScreenStyle.workoutName}>
                      {workout && workout.displayName.toUpperCase()}
                    </Text>
                  </View>

                  <View style={WorkoutScreenStyle.workoutIconsRow}>
                    {!this.state.workout.filters.includes("strength") && (
                      <View style={WorkoutScreenStyle.workoutIconContainer}>
                        <Icon
                          name="workouts-hiit"
                          size={36}
                          color={colors.charcoal.standard}
                          style={WorkoutScreenStyle.hiitIcon}
                        />
                        <Text style={WorkoutScreenStyle.workoutInfoFieldData}>
                          HIIT {findWorkoutType(workout)}
                        </Text>
                      </View>
                    )}
                    {!workout.count && (
                      <View style={WorkoutScreenStyle.workoutIconContainer}>
                        <TimeSvg width="40" height="40" />
                        <Text style={WorkoutScreenStyle.workoutInfoFieldData}>
                          {workoutTime.toFixed(0)} Mins
                        </Text>
                      </View>
                    )}

                    <View style={WorkoutScreenStyle.workoutIconContainer}>
                      <Icon
                        name="workouts-reps"
                        size={40}
                        color={colors.charcoal.standard}
                      />
                      <Text style={WorkoutScreenStyle.workoutInfoFieldData}>
                        {this.state.workout.filters.includes("strength")
                          ? `${reps * workoutTime} Reps`
                          : `${workout.workoutReps} Rounds`}
                      </Text>
                    </View>
                    {this.state.workout.filters.includes("strength") && (
                      <View style={WorkoutScreenStyle.workoutIconContainer}>
                        <Icon
                          name={workout && findFocusIcon(workout)}
                          size={40}
                          color={colors.charcoal.standard}
                        />
                        <Text style={WorkoutScreenStyle.workoutInfoFieldData}>
                          {workout && findFocus(workout)}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View
                    style={WorkoutScreenStyle.workoutPreviewHeaderContainer}
                  >
                    <Text style={WorkoutScreenStyle.workoutPreviewHeaderText}>
                      WORKOUT PREVIEW
                    </Text>
                  </View>
                </View>
              }
              renderSectionHeader={({ section }) => {
                const interval = (() => {
                  switch (section.key) {
                    case 0:
                      return warmupInterval;
                    case 1:
                      return workoutInterval;
                    case 2:
                      return cooldownInterval;
                  }
                })();
                return (
                  <View style={styles.sectionHeader}>
                    <View style={{ marginLeft: 15 }}>
                      <Text style={{ fontSize: 15, fontFamily: fonts.bold }}>
                        {section.title}
                      </Text>
                      <Text
                        style={{ fontSize: 12, fontFamily: fonts.boldNarrow }}
                      >{`${section.data.length} exercises - ${interval} min`}</Text>
                    </View>
                    <View style={{ marginRight: 15 }}>
                      <TouchableOpacity
                        style={{ flexDirection: "row", alignItems: "center" }}
                        onPress={() => this.togglePreview(section)}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            fontFamily: fonts.boldNarrow,
                            textDecorationLine: "underline",
                            textDecorationColor: colors.black,
                          }}
                        >
                          {"Tap to preview"}
                        </Text>
                        <MaterialIcon
                          name="chevron-down"
                          size={30}
                          color={colors.black}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
              stickySectionHeadersEnabled={true}
            />
          </View>
        )}
        <TouchableOpacity style={styles.startButton} onPress={this.handleStart}>
          <Text
            style={{
              color: colors.white,
              fontFamily: fonts.bold,
              fontSize: 20,
              alignSelf: "center",
            }}
          >
            {"Start now"}
          </Text>
        </TouchableOpacity>

        <Modal
          isVisible={this.state.showPickerMode}
          onBackdropPress={() => {
            this.setState({
              showPickerMode: false,
            });
          }}
          animationIn="fadeIn"
          animationInTiming={600}
          animationOut="fadeOut"
          animationOutTiming={600}
        >
          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <Picker
              selectedValue={mode === "gym" ? "GYM" : "HOME"}
              onValueChange={(value) => {
                value === "GYM"
                  ? this.setState({
                      mode: "gym",
                    })
                  : this.setState({
                      mode: "home",
                    });
              }}
            >
              <Picker.Item key={0} label="HOME" value="HOME" />
              <Picker.Item key={1} label="GYM" value="GYM" />
            </Picker>
            <TouchableOpacity
              title="DONE"
              onPress={() => {
                this.setState({
                  showPickerMode: false,
                });
              }}
              style={{
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.black,
                height: 50,
                width: "100%",
                marginBottom: 0,
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: 14,
                  color: colors.white,
                  marginTop: 3,
                }}
              >
                DONE
              </Text>
            </TouchableOpacity>
          </View>
          <Loader
            loading={loading}
            color={colors.red.standard}
            text={loading ? "Please wait we are loading workout" : null}
          />
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  setCounter: {
    borderColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: 35,
    paddingRight: 10,
    paddingLeft: 10,
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  setCounterText: {
    fontFamily: fonts.bold,
    fontSize: 14,
  },
  invisibleView: {
    bottom: 75,
    right: 26,
    height: 0,
    width,
    alignItems: "flex-end",
    position: "absolute",
  },
  icon: {
    marginTop: 2,
    paddingLeft: 8,
  },
  helpButton: {
    borderColor: colors.black,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 1,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    borderRadius: 4,
    flexDirection: "row",
    paddingRight: 10,
    paddingLeft: 10,
  },
  sectionHeader: {
    height: 60,
    flexDirection: "row",
    backgroundColor: colors.smoke,
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: colors.black,
  },
  startButton: {
    height: 55,
    width: "100%",
    // position: "absolute",
    // bottom: 20,
    backgroundColor: colors.black,
    alignSelf: "center",
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 10,
    shadowColor: colors.black,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
});
