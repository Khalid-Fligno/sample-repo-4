import React from "react";
import PropTypes from "prop-types";
import { ScrollView, View, Text, Alert, Linking, Dimensions, TextInput, TouchableOpacity } from "react-native";
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
import fonts from "../../../styles/fonts";
import Svg, { Path } from "react-native-svg"
import {
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/FontAwesome";
import sortBy from "lodash.sortby";

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

    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      this.onFocusFunction();
    });
    // this.onFocusFunction();
  };

  async onFocusFunction() {
    console.log("On focus");
    await this.fetchRecipeChallenge();
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
    if (this.unsubscribeReC) this.unsubscribeReC();
  }

  fetchRecipeChallenge = async () => {
    this.unsubscribeReC = await db
      .collection("challenges")
      .get()
      .then(querySnapshot => {
        const documents = querySnapshot.docs.map(doc => doc.data())

        const level_1 = documents.filter((res) => {
          if (res.id === '88969d13-fd11-4fde-966e-df1270fb97dd') {
            return res.id
          }
        })
        const level_2 = documents.filter((res) => {
          if (res.id === '7798f53c-f613-435d-b94b-b67f1f43b51b') {
            return res.id
          }
        })

        const level_3 = documents.filter((res) => {
          if (res.id === '0d48d056-2623-4201-b25a-3f1d78083dba') {
            return res.id
          }
        })

        const challengeLevel = [{
          level1: level_1,
          level2: level_2,
          level3: level_3,
        }]

        // fetchRecipeData(challengeLevel).then((res) => {
        //   this.setState({
        //     AllRecipe: res.recommendedRecipe,
        //     loading: false,
        //   })
        // })

        this.setState({
          challengeRecipe: challengeLevel
        })
      })
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
    this.day = date.format("dddd")
    this.month = date.format("MMM")
    this.date = date.format("D")

    this.setState({
      currentDay: this.stringDate = date.format("YYYY-MM-DD").toString()
    })

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
    const uid = await AsyncStorage.getItem("uid");
    const version = await checkVersion();
    const versionCodeRef = db
      .collection("users")
      .doc(uid)
      .set({ AppVersion: Platform.OS === "ios" ? String(version.version) : String(getVersion()) }, { merge: true });
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

    // console.log('workoutData.warmUpExercises: ', workoutData.warmUpExercises)

    // let uniqueWarmUpExercises = [...new Set(workoutData.warmUpExercises)];
    // console.log('uniqueWarmUpExercise:', uniqueWarmUpExercises)
    Object.assign(workoutData, {
      warmUpExercises: workoutData.warmUpExercises
    });

    const workout = await loadExercise(workoutData);

    if (workout && workout.newWorkout) {

      const warmUpExercises = await downloadExerciseWC(
        workout,
        Object.prototype.toString.call(workout.warmUpExercises).indexOf("Array") > -1 ? workout.warmUpExercises : workout.warmUpExercises.filter((warmUpExercise) => { return warmUpExercise }),
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
      transformRoute: true
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
              this.setState({ completeCha: isCompleted })
              this.props.navigation.navigate("ChallengeSubscription", { completedChallenge: true })
              Alert.alert(
                "Congratulations!",
                "You have completed your challenge",
                [{ text: "OK", onPress: () => { } }],
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
    const { currentDay } = this.state
    let data = activeChallengeUserData.faveRecipe
    let recipe = []

    const currentChallengeDay = getCurrentChallengeDay(
      activeChallengeUserData.startDate,
      currentDay
    );

    try {
      this.unsubscribeFACD = db
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

    if (data) {
      data.forEach(res => {
        try {
          if (res.day === currentChallengeDay) {
            if (res.recipeMeal.breakfast) {
              recipe.push(res.recipeMeal.breakfast)
            }
            if (res.recipeMeal.lunch) {
              recipe.push(res.recipeMeal.lunch)
            }
            if (res.recipeMeal.dinner) {
              recipe.push(res.recipeMeal.dinner)
            }
            if (res.recipeMeal.snack) {
              recipe.push(res.recipeMeal.snack)
            }
            if (res.recipeMeal.drink) {
              recipe.push(res.recipeMeal.drink)
            }
            if (res.recipeMeal.preworkout) {
              recipe.push(res.recipeMeal.preworkout)
            }
            if (res.recipeMeal.treats) {
              recipe.push(res.recipeMeal.treats)
            }
          }
        } catch (err) { }
      })
    }

    convertRecipeData(recipe).then(res => {
      const resx = res.recipeResult

      const breakfastList = resx.filter((res) => res.breakfast === true)
      const lunchList = resx.filter((res) => res.lunch === true)
      const dinnerList = resx.filter((res) => res.dinner === true)
      const snackList = resx.filter((res) => res.snack === true)
      const drinkList = resx.filter((res) => res.drink === true)
      const preworkoutList = resx.filter((res) => res.preworkout === true)
      const treatsList = resx.filter((res) => res.treats === true)

      const recommendedMeal = [{
        breakfast: breakfastList,
        lunch: lunchList,
        dinner: dinnerList,
        snack: snackList,
        drink: drinkList,
        preworkout: preworkoutList,
        treats: treatsList,
      }]

      this.setState({
        favoriteRecipe: recommendedMeal
      })

    })

  };

  async getCurrentPhaseInfo() {
    const { activeChallengeUserData, activeChallengeData } = this.state;

    if (activeChallengeUserData && activeChallengeData) {
      this.setState({ loading: false });
      // const data = activeChallengeUserData.faveRecipe;
      const test = activeChallengeUserData.startDate;
      const transformLevel = activeChallengeUserData.displayName;

      if (this.stringDate >= test) {
        this.setState({ loading: true })
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

        const id = activeChallengeUserData.id
        const uid = await AsyncStorage.getItem("uid");
        const activeChallengeUserRef = db
          .collection("users")
          .doc(uid)
          .collection("challenges")
          .doc(id)

        activeChallengeUserRef.set({ "recipes": { "days": this.currentChallengeDay } }, { merge: true })

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
      title: "challenge dashboard",
      extraProps: { fromCalender: true },
    });
  }

  handleBack = () => {
    const { navigation } = this.props;
    navigation.pop();
  };
  
  getToFilter(data, data2, title) {
    const { challengeRecipe, activeChallengeData, phaseDefaultTags, activeChallengeUserData } = this.state

    // console.log('phaseDefaultTags: ', phaseDefaultTags.displayName)
    const datas = activeChallengeUserData.faveRecipe

    if (datas === undefined) {
      Alert.alert(
        "New Feature",
        "Favourite Recipe feature is now available.",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "OK",
            onPress: async () => {

              const number = 60
              const currentNumber = []

              for (let i = 1; i <= number; i++) {
                // console.log(i);
                const data = {
                  "day": i,
                  "recipeMeal": {
                    "breakfast": "",
                    "lunch": "",
                    "dinner": "",
                    "snack": "",
                    "drink": "",
                    "preworkout": "",
                    "treats": "",
                  }
                }
                currentNumber.push(data)
              }

              const id = this.state.activeChallengeUserData.id
              const uid = await AsyncStorage.getItem("uid");
              const activeChallengeUserRef = db
                .collection("users")
                .doc(uid)
                .collection("challenges")
                .doc(id)

              activeChallengeUserRef.set({ "faveRecipe": currentNumber }, { merge: true })

              this.handleBack()
            }
          }

        ]
      )
    }

    this.props.navigation.navigate('FilterRecipe', {
      currentChallengeDay: this.currentChallengeDay,
      activeChallengeUserData: activeChallengeUserData,
      phaseDefaultTags: phaseDefaultTags.phaseTags,
      defaultLevelTags: activeChallengeData.levelTags,
      todayRecommendedRecipe: data2,
      challengeAllRecipe: challengeRecipe[0],
      recipes: data,
      title: title,
    })
  }

  openLink = (url) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(url);
  };

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
      completeCha,
      todayRecommendedRecipe,
      favoriteRecipe
    } = this.state;

    let showRC = false;

    // console.log('favoriteRecipe: ', favoriteRecipe[0])

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
        <Text style={{
          fontFamily: fonts.bold,
          fontSize: wp("6.5%"),
          color: colors.charcoal.dark,
          marginVertical: wp("4%"),
          marginLeft: wp("8%"),
          textAlign: "left",
          width: '100%'
        }}>Today's Meals</Text>
        <TodayMealsList
          favoriteRecipe={favoriteRecipe[0]}
          todayRecommendedRecipe={todayRecommendedRecipe[0]}
          data={todayRecommendedMeal[0]}
          onPress={(res) => this.goToRecipe(res)}
          filterPress={(res, res2, title) => this.getToFilter(res, res2, title)}
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
    const getPhase = (phaseData) => {
      return (phaseData.name.substring(0, 5)
        + ' '
        + phaseData.name.substring(5, phaseData.name.length)).charAt(0).toUpperCase()
        + (phaseData.name.substring(0, 5)
          + ' '
          + phaseData.name.substring(5, phaseData.name.length)).slice(1);
    };
    const Progress = () => {
      return (
        <>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 15
          }}>
            <View style={{
              borderRadius: 3,
              backgroundColor: 'rgba(0,0,0,0.1)',
              padding: 5,
              borderBottomColor: 'rgba(0,0,0,0.1)',
              borderBottomWidth: 2,
            }}>
              <Text style={{
                color: '#656565',
                fontFamily: fonts.bold,
              }}>Day 1</Text>
            </View>
            <View style={{
              borderRadius: 3,
              backgroundColor: 'rgba(0,0,0,0.1)',
              padding: 5,
              borderBottomColor: 'rgba(0,0,0,0.1)',
              borderBottomWidth: 2,
            }}>
              <Text style={{
                color: '#656565',
                fontFamily: fonts.bold
              }}>Day {activeChallengeData.numberOfDays}</Text>
            </View>
          </View>

          <View
            onLayout={e => {
              const newWidth = e.nativeEvent.layout.width;
              this.setState({ width: newWidth });
            }}
            style={{
              height: 10,
              backgroundColor: 'rgba(0,0,0,0.1)',
              borderRadius: 10,
              overflow: 'hidden',
              marginTop: 10
            }}>
            <View style={{
              height: 10,
              width: (width * this.currentChallengeDay) / activeChallengeData.numberOfDays,
              borderRadius: 10,
              backgroundColor: colors.themeColor.fill,
              position: 'absolute',
              left: 0,
              top: 0
            }}></View>
          </View>
          <View style={{
            flexDirection: 'row',
            marginTop: 60
          }}>
            <View style={{
              backgroundColor: '#ffffff',
              // width: 104,
              borderRadius: 3,
              borderBottomColor: 'rgba(0,0,0,0.1)',
              borderBottomWidth: 1,
            }}>
              <Text style={{
                // fontSize: 18,
                fontFamily: fonts.bold
              }}>
                {this.transformLevel}

              </Text>

            </View>
            <Text style={{
              // fontSize: 18,
              fontFamily: fonts.bold,
              marginTop: 1,
              marginRight: 5,
              marginLeft: 5
            }}>{'>'}</Text>

            <View style={{
              backgroundColor: '#ffffff',
              // width: 74,
              borderRadius: 3,
              borderBottomColor: 'rgba(0,0,0,0.1)',
              borderBottomWidth: 1,
            }}>
              <Text style={{
                // fontSize: 18,
                fontFamily: fonts.bold
              }}>
                {getPhase(this.phaseData)}
              </Text>
            </View>
          </View>
          {/* <View style={{
            marginTop: hp("1%")
          }}>
            <Text style={{
              fontSize: 28,
              fontFamily: fonts.bold
            }}>
              {this.day}, {this.month} {this.date}
              </Text>
          </View> */}
          <View>
          </View>
          <View style={{ marginTop: 20, flex: 1 }}>
            <TouchableOpacity phase={this.phase} onPress={() => this.openLink(this.phase.pdfUrl)}>

              <View style={{ flex: 1 }}>
                <Icon
                  name="file-text-o"
                  size={20} />
              </View>

              <View style={{ marginTop: -20 }}>

                <Text
                  style=
                  {{
                    fontSize: 15,
                    fontFamily: fonts.bold,
                    paddingLeft: 25,

                  }}>
                  Phase guide doc
                </Text>

              </View>
              <View style={{ marginTop: -20, }}>
                <View style={{ paddingLeft: 20, alignItems: 'flex-end' }}>
                  <Icon name="arrow-right" size={18} />
                </View>
              </View>
              <View style={{ marginTop: 10 }}>
                <View
                  style=
                  {{
                    borderBottomColor: '#cccccc',
                    borderBottomWidth: 1,
                    width: '100%',
                  }}
                >

                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View elevation={5} style={{
            position: 'absolute',
            left: Platform.OS === "ios" ? ((width * this.currentChallengeDay) / activeChallengeData.numberOfDays) + 11 : ((width * this.currentChallengeDay) / activeChallengeData.numberOfDays) + 12,
            top: 85
          }}>
            <Svg
              id="prefix__Layer_1"
              viewBox="0 0 110 90"
              xmlSpace="preserve"
              width={hp("1.5%")}
              height={hp("1.5%")}
              fill={colors.themeColor.fill}
              style={{
                strokeWidth: 50,
                stroke: colors.themeColor.fill,
                strokeLinejoin: 'round',
                strokeLinecap: 'round',
                // shadowColor: '#171717',
                // shadowOffset: {width: 0, height: 0},
                // shadowOpacity: 0.2,
                // shadowRadius: 3,
              }}
            >
              <Path
                className="prefix__st0"
                d="M 55 46 L 87 90 L 22 90 z"
              />
            </Svg>
          </View>
          <View elevation={5} style={{
            position: 'absolute',
            left: Platform.OS === "ios" ? ((width * this.currentChallengeDay) / activeChallengeData.numberOfDays) - 7 : ((width * this.currentChallengeDay) / activeChallengeData.numberOfDays) - 7,
            top: Platform.OS === "ios" ? 96 : 94,
            backgroundColor: '#F79400',
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            borderRadius: 8,
            // shadowColor: '#171717',
            // shadowOffset: {width: 0, height: 5},
            // shadowOpacity: 0.2,
            // shadowRadius: 3,
          }}>
            <Text style={{
              fontFamily: fonts.GothamMedium,
              color: 'white',
              fontSize: 25
            }}>{this.currentChallengeDay}</Text>
          </View>
        </>
      )
    };

    const dayDisplay = (
      <ScrollView
        contentContainerStyle={calendarStyles.dayDisplayContainer}
        scrollEnabled={!this.state.isSwiping}
        showsVerticalScrollIndicator={false}
      >
        {this.phaseData && showRC && (
          <>
            <View style={{
              paddingVertical: 20,
              width: Dimensions.get("window").width,
              paddingHorizontal: 20
            }}>
              <Progress />
            </View>
            {/*<ChallengeProgressCard2*/}
            {/*    phase={this.phase}*/}
            {/*    phaseData={this.phaseData}*/}
            {/*    activeChallengeData={activeChallengeData}*/}
            {/*    activeChallengeUserData={activeChallengeUserData}*/}
            {/*    totalChallengeWorkoutsCompleted={*/}
            {/*      this.totalChallengeWorkoutsCompleted*/}
            {/*    }*/}
            {/*    openLink={() => this.openLink(this.phaseData.pdfUrl)}*/}
            {/*    currentDay={this.currentChallengeDay}*/}
            {/*/>*/}
          </>
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