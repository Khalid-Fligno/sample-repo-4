import React from "react";
import PropTypes from "prop-types";
import { View, Text, Alert } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import * as FileSystem from "expo-file-system";
import firebase from "firebase";
import ReactTimeout from "react-timeout";
import { db } from "../../../../config/firebase";
import Loader from "../../../components/Shared/Loader";
import colors from "../../../styles/colors";
import globalStyle from "../../../styles/globalStyles";
import calendarStyles from "./calendarStyle";
import {
  fetchRecipeData,
  getCurrentPhase,
  getTotalChallengeWorkoutsCompleted,
  getCurrentChallengeDay,
  getTodayRecommendedMeal,
  getTodayRecommendedWorkout,
  isActiveChallenge,
  convertRecipeData,
} from "../../../utils/challenges";
import CustomCalendarStrip from "../../../components/Calendar/CustomCalendarStrip";
import Modal from "react-native-modal";
import ChallengeSetting from "../../../components/Calendar/ChallengeSetting";
import moment from "moment";
import createUserChallengeData from "../../../components/Challenges/UserChallengeData";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { NavigationActions } from "react-navigation";
import OnBoardingNotification from "../../../components/Shared/OnBoardingNotification";
import { downloadExerciseWC, loadExercise } from "../../../utils/workouts";
import DayDisplay from "./DayDisplay";
import {
  downloadRecipeCoverImage,
  fetchChallengeLevels,
  fetchUserDataAndBurpees,
  promptUser,
} from "../../../utils/calendarHome";

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
      width: 0,
      AllRecipe: [],
      challengeRecipe: [],
      transformLevel: undefined,
      completeCha: undefined,
      todayRecommendedRecipe: undefined,
      phaseDefaultTags: undefined,
      favoriteRecipe: [],
      currentDay: undefined,
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
    this.props.navigation.setParams({
      activeChallengeSetting: () => this.handleActiveChallengeSetting(),
    });
    // this.checkScheduleChallenge();
    this.checkSchedule();
    this.fetchRecipeChallenge();
    this.fetchActiveChallengeUserData();
    this.fetchUserData();
  };

  componentWillUnmount() {
    if (this.unsubscribeFACUD) this.unsubscribeFACUD();
    if (this.unsubscribeFACD) this.unsubscribeFACD();
    if (this.unsubscribeSchedule) this.unsubscribeSchedule();
  }

  handleActiveChallengeSetting() {
    this.toggleSetting();
  }

  fetchRecipeChallenge = async () => {
    const challengeLevels = await fetchChallengeLevels();
    if (challengeLevels.length)
      fetchRecipeData(challengeLevels).then((res) => {
        this.setState({
          AllRecipe: res.recommendedRecipe,
          loading: false,
        });
      });

    this.setState({
      challengeRecipe: challengeLevels,
    });
  };

  fetchCalendarEntries = () => {
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
    this.day = date.format("dddd");
    this.month = date.format("MMM");
    this.date = date.format("D");

    this.setState({
      currentDay: (this.stringDate = date.format("YYYY-MM-DD").toString()),
    });

    this.currentChallengeDay = getCurrentChallengeDay(
      activeChallengeUserData.startDate,
      this.stringDate
    );

    const id = activeChallengeUserData.id;
    const uid = await AsyncStorage.getItem("uid");
    const activeChallengeUserRef = db
      .collection("users")
      .doc(uid)
      .collection("challenges")
      .doc(id);

    activeChallengeUserRef.set(
      { recipes: { days: this.currentChallengeDay } },
      { merge: true }
    );

    //TODO:check the active challenge cndtns
    if (
      activeChallengeData &&
      activeChallengeUserData &&
      activeChallengeUserData.status === "Active" &&
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
    const result = await fetchUserDataAndBurpees();
    if (typeof result === Boolean) {
      this.setState({
        initialBurpeeTestCompleted: result || false,
      });
    }
  };

  checkSchedule = async () => {
    isActiveChallenge().then((res) => {
      const isBetween = moment(this.stringDate).isBetween(
        res.startDate,
        res.endDate,
        undefined,
        "[]"
      );
      if (!isBetween) {
        this.setState({
          isSchedule: true,
          ScheduleData: res,
          loading: false,
        });
      }
    });
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
          { status: "Active", isSchedule: true },
          { merge: true }
        );
      } else if (res && res.isSchedule) {
        const isBetween = moment(this.stringDate).isBetween(
          res.startDate,
          res.endDate,
          undefined,
          "[]"
        );
        const challengeRef = db
          .collection("users")
          .doc(uid)
          .collection("challenges")
          .doc(res.id);
        challengeRef.set(
          { status: "Active", isSchedule: false },
          { merge: true }
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
        const isBetween = moment(this.stringDate).isBetween(
          res.startDate,
          res.endDate,
          undefined,
          "[]"
        );
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
      }
    });
  }

  loadExercises = async (workoutData) => {
    this.setState({ loadingExercises: true });
    Object.assign(workoutData, {
      warmUpExercises: workoutData.warmUpExercises,
    });

    const workout = await loadExercise(workoutData);

    if (workout && workout.newWorkout) {
      const warmUpExercises = await downloadExerciseWC(
        workout,
        Object.prototype.toString
          .call(workout.warmUpExercises)
          .indexOf("Array") > -1
          ? workout.warmUpExercises
          : workout.warmUpExercises.filter((warmUpExercise) => {
              return warmUpExercise;
            }),
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
      transformRoute: true,
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
      this.unsubscribeFACUD = db
        .collection("users")
        .doc(uid)
        .collection("challenges")
        .where("status", "in", ["Active"])
        .onSnapshot(async (querySnapshot) => {
          const list = [];
          querySnapshot.forEach(async (doc) => {
            list.push(doc.data());
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
              this.setState({ completeCha: isCompleted });
              this.props.navigation.navigate("ChallengeSubscription", {
                completedChallenge: true,
              });
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
      console.log("Fetch active challenge user data error!");
    }
  };

  fetchActiveChallengeData = async (activeChallengeUserData) => {
    const { currentDay } = this.state;
    let data = activeChallengeUserData.faveRecipe;
    let recipe = [];
    let breakfastId = [];
    let lunchId = [];
    let dinnerId = [];
    let snackId = [];
    let drinkId = [];
    let preworkoutId = [];
    let treatsId = [];

    const currentChallengeDay = getCurrentChallengeDay(
      activeChallengeUserData.startDate,
      currentDay
    );

    try {
      this.unsubscribeFACD = db
        .collection("challenges")
        .doc(await activeChallengeUserData.id)
        .onSnapshot((doc) => {
          if (doc.exists) {
            this.setState({
              activeChallengeUserData,
              activeChallengeData: doc.data(),
            });
            setTimeout(() => {
              this.getCurrentPhaseInfo();
            }, 500);
          }
        });
    } catch (err) {
      this.setState({ loading: false });
      console.log(err);
      console.log("Fetch active challenge data error!");
    }

    if (data) {
      data.forEach((res) => {
        try {
          if (res.day === currentChallengeDay) {
            if (res.recipeMeal.breakfast) {
              recipe.push(res.recipeMeal.breakfast);
              breakfastId.push(res.recipeMeal.breakfast);
            }
            if (res.recipeMeal.lunch) {
              recipe.push(res.recipeMeal.lunch);
              lunchId.push(res.recipeMeal.lunch);
            }
            if (res.recipeMeal.dinner) {
              recipe.push(res.recipeMeal.dinner);
              dinnerId.push(res.recipeMeal.dinner);
            }
            if (res.recipeMeal.snack) {
              recipe.push(res.recipeMeal.snack);
              snackId.push(res.recipeMeal.snack);
            }
            if (res.recipeMeal.drink) {
              recipe.push(res.recipeMeal.drink);
              drinkId.push(res.recipeMeal.drink);
            }
            if (res.recipeMeal.preworkout) {
              recipe.push(res.recipeMeal.preworkout);
              preworkoutId.push(res.recipeMeal.preworkout);
            }
            if (res.recipeMeal.treats) {
              recipe.push(res.recipeMeal.treats);
              treatsId.push(res.recipeMeal.treats);
            }
          }
        } catch (err) {}
      });

      this.setState({
        skipped: activeChallengeUserData.onBoardingInfo.skipped ?? false,
      });
    }

    convertRecipeData(recipe).then((res) => {
      const resx = res.recipeResult;

      const breakfastList = resx.filter((res) => res.id === breakfastId[0]);
      const lunchList = resx.filter((res) => res.id === lunchId[0]);
      const dinnerList = resx.filter((res) => res.id === dinnerId[0]);
      const snackList = resx.filter((res) => res.id === snackId[0]);
      const drinkList = resx.filter((res) => res.id === drinkId[0]);
      const preworkoutList = resx.filter((res) => res.id === preworkoutId[0]);
      const treatsList = resx.filter((res) => res.id === treatsId[0]);

      const recommendedMeal = [
        {
          breakfast: breakfastList,
          lunch: lunchList,
          dinner: dinnerList,
          snack: snackList,
          drink: drinkList,
          preworkout: preworkoutList,
          treats: treatsList,
        },
      ];

      this.setState({
        favoriteRecipe: recommendedMeal,
      });
    });
  };

  async getCurrentPhaseInfo() {
    const { activeChallengeUserData, activeChallengeData } = this.state;

    if (activeChallengeUserData && activeChallengeData) {
      this.setState({ loading: false });
      // const data = activeChallengeUserData.faveRecipe;
      const test = activeChallengeUserData.startDate;
      const transformLevel = activeChallengeUserData.displayName;

      if (this.stringDate >= test) {
        this.setState({ loading: true });
      }

      //TODO :getCurrent phase data
      this.phase = getCurrentPhase(
        activeChallengeUserData.phases,
        this.stringDate
      );
      this.transformLevel = transformLevel;
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

        // TODO getToday one recommended meal randomly
        getTodayRecommendedMeal(this.phaseData, activeChallengeData).then(
          (res) => {
            this.setState({
              todayRecommendedRecipe: res.recommendedRecipe,
              todayRecommendedMeal: res.recommendedMeal,
              challengeMealsFilterList: res.challengeMealsFilterList,
              phaseDefaultTags: res.phaseDefaultTags,
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

        if (todayRcWorkout) this.setState({ todayRcWorkout: todayRcWorkout });
        else this.setState({ todayRcWorkout: undefined });
      }
    } else {
      // Alert.alert('Something went wrong please try again')
    }
  }

  async goToRecipe(recipeData) {
    this.setState({ loading: true });
    const result = await downloadRecipeCoverImage(recipeData);
    this.setState({ loading: false });
    this.props.navigation.navigate("Recipe", {
      recipe: recipeData,
      title: "challenge",
      extraProps: { fromCalender: true },
    });
  }

  getToFilter(data, data1, data2, title) {
    const {
      challengeRecipe,
      activeChallengeData,
      phaseDefaultTags,
      activeChallengeUserData,
    } = this.state;

    const datas = activeChallengeUserData.faveRecipe;

    if (datas === undefined) {
      promptUser(activeChallengeUserData, datas, this.props.navigation);
    }

    this.props.navigation.navigate("FilterRecipe", {
      currentChallengeDay: this.currentChallengeDay,
      activeChallengeUserData: activeChallengeUserData,
      phaseDefaultTags: phaseDefaultTags,
      defaultLevelTags: activeChallengeData.levelTags,
      todayRecommendedRecipe: data2,
      challengeAllRecipe: challengeRecipe[0],
      recipes: data,
      title: title,
      allRecipeData: data1,
    });
  }

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
      width,
      AllRecipe,
      completeCha,
      todayRecommendedRecipe,
      favoriteRecipe,
    } = this.state;
    console.log(CalendarSelectedDate, "CalendarSelectedDate");
    let showRC = false;
    if (activeChallengeData && activeChallengeUserData) {
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

    const setting = (
      <Modal
        isVisible={this.state.isSettingVisible}
        coverScreen={true}
        style={{ margin: 0 }}
        animationIn="fadeInLeft"
        animationOut="fadeOutLeft"
        onBackdropPress={() => this.toggleSetting()}
      >
        <ChallengeSetting
          onToggle={() => this.toggleSetting()}
          currentDay={this.state.currentDay}
          activeChallengeUserData={activeChallengeUserData}
          activeChallengeData={activeChallengeData}
          isSchedule={isSchedule}
          ScheduleData={ScheduleData}
          navigation={this.props.navigation}
          fetchCalendarEntries={this.fetchCalendarEntries}
          resetActiveChallengeUserData={this.resetActiveChallengeUserData}
          navigation={this.props.navigation}
          completeCha={completeCha}
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

        {this.state.isSchedule && !showRC && !loading && (
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
        <DayDisplay
          showRC={showRC}
          phaseData={this.phaseData}
          isSwiping={this.state.isSwiping}
          activeChallengeData={activeChallengeData}
          setState={this.setState}
          currentChallengeDay={this.currentChallengeDay}
          width={width}
          phase={this.phase}
          transformLevel={this.transformLevel}
          todayRcWorkout={todayRcWorkout}
          loadExercises={this.loadExercises}
          AllRecipe={AllRecipe}
          favoriteRecipe={favoriteRecipe}
          todayRecommendedRecipe={todayRecommendedRecipe}
          todayRecommendedMeal={todayRecommendedMeal}
          goToRecipe={this.goToRecipe}
          getToFilter={this.getToFilter}
        />

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
