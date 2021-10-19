import React from "react";
import PropTypes from "prop-types";
import { ScrollView, View, Text, Alert, Linking } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import * as FileSystem from "expo-file-system";
import firebase from "firebase";
import ReactTimeout from "react-timeout";
import { db } from "../../../../config/firebase";
import Loader from "../../../components/Shared/Loader";
import colors from "../../../styles/colors";
import globalStyle, { containerPadding } from "../../../styles/globalStyles";
import calendarStyles from "./calendarStyle";
import * as Haptics from "expo-haptics";
import {
  getCurrentPhase,
  getTotalChallengeWorkoutsCompleted,
  getCurrentChallengeDay,
  getTodayRecommendedMeal,
  getTodayRecommendedWorkout,
  isActiveChallenge,
} from "../../../utils/challenges";
import CustomCalendarStrip from "../../../components/Calendar/CustomCalendarStrip";
import ChallengeProgressCard2 from "../../../components/Calendar/ChallengeProgressCard2";
import ChallengeWorkoutCard from "../../../components/Calendar/ChallengeWorkoutCard";
import TodayMealsList from "../../../components/Calendar/TodayMealsList";
import Modal from "react-native-modal";
import ChallengeSetting from "../../../components/Calendar/ChallengeSetting";
import moment from "moment";
import createUserChallengeData from "../../../components/Challenges/UserChallengeData";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { NavigationActions } from "react-navigation";
import OnBoardingNotification from "../../../components/Shared/OnBoardingNotification";
import { downloadExerciseWC, loadExercise } from "../../../utils/workouts";
import { checkVersion } from "react-native-check-version";
import { getVersion } from "react-native-device-info";

class CalendarHomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      workout: undefined,
      loading: false,
      isSwiping: false,
      dayOfWeek: undefined,
      activeChallengeUserData: undefined,
      meals: undefined,
      activeChallengeData: undefined,
      todayRecommendedMeal: undefined,
      challengeMealsFilterList: undefined,
      isSettingVisible: false,
      isSchedule: false,
      ScheduleData: undefined,
      CalendarSelectedDate: undefined,
      todayRcWorkout: undefined,
      loadingExercises: false,
      skipped: false,
      initialBurpeeTestCompleted: false,
    };
    this.calendarStrip = React.createRef();
  }

  toggleSetting = () => {
    this.setState({ isSettingVisible: !this.state.isSettingVisible });
  };

  componentDidMount = async () => {
    this.props.navigation.setParams({
      toggleHelperModal: this.showHelperModal,
    });

    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      this.onFocusFunction();
    });
    // this.onFocusFunction();
  };

  async onFocusFunction() {
    console.log("On focus");
    await this.fetchCalendarEntries();
    await this.fetchActiveChallengeUserData();
    await this.fetchUserData();
    await this.props.navigation.setParams({
      activeChallengeSetting: () => this.handleActiveChallengeSetting(),
    });
  }

  handleActiveChallengeSetting() {
    this.toggleSetting();
  }

  componentWillUnmount() {
    this.focusListener.remove();
    if (this.unsubscribeFACUD) this.unsubscribeFACUD();
    if (this.unsubscribeFACD) this.unsubscribeFACD();
    if (this.unsubscribeSchedule) this.unsubscribeSchedule();
  }

  fetchCalendarEntries = async () => {
    const selectedDate = this.calendarStrip.current.getSelectedDate();
    //Todo :call the function to get the data of current date
    this.handleDateSelected(selectedDate);
  };

  resetActiveChallengeUserData = () => {
    this.props.navigation.reset(
        [NavigationActions.navigate({ routeName: "CalendarHome" })],
        0
    );
  };

  handleDateSelected = async (date) => {
    const { activeChallengeData, activeChallengeUserData } = this.state;
    this.setState({ loading: false });
    this.stringDate = date.format("YYYY-MM-DD").toString();
    //TODO:check the active challenge cndtns
    if (
        activeChallengeData &&
        activeChallengeUserData &&
        activeChallengeUserData.status === "Active"  &&
        new Date(activeChallengeUserData.startDate).getTime() <=
        new Date(this.stringDate).getTime() &&
        new Date(activeChallengeUserData.endDate).getTime() >=
        new Date(this.stringDate).getTime()
    ) {
      this.getCurrentPhaseInfo();
    } else {
      if (!this.state.isSchedule && !this.state.ScheduleData)
        this.checkScheduleChallenge();
      else {
        const isBetween = moment(this.stringDate).isBetween(
            this.state.ScheduleData.startDate,
            this.state.ScheduleData.endDate,
            undefined,
            "[]"
        );
        if (isBetween) this.getCurrentPhaseInfo();
        else {
          this.setState({ loading: false });
          this.forceUpdate();
        }
      }
    }
  };

  fetchUserData = async () => {
    const uid = await AsyncStorage.getItem("uid");
    const version = await checkVersion();
    const versionCodeRef = db
        .collection("users")
        .doc(uid)
        .set({AppVersion: Platform.OS === "ios" ? String(version.version) : String(getVersion())}, { merge: true });
    const userRef = db.collection("users").doc(uid);
    userRef
        .get()
        .then((res) => {
          const data = res.data();
          if (res.data().weeklyTargets == null) {
            const data = {
              weeklyTargets: {
                resistanceWeeklyComplete: 0,
                hiitWeeklyComplete: 0,
                strength: 0,
                interval: 0,
                circuit: 0,
                currentWeekStartDate: moment()
                    .startOf("week")
                    .format("YYYY-MM-DD"),
              },
            };
            userRef.set(data, { merge: true });
          }
          this.setState({
            skipped: this.state.activeChallengeUserData.onBoardingInfo.skipped ?? false,
            initialBurpeeTestCompleted: data.initialBurpeeTestCompleted ?? false,
          });
        })
        .catch((reason) => console.log("Fetching user data error: ", reason));
  };

  async checkScheduleChallenge() {
    const uid = await AsyncStorage.getItem("uid");
    //Checking if any schedule challenge is assign to user
    isActiveChallenge().then((res) => {
      const todayDate = moment(new Date()).format("YYYY-MM-DD");
      if (res && moment(res.startDate).isSame(todayDate) && res.isSchedule) {
        const challengeRef = db
            .collection("users")
            .doc(uid)
            .collection("challenges")
            .doc(res.id);
        challengeRef.set(
            { status: "Active", isSchedule: false },
            { merge: true }
        );
      } else if (res && res.isSchedule) {
        const isBetween = moment(this.stringDate).isBetween(
            res.startDate,
            res.endDate,
            undefined,
            "[]"
        );
        if (!this.state.isSchedule) {
          this.setState({
            CalendarSelectedDate: moment(res.startDate),
            isSchedule: true,
            ScheduleData: res,
            loading: true,
          });
          this.stringDate = res.startDate;
          this.fetchActiveChallengeData(res);
        }
        if (isBetween) {
          this.setState({ isSchedule: true, ScheduleData: res });
          if (!this.state.activeChallengeData) {
            this.fetchActiveChallengeData(res);
          } else {
            this.getCurrentPhaseInfo();
          }
        } else {
          this.setState({
            isSchedule: true,
            ScheduleData: res,
            loading: false,
          });
        }
      } else {
        this.setState({ loading: false });
      }
    });
  }

  loadExercises = async (workoutData) => {
    this.setState({ loadingExercises: true });
    const workout = await loadExercise(workoutData);

    if (workout && workout.newWorkout) {

      const warmUpExercises = await downloadExerciseWC(
          workout,
          Object.prototype.toString.call(workout.warmUpExercises).indexOf("Array")>-1 ? workout.warmUpExercises : workout.warmUpExercises.filter((warmUpExercise) => {return warmUpExercise}),
          workout.warmUpExerciseModel,
          "warmUp"
      );
      if (warmUpExercises.length > 0) {
        const coolDownExercises = await downloadExerciseWC(
            workout,
            workout.coolDownExercises,
            workout.coolDownExerciseModel,
            "coolDown"
        );
        if (coolDownExercises.length > 0) {
          const newWorkout = Object.assign({}, workout, {
            warmUpExercises: warmUpExercises,
            coolDownExercises: coolDownExercises,
          });
          this.goToNext(newWorkout);
          console.log(newWorkout);
        } else {
          this.setState({ loadingExercises: false });
          Alert.alert("Alert!", "Something went wrong!");
        }
      } else {
        this.setState({ loadingExercises: false });
        Alert.alert("Alert!", "Something went wrong!");
      }
    } else if (workout) {
      this.goToNext(workout);
    } else {
      this.setState({ loadingExercises: false });
    }
  };

  async goToNext(workout) {
    console.log(">>here");
    if (
        this.currentChallengeDay === 1 &&
        !this.state.initialBurpeeTestCompleted
    ) {
      await FileSystem.downloadAsync(
          "https://firebasestorage.googleapis.com/v0/b/staging-fitazfk-app.appspot.com/o/videos%2FBURPEE%20(2).mp4?alt=media&token=9ae1ae37-6aea-4858-a2e2-1c917007803f",
          `${FileSystem.cacheDirectory}exercise-burpees.mp4`
      );
    }
    const fitnessLevel = await AsyncStorage.getItem("fitnessLevel", null);
    this.setState({ loadingExercises: false });
    if (this.currentChallengeDay > 0) {
      Object.assign(workout, {
        displayName: `${workout.displayName} - Day ${this.currentChallengeDay}`,
      });
    }
    if (
        this.currentChallengeDay === 1 &&
        !this.state.initialBurpeeTestCompleted
    ) {
      this.props.navigation.navigate("Burpee1", {
        fromScreen: "WorkoutInfo",
        screenReturnParams: {
          workout,
          reps: workout.difficultyLevel[fitnessLevel - 1].toString(),
          workoutSubCategory: workout.workoutSubCategory,
          fitnessLevel,
          extraProps: { fromCalender: true },
        },
      });
      return;
    }
    this.props.navigation.navigate("WorkoutInfo", {
      workout,
      reps: workout.difficultyLevel[fitnessLevel - 1].toString(),
      workoutSubCategory: workout.workoutSubCategory,
      fitnessLevel,
      extraProps: { fromCalender: true },
    });
  }

  deleteCalendarEntry = async (fieldToDelete) => {
    const uid = await AsyncStorage.getItem("uid");
    const stringDate = this.calendarStrip.current
        .getSelectedDate()
        .format("YYYY-MM-DD")
        .toString();
    this.unsubscribe = await db
        .collection("users")
        .doc(uid)
        .collection("calendarEntries")
        .doc(stringDate)
        .update({
          [fieldToDelete]: firebase.firestore.FieldValue.delete(),
        });
    this.setState({ isSwiping: false });
  };

  // ToDo : for challenges
  fetchActiveChallengeUserData = async () => {
    try {
      this.setState({ loading: true });
      const uid = await AsyncStorage.getItem("uid");
      this.unsubscribeFACUD = await db
          .collection("users")
          .doc(uid)
          .collection("challenges")
          .where("status", "in", ["Active"])
          .onSnapshot(async (querySnapshot) => {
            const list = [];
            await querySnapshot.forEach(async (doc) => {
              await list.push(await doc.data());
            });
            const activeChallengeEndDate = list[0] ? list[0].endDate : null;
            const currentDate = moment().format("YYYY-MM-DD");
            const isCompleted = moment(currentDate).isSameOrAfter(
                activeChallengeEndDate
            );
            if (list[0] && !isCompleted) {
              this.fetchActiveChallengeData(list[0]);
            } else {
              if (isCompleted) {
                //TODO check challenge is Completed or not
                const newData = createUserChallengeData(
                    { ...list[0], status: "InActive" },
                    new Date()
                );
                const challengeRef = db
                    .collection("users")
                    .doc(uid)
                    .collection("challenges")
                    .doc(list[0].id);
                challengeRef.set(newData, { merge: true });
                this.props.navigation.navigate("ChallengeSubscription");
                Alert.alert(
                    "Congratulations!",
                    "You have completed your challenge",
                    [{ text: "OK", onPress: () => {} }],
                    { cancelable: false }
                );
              } else {
                this.setState({
                  activeChallengeUserData: undefined,
                  loading: false,
                });
              }
            }
          });
    } catch (err) {
      this.setState({ loading: false });
      console.log(err);
      Alert.alert("Fetch active challenge user data error!");
    }
  };

  fetchActiveChallengeData = async (activeChallengeUserData) => {
    try {
      this.unsubscribeFACD = await db
          .collection("challenges")
          .doc(activeChallengeUserData.id)
          .onSnapshot(async (doc) => {
            if (doc.exists) {
              this.setState({
                activeChallengeUserData,
                activeChallengeData: doc.data(),
                // loading:false
              });
              setTimeout(() => {
                // this.setState({ loading: false });
                // if(!doc.data().newChallenge)
                this.getCurrentPhaseInfo();
              }, 500);
            }
          });
    } catch (err) {
      this.setState({ loading: false });
      console.log(err);
      Alert.alert("Fetch active challenge data error!");
    }
  };

  async getCurrentPhaseInfo() {
    const { activeChallengeUserData, activeChallengeData } = this.state;
    if (activeChallengeUserData && activeChallengeData) {
      this.setState({ loading: false });
      const data = activeChallengeUserData.phases;
      const test = activeChallengeUserData.startDate;
      /*
      if(this.stringDate != test){
        this.setState({loading :false})
      } */if(this.stringDate >= test){
        this.setState({loading :true})
      }
      // this.stringDate = this.calendarStrip.current.getSelectedDate().format('YYYY-MM-DD').toString();
      console.log("date=>", this.stringDate);
      //console.log(test);
      //TODO :getCurrent phase data
      this.phase = getCurrentPhase(
          activeChallengeUserData.phases,
          this.stringDate
      );

      if (this.phase) {
        //TODO :fetch the current phase data from Challenges collection
        this.phaseData = activeChallengeData.phases.filter(
            (res) => res.name === this.phase.name
        )[0];

        //TODO :calculate the workout completed till selected date
        this.totalChallengeWorkoutsCompleted =
            getTotalChallengeWorkoutsCompleted(
                activeChallengeUserData,
                this.stringDate
            );

        //TODO calculate current challenge day
        this.currentChallengeDay = getCurrentChallengeDay(
            activeChallengeUserData.startDate,
            this.stringDate
        );

        //TODO getToday one recommended meal randomly
        getTodayRecommendedMeal(this.phaseData, activeChallengeData).then(
            (res) => {
              this.setState({
                todayRecommendedMeal: res.recommendedMeal,
                challengeMealsFilterList: res.challengeMealsFilterList,
                loading: false,
              });
            }
        );

        //TODO get recommended workout here
        const todayRcWorkout = (
            await getTodayRecommendedWorkout(
                activeChallengeData.workouts,
                activeChallengeUserData,
                this.stringDate
            )
        )[0];
        // console.log("TOfdayya",todayRcWorkout)
        if (todayRcWorkout) this.setState({ todayRcWorkout: todayRcWorkout });
        else this.setState({ todayRcWorkout: undefined });
      }
    } else {
      // Alert.alert('Something went wrong please try again')
    }
  }

  async goToRecipe(recipeData) {
    this.setState({ loading: true });
    const fileUri = `${FileSystem.cacheDirectory}recipe-${recipeData.id}.jpg`;
    await FileSystem.getInfoAsync(fileUri)
        .then(async ({ exists }) => {
          if (!exists) {
            await FileSystem.downloadAsync(
                recipeData.coverImage,
                `${FileSystem.cacheDirectory}recipe-${recipeData.id}.jpg`
            );
            this.setState({ loading: false });
          } else {
            this.setState({ loading: false });
          }
        })
        .catch(() => {
          this.setState({ loading: false });
          Alert.alert("", "Image download error");
        });
    this.props.navigation.navigate("Recipe", {
      recipe: recipeData,
      backTitle: "challenge dashboard",
      extraProps: { fromCalender: true },
    });
  }

  getToFilter(data) {
    console.log('Data: ', data)
    this.props.navigation.navigate('FilterRecipe')
  }

  openLink = (url) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(url);
  };
  //-------**--------

  render() {
    const {
      loading,
      activeChallengeUserData,
      activeChallengeData,
      todayRecommendedMeal,
      isSchedule,
      ScheduleData,
      CalendarSelectedDate,
      todayRcWorkout,
      loadingExercises,
      skipped,
    } = this.state;
    let showRC = false;
    if (activeChallengeData && activeChallengeUserData) {
      // let currentDate = moment(this.calendarStrip.current.getSelectedDate()).format('YYYY-MM-DD');
      //check if selected date is between challenge start and end date
      // console.log("????,,,,",this.stringDate)
      const isBetween = moment(this.stringDate).isBetween(
          activeChallengeUserData.startDate,
          activeChallengeUserData.endDate,
          undefined,
          "[]"
      );
      if (this.calendarStrip.current) {
        if (
            isBetween &&
            todayRecommendedMeal &&
            todayRecommendedMeal.length > 0
        )
            //check if user has recommended meals
          showRC = true;
        else showRC = false;
      }
    }
    const mealsList = showRC && (
        <>
          <Text style={calendarStyles.headerText}>Today's Meals</Text>
          <TodayMealsList
              data={todayRecommendedMeal[0]}
              onPress={(res) => this.goToRecipe(res)}
              filterPress={(res) => this.getToFilter(res)}
          />
        </>
    );
    const workoutCard = todayRcWorkout && showRC && (
        <>
          <Text style={calendarStyles.headerText}>Today's Workout</Text>
          <View style={calendarStyles.listContainer}>
            <ChallengeWorkoutCard
                onPress={() =>
                    todayRcWorkout.name && todayRcWorkout.name !== "rest"
                        ? this.loadExercises(todayRcWorkout, this.currentChallengeDay)
                        : ""
                }
                res={todayRcWorkout}
                currentDay={this.currentChallengeDay}
                title={activeChallengeData.displayName}
            />
          </View>
        </>
    );

    const dayDisplay = (
        <ScrollView
            contentContainerStyle={calendarStyles.dayDisplayContainer}
            scrollEnabled={!this.state.isSwiping}
            showsVerticalScrollIndicator={false}
        >
          {this.phaseData && showRC && (
              <ChallengeProgressCard2
                  phase={this.phase}
                  phaseData={this.phaseData}
                  activeChallengeData={activeChallengeData}
                  activeChallengeUserData={activeChallengeUserData}
                  totalChallengeWorkoutsCompleted={
                    this.totalChallengeWorkoutsCompleted
                  }
                  openLink={() => this.openLink(this.phaseData.pdfUrl)}
                  currentDay={this.currentChallengeDay}
              />
          )}
          {workoutCard}
          {mealsList}
        </ScrollView>
    );

    const setting = (
        <Modal
            isVisible={this.state.isSettingVisible}
            coverScreen={true}
            style={{ margin: 0 }}
            animationIn="fadeInLeft"
            animationOut="fadeOutLeft"
            onBackdropPress={() => this.toggleSetting()}
            // useNativeDriver={true}
        >
          <ChallengeSetting
              onToggle={() => this.toggleSetting()}
              activeChallengeUserData={activeChallengeUserData}
              activeChallengeData={activeChallengeData}
              isSchedule={isSchedule}
              ScheduleData={ScheduleData}
              navigation={this.props.navigation}
              fetchCalendarEntries={this.fetchCalendarEntries}
              resetActiveChallengeUserData={this.resetActiveChallengeUserData}
              navigation={this.props.navigation}
          />
        </Modal>
    );
    return (
        <View style={[globalStyle.container, { paddingHorizontal: 0 }]}>
          <CustomCalendarStrip
              ref1={this.calendarStrip}
              onDateSelected={(date) => {
                this.handleDateSelected(date);
              }}
              CalendarSelectedDate={CalendarSelectedDate}
          />

          {isSchedule && !showRC && !loading && (
              <View style={{ margin: wp("5%") }}>
                <Text style={calendarStyles.scheduleTitleStyle}>
                  {ScheduleData.displayName}
                </Text>
                <Text style={calendarStyles.scheduleTextStyle}>
                  Your challenge will start from{" "}
                  {moment(ScheduleData.startDate).format("DD MMM YYYY")}
                </Text>
                <Text style={calendarStyles.scheduleTextStyle}>
                  You can change this in settings
                </Text>
              </View>
          )}
          {skipped && (
              <OnBoardingNotification
                  navigation={this.props.navigation}
                  data={activeChallengeUserData}
              />
          )}
          {dayDisplay}
          {setting}
          <Loader
              loading={loading || loadingExercises}
              color={colors.red.standard}
              text={loadingExercises ? "Please wait we are loading workout" : null}
          />
        </View>
    );
  }
}

CalendarHomeScreen.propTypes = {
  setTimeout: PropTypes.func.isRequired,
};

export default ReactTimeout(CalendarHomeScreen);