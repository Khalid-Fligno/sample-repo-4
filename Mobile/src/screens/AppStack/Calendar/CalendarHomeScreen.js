import React from "react";
import PropTypes from "prop-types";
import {
  ScrollView,
  View,
  Text,
  Alert,
  Linking,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
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
import ChallengeWorkoutCard from "../../../components/Calendar/ChallengeWorkoutCard";
import TodayMealsList from "../../../components/Calendar/TodayMealsList";
import Modal from "react-native-modal";
import ChallengeSetting from "../../../components/Calendar/ChallengeSetting";
import moment from "moment";
import createUserChallengeData from "../../../components/Challenges/UserChallengeData";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { NavigationActions } from "react-navigation";
import OnBoardingNotification from "../../../components/Shared/OnBoardingNotification";
import { checkVersion } from "react-native-check-version";
import { getVersion } from "react-native-device-info";
import fonts from "../../../styles/fonts";
import Svg, { Path } from "react-native-svg";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/FontAwesome";

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
      AllRecipe: undefined,
      transformLevel: undefined,
      completeCha: undefined,
      todayRecommendedRecipe: undefined,
      phaseDefaultTags: undefined,
      favoriteRecipe: [],
      currentDay: undefined,
      downloaded: 0,
      totalToDownload: 0,
      files: undefined,
      newWorkoutParams: undefined,
      finishdownloaded: false
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
    this.checkSchedule();
    this.fetchRecipeChallenge();
    this.fetchActiveChallengeUserData();
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      this.onFocusFunction();
    });
  };

  componentDidUpdate = () => {
    if (this.state.files !== undefined) {
      this.state.downloaded++;
      if (this.state.totalToDownload === this.state.downloaded) {
        this.setState({
          finishdownloaded: true,
          files: undefined
        });
      }
    }
    if (this.state.newWorkoutParams !== undefined && this.state.finishdownloaded === true) {
      this.goToNext(this.state.newWorkoutParams)
    }
  };

  componentWillUnmount() {
    this.setState({
      downloaded: 0,
      totalToDownload: 0,
      files: undefined,
      loadingExercises: false,
      finishdownloaded: false
    });
    this.focusListener.remove();
    if (this.unsubscribeFACUD) {
      this.unsubscribeFACUD();
    }
    if (this.unsubscribeFACD) this.unsubscribeFACD();
    if (this.unsubscribeSchedule) this.unsubscribeSchedule();
  }

  async onFocusFunction() {
    console.log("On focus");
    await this.fetchUserData();
  }

  handleActiveChallengeSetting() {
    this.toggleSetting();
  }

  fetchRecipeChallenge = async () => {
    fetchRecipeData()
      .then((res) => {
        this.setState({
          AllRecipe: res,
          loading: false,
        })
      })
  }

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

    await activeChallengeUserRef.set(
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
    this.setState({ loading: true })
    const uid = await AsyncStorage.getItem("uid");
    const version = await checkVersion();
    const versionCodeRef = db
      .collection("users")
      .doc(uid)
      .set(
        {
          AppVersion:
            Platform.OS === "ios"
              ? String(version.version)
              : String(getVersion()),
        },
        { merge: true }
      );
    const userRef = db.collection("users").doc(uid);
    userRef
      .get()
      .then((res) => {
        const data = res.data();

        if (res.data()?.weeklyTargets === null) {
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
          loading: false,
          initialBurpeeTestCompleted: data?.initialBurpeeTestCompleted ?? false,
        });
      })
      .catch((reason) => console.log("Fetching user data error: ", reason));
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
    isActiveChallenge().then(async (res) => {
      const todayDate = moment(new Date()).format("YYYY-MM-DD");
      if (res && moment(res.startDate).isSame(todayDate) && res.isSchedule) {
        const challengeRef = db
          .collection("users")
          .doc(uid)
          .collection("challenges")
          .doc(res.id);

        await challengeRef.set(
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
  loadExercise = async (workoutData) => {
    const type = "interval";
    await FileSystem.readDirectoryAsync(`${FileSystem.cacheDirectory}`).then(
      (res) => {
        Promise.all(
          res.map(async (item, index) => {
            if (item.includes("exercise-")) {
              FileSystem.deleteAsync(`${FileSystem.cacheDirectory}${item}`, {
                idempotent: true,
              }).then(() => { });
            }
          })
        );
      }
    );

    if (workoutData.newWorkout) {
      let exercises = [];
      let tempExerciseData = [];
      let workoutExercises = [];

      const exerciseRef = (
        await db
          .collection("Exercises")

          .get()
      ).docs;

      workoutData.filters.forEach((resType) => {
        if (resType === "interval") {
          exerciseRef.forEach((exercise) => {
            workoutData.exercises
              .filter((resExercise) => resExercise.id === exercise.id)
              .forEach((resExercise) => {
                const exerciseDuration = Object.assign({}, exercise.data(), {
                  duration: resExercise.duration,
                });
                tempExerciseData.push(exerciseDuration);
              });
          });
          workoutExercises = workoutData.exercises.map((id) => {
            return tempExerciseData.find((res) => res.id === id);
          });
        } else {
          exerciseRef.forEach((exercise) => {
            workoutData.exercises
              .filter((resExercise) => resExercise === exercise.id)
              .forEach((resExercise) => {
                tempExerciseData.push(exercise.data());
              });
          });
          workoutExercises = workoutData.exercises.map((id) => {
            return tempExerciseData.find((res) => res.id === id);
          });
        }
      });

      exercises = workoutData.exercises.map((id) => {
        if (id.id) {
          return tempExerciseData.find((res) => res.id === id.id);
        } else {
          return tempExerciseData.find((res) => res.id === id);
        }
      });

      if (exercises.length > 0) {
        workoutData = Object.assign({}, workoutData, { exercises: exercises });
        const res = await this.downloadExercise(workoutData);
        if (res) return workoutData;
        else return false;
      } else {
        return false;
      }
    } else {
      const res = await this.downloadExercise(workoutData);
      return workoutData;
    }
  };

  downloadExercise = async (workout) => {
    try {
      const exercises = workout.exercises;
      let warmUpExercises = [];
      let coolDownExercises = [];

      if (workout.warmUpExercises) {
        const exerciseRef = (
          await db
            .collection("WarmUpCoolDownExercises")
            .where("id", "in", workout.warmUpExercises)
            .get()
        ).docs;

        const tempExerciseData =
          exerciseRef.map((exercise) => {
            return exercise.data();
          }) || [];

        warmUpExercises = workout.warmUpExercises.map((id) => {
          return tempExerciseData.find((res) => res.id === id);
        });
      }
      if (workout.coolDownExercises) {
        const exerciseRef = (
          await db
            .collection("WarmUpCoolDownExercises")
            .where("id", "in", workout.coolDownExercises)
            .get()
        ).docs;

        const tempExerciseData =
          exerciseRef.map((exercise) => {
            return exercise.data();
          }) || [];
        coolDownExercises = workout.coolDownExercises.map((id) => {
          return tempExerciseData.find((res) => res.id === id);
        });
      }

      return Promise.all(
        exercises.map(async (exercise, index) => {
          return new Promise(async (resolve, reject) => {
            let videoIndex = 0;
            if (workout.newWorkout)
              videoIndex = exercise.videoUrls.findIndex(
                (res) => res.model === workout.exerciseModel
              );
            if (exercise.videoUrls && exercise.videoUrls[0].url !== "") {
              const downloadResumable = FileSystem.createDownloadResumable(
                exercise.videoUrls[videoIndex !== -1 ? videoIndex : 0].url,
                `${FileSystem.cacheDirectory}exercise-${index + 1}.mp4`
              );
              await downloadResumable
                .downloadAsync()
                .then(() => {
                  resolve("Downloaded");
                  this.setState((prevState) => ({
                    files: !prevState.files,
                  }));
                })
                .catch(() => resolve("Error Download"));
            } else {
              resolve("no video found");
            }
          });
        }),
        warmUpExercises.map(async (exercise, index) => {
          return new Promise(async (resolve, reject) => {
            let videoIndex = 0;
            if (workout.newWorkout) {
              if (exercise.videoUrls && exercise.videoUrls?.length > 0) {
                videoIndex = exercise.videoUrls.findIndex(
                  (res) => res.model === workout.exerciseModel
                );
              }
            }
            if (exercise.videoUrls && exercise.videoUrls[0].url !== "") {
              const warmUP = FileSystem.createDownloadResumable(
                exercise.videoUrls[videoIndex !== -1 ? videoIndex : 0].url,
                `${FileSystem.cacheDirectory}warmUpExercise-${index + 1}.mp4`
              );
              await warmUP
                .downloadAsync()
                .then(() => {
                  resolve("Downloaded");
                  this.setState((prevState) => ({
                    files: !prevState.files,
                  }));
                })
                .catch((err) => resolve("Download failed"));
            } else {
              resolve("no video found");
            }
          });
        }),
        coolDownExercises.map(async (exercise, index) => {
          return new Promise(async (resolve, reject) => {
            let videoIndex = 0;
            if (workout.newWorkout) {
              if (exercise.videoUrls && exercise.videoUrls[0].url !== "") {
                videoIndex = exercise.videoUrls.findIndex(
                  (res) => res.model === workout.exerciseModel
                );
              }
            }

            if (exercise.videoUrls && exercise.videoUrls[0].url !== "") {
              const coolDown = FileSystem.createDownloadResumable(
                exercise.videoUrls[videoIndex !== -1 ? videoIndex : 0].url,
                `${FileSystem.cacheDirectory}coolDownExercise-${index + 1}.mp4`
              );
              await coolDown
                .downloadAsync()
                .then(() => {
                  resolve("Downloaded");
                  this.setState((prevState) => ({
                    files: !prevState.files,
                  }));
                })
                .catch((err) => resolve("Download failed"));
            } else {
              resolve("no video found");
            }
          });
        })
      );
    } catch (err) {
      console.log(err);
      Alert.alert("Something went wrong", "Workout Not Available");
      return "false";
    }
  };

  downloadExerciseWC = async (workout, exerciseIds, exerciseModel, type) => {
    try {
      let exercises = [];
      const exerciseRef = (
        await db
          .collection("WarmUpCoolDownExercises")
          .where("id", "in", exerciseIds)
          .get()
      ).docs;
      const tempExerciseData =
        exerciseRef.map((exercise) => {
          return exercise.data();
        }) || [];

      exercises =
        exerciseIds.map((id) => {
          return tempExerciseData.find((res) => res.id === id);
        }) || [];

      return Promise.all(
        exercises.map(async (exercise, index) => {
          return new Promise(async (resolve, reject) => {
            let videoIndex = 0;
            if (workout.newWorkout)
              videoIndex = exercise.videoUrls.findIndex(
                (res) => res.model === exerciseModel
              );
            if (exercise.videoUrls && exercise.videoUrls[0].url !== "") {
              const downloadResumable = FileSystem.createDownloadResumable(
                exercise.videoUrls[videoIndex].url,
                `${FileSystem.cacheDirectory}exercise-${type}-${index + 1}.mp4`,
                {}
              );
              await downloadResumable
                .downloadAsync()
                .then(() => {
                  resolve(exercise);
                  this.setState((prevState) => ({
                    files: !prevState.files,
                  }));
                })
                .catch(() => resolve("Error Download"));
            }
          });
        })
      );
    } catch (err) {
      console.log(err);
      Alert.alert("Something went wrong", "Workout Not Available");
      return "false";
    }
  };

  loadExercises = async (workoutData) => {
    this.setState({ loadingExercises: true });

    Object.assign(workoutData, {
      warmUpExercises: workoutData.warmUpExercises,
    });
    if (workoutData.newWorkout) {
      this.setState({
        totalToDownload:
          workoutData.exercises.length +
          workoutData.warmUpExercises.length +
          workoutData.coolDownExercises.length +
          workoutData.warmUpExercises.length +
          workoutData.coolDownExercises.length,
      });
    } else {
      this.setState({
        totalToDownload:
          workoutData.exercises.length +
          workoutData.warmUpExercises.length +
          workoutData.coolDownExercises.length,
      });
    }

    const workout = await this.loadExercise(workoutData);
    if (workout && workout.newWorkout) {
      const warmUpExercises = await this.downloadExerciseWC(
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
        const coolDownExercises = await this.downloadExerciseWC(
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
          this.setState({ newWorkoutParams: newWorkout })
        } else {
          this.setState({ loadingExercises: false });
          Alert.alert("Alert!", "Something went wrong!");
        }
      } else {
        this.setState({ loadingExercises: false });
        Alert.alert("Alert!", "Something went wrong!");
      }
    } else if (workout) {
      if (this.state.totalToDownload === this.state.downloaded) {
        this.goToNext(workout);
      }
    } else {
      this.setState({ loadingExercises: false });
    }
  };

  async goToNext(workout) {
    const fitnessLevel = await AsyncStorage.getItem("fitnessLevel", null);

    if (this.currentChallengeDay > 0) {
      Object.assign(workout, {
        displayName: `${workout.displayName} - Day ${this.currentChallengeDay}`,
      });
    }

    const { 
      assessmentVideo: { title: videoTitle, url: videoUrl }, 
    } = this.state.activeChallengeData?.strengthAssessment

    if (!this.state.initialBurpeeTestCompleted) {
      
      await FileSystem.downloadAsync(videoUrl, `${FileSystem.cacheDirectory}${encodeURIComponent(videoTitle)}.mp4`)

      this.props.navigation.navigate("Burpee1", {
        strengthAssessmentInfo: this.state.activeChallengeData?.strengthAssessment,
        fromScreen: "WorkoutInfo",
        screenReturnParams: {
          workout,
          reps: workout.difficultyLevel[fitnessLevel - 1].toString(),
          workoutSubCategory: workout.workoutSubCategory,
          fitnessLevel,
          extraProps: { fromCalender: true },
        },
      })
    } else {
      this.props.navigation.navigate("WorkoutInfo", {
        workout,
        reps: workout.difficultyLevel[fitnessLevel - 1].toString(),
        workoutSubCategory: workout.workoutSubCategory,
        fitnessLevel,
        extraProps: { fromCalender: true },
        transformRoute: true,
      });
    }

    this.setState({
      downloaded: 0,
      totalToDownload: 0,
      files: undefined,
      loadingExercises: false,
      finishdownloaded: false
    })
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
              this.props.navigation.navigate("ChallengeSubscription", {
                completedChallenge: true,
              });
              this.setState({ completeCha: isCompleted });
              setTimeout(() => {
                Alert.alert(
                  "Congratulations!",
                  "You have completed your challenge",
                  [
                    {
                      text: "OK",
                      onPress: () => {}
                    }
                  ],
                  { cancelable: false }
                );
              }, 5)
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
    }
  };

  fetchActiveChallengeData = async (activeChallengeUserData) => {
    const { currentDay } = this.state;

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

    let recipe = [];
    let breakfastId = [];
    let lunchId = [];
    let dinnerId = [];
    let snackId = [];
    let preworkoutId = [];
    let treatsId = [];
    const usersFavouriteRecipes = activeChallengeUserData.faveRecipe
      ?.find(day => day.day === currentChallengeDay)
      ?.recipeMeal

    if (usersFavouriteRecipes) {

      const idsForMeal = (idsContainer, ...propertyNames) => {
        // We need to perform data transformation for these properties inside the 'faveRecipe'
        // Currently the property types for breakfast, lunch, etc are just string.
        // We want to set them to be a type of Array<String> for future use.
        // We transform into an array and flatten it, if it was already an array flatting it should set to be an array still
        const recipeIds = propertyNames
          .flatMap(p => usersFavouriteRecipes[p]) // Get all collection of ids from multiple meal categories
          .filter(r => r?.trim()) // Remove any null/undefined/empty ids
        idsContainer.push(...recipeIds)
        recipe.push(...recipeIds)
      }

      idsForMeal(breakfastId, 'breakfast', )
      idsForMeal(lunchId, 'lunch')
      idsForMeal(dinnerId, 'dinner')
      idsForMeal(snackId, 'snack' ,'drink')
      idsForMeal(preworkoutId, 'preworkout')
      idsForMeal(treatsId, 'treat')

      this.setState({ skipped: activeChallengeUserData.onBoardingInfo.skipped ?? false })
    }

    convertRecipeData(recipe).then((recipeResult) => {
      const recipeLists = recipeResult.reduce((result, element) => {
        if (breakfastId.includes(element.id)) {
          result.breakfast.push(element)
        } else if (lunchId.includes(element.id)) {
          result.lunch.push(element)
        } else if (dinnerId.includes(element.id)) {
          result.dinner.push(element)
        } else if (snackId.includes(element.id)) {
          result.snack.push(element)
        } else if (preworkoutId.includes(element.id)) {
          result.preworkout.push(element)
        } else if (treatsId.includes(element.id)) {
          result.treats.push(element.id)
        }
        return result
      }, { 
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: [],
        preworkout: [],
        treats: [],
      })

      this.setState({favoriteRecipe: [recipeLists]})
    })
  }

  async getCurrentPhaseInfo() {
    const { activeChallengeUserData, activeChallengeData } = this.state;

    if (activeChallengeUserData && activeChallengeData) {
      this.setState({ loading: false });
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

        let newState = { favouriteRecipeConfigs: this.phaseData.favouriteRecipeConfigs }

        if (todayRcWorkout) newState.todayRcWorkout = todayRcWorkout
        else newState.todayRcWorkout = undefined

        this.setState(newState)
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
      title: "challenge",
      extraProps: { fromCalender: true },
    });
  }

  handleBack = () => {
    const { navigation } = this.props;
    navigation.pop();
  };

  getToFilter(data, data1, data2, title, configs) {
    const {
      activeChallengeData,
      phaseDefaultTags,
      activeChallengeUserData,
    } = this.state;

    const datas = activeChallengeUserData.faveRecipe;

    if (datas === undefined) {
      Alert.alert("New Feature", "Favourite Recipe feature is now available.", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            const number = 60;
            const currentNumber = [];

            for (let i = 1; i <= number; i++) {
              const data = {
                day: i,
                recipeMeal: {
                  breakfast: "",
                  lunch: "",
                  dinner: "",
                  snack: "",
                  drink: "",
                  preworkout: "",
                  treats: "",
                },
              };
              currentNumber.push(data);
            }

            const id = this.state.activeChallengeUserData.id;
            const uid = await AsyncStorage.getItem("uid");
            const activeChallengeUserRef = db
              .collection("users")
              .doc(uid)
              .collection("challenges")
              .doc(id);

            activeChallengeUserRef.set(
              { faveRecipe: currentNumber },
              { merge: true }
            );

            this.handleBack();
          },
        },
      ]);
    }

    this.props.navigation.navigate("FilterRecipe", {
      currentChallengeDay: this.currentChallengeDay,
      activeChallengeUserData: activeChallengeUserData,
      phaseDefaultTags: phaseDefaultTags,
      defaultLevelTags: activeChallengeData.levelTags,
      todayRecommendedRecipe: data2,
      configs: configs, 
      recipes: data,
      title: title,
      allRecipeData: data1,
    });
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
      AllRecipe,
      completeCha,
      todayRecommendedRecipe,
      favoriteRecipe,
      favouriteRecipeConfigs
    } = this.state;

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
    const mealsList = showRC && (
      <>
        <Text
          style={{
            fontFamily: fonts.bold,
            fontSize: wp("6.5%"),
            color: colors.charcoal.dark,
            marginVertical: wp("4%"),
            marginLeft: wp("8%"),
            textAlign: "left",
            width: "100%",
          }}
        >
          Today's Meals
        </Text>
        {AllRecipe && (
          <TodayMealsList
            recipe={AllRecipe}
            favoriteRecipe={favoriteRecipe[0]}
            todayRecommendedRecipe={todayRecommendedRecipe[0]}
            data={todayRecommendedMeal[0]}
            favouriteRecipeConfigs={favouriteRecipeConfigs}
            onPress={(res) => this.goToRecipe(res)}
            filterPress={(res, res1, res2, title, favouriteRecipeConfigs) =>
              this.getToFilter(res, res1, res2, title, favouriteRecipeConfigs)
            }
          />
        )}
      </>
    );
    const workoutCard =
      todayRcWorkout && showRC ? (
        <>
          <Text style={calendarStyles.headerText}>Today's Workout</Text>
          <View style={calendarStyles.listContainer}>
            <ChallengeWorkoutCard
              onPress={() =>
                todayRcWorkout.name && todayRcWorkout.name !== "rest"
                  ? this.loadExercises(todayRcWorkout)
                  : ""
              }
              res={todayRcWorkout}
              currentDay={this.currentChallengeDay}
              title={activeChallengeData.displayName}
            />
          </View>
        </>
      ) : showRC ? (
        <>
          <Text style={calendarStyles.headerText}>Today's Workout</Text>
          <View style={calendarStyles.listContainer}>
            <ChallengeWorkoutCard
              onPress={() => null}
              res={""}
              currentDay={this.currentChallengeDay}
              title={activeChallengeData.displayName}
            />
          </View>
        </>
      ) : null;
    const getPhase = (phaseData) => {
      return (
        (
          phaseData.name.substring(0, 5) +
          " " +
          phaseData.name.substring(5, phaseData.name.length)
        )
          .charAt(0)
          .toUpperCase() +
        (
          phaseData.name.substring(0, 5) +
          " " +
          phaseData.name.substring(5, phaseData.name.length)
        ).slice(1)
      );
    };
    const Progress = () => {
      return (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 15,
            }}
          >
            <View
              style={{
                borderRadius: 3,
                backgroundColor: "rgba(0,0,0,0.1)",
                padding: 5,
                borderBottomColor: "rgba(0,0,0,0.1)",
                borderBottomWidth: 2,
              }}
            >
              <Text
                style={{
                  color: "#656565",
                  fontFamily: fonts.bold,
                }}
              >
                Day 1
              </Text>
            </View>
            <View
              style={{
                borderRadius: 3,
                backgroundColor: "rgba(0,0,0,0.1)",
                padding: 5,
                borderBottomColor: "rgba(0,0,0,0.1)",
                borderBottomWidth: 2,
              }}
            >
              <Text
                style={{
                  color: "#656565",
                  fontFamily: fonts.bold,
                }}
              >
                Day {activeChallengeData.numberOfDays}
              </Text>
            </View>
          </View>

          <View
            onLayout={(e) => {
              const newWidth = e.nativeEvent.layout.width;
              this.setState({ width: newWidth });
            }}
            style={{
              height: 10,
              backgroundColor: "rgba(0,0,0,0.1)",
              borderRadius: 10,
              overflow: "hidden",
              marginTop: 10,
            }}
          >
            <View
              style={{
                height: 10,
                width:
                  (width * this.currentChallengeDay) /
                  activeChallengeData.numberOfDays,
                borderRadius: 10,
                backgroundColor: "#fa896e",
                position: "absolute",
                left: 0,
                top: 0,
              }}
            >
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: 60,
            }}
          >
            <View
              style={{
                backgroundColor: "#ffffff",
                // width: 104,
                borderRadius: 3,
                borderBottomColor: "rgba(0,0,0,0.1)",
                borderBottomWidth: 1,
              }}
            >
              <Text
                style={{
                  // fontSize: 18,
                  fontFamily: fonts.bold,
                }}
              >
                {this.transformLevel + " "}
              </Text>
            </View>
            <Text
              style={{
                // fontSize: 18,
                fontFamily: fonts.bold,
              }}
            >
              {getPhase(this.phaseData)}
            </Text>
          </View>

          <View style={{ marginTop: 20, flex: 1 }}>
            <TouchableOpacity
              phase={this.phase}
              onPress={() => this.openLink(this.phase.pdfUrl)}
            >
              <View style={{ flex: 1 }}>
                <Icon name="file-text-o" size={20} />
              </View>

              <View style={{ marginTop: -20 }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: fonts.bold,
                    paddingLeft: 25,
                  }}
                >
                  Phase guide doc
                </Text>
              </View>
              <View style={{ marginTop: -20 }}>
                <View style={{ paddingLeft: 20, alignItems: "flex-end" }}>
                  <Icon name="arrow-right" size={18} />
                </View>
              </View>
              <View style={{ marginTop: 10 }}>
                <View
                  style={{
                    borderBottomColor: "#cccccc",
                    borderBottomWidth: 1,
                    width: "100%",
                  }}
                ></View>
              </View>
            </TouchableOpacity>
          </View>
          <View
            elevation={5}
            style={{
              position: "absolute",
              left:
                Platform.OS === "ios"
                  ? (width * this.currentChallengeDay) /
                  activeChallengeData.numberOfDays +
                  11
                  : (width * this.currentChallengeDay) /
                  activeChallengeData.numberOfDays +
                  12,
              top: 85,
            }}
          >
            <Svg
              id="prefix__Layer_1"
              viewBox="0 0 110 90"
              xmlSpace="preserve"
              width={hp("1.5%")}
              height={hp("1.5%")}
              fill="#fa896e"
              style={{
                strokeWidth: 50,
                stroke: "#fa896e",
                strokeLinejoin: "round",
                strokeLinecap: "round",
              }}
            >
              <Path className="prefix__st0" d="M 55 46 L 87 90 L 22 90 z" />
            </Svg>
          </View>
          <View
            elevation={5}
            style={{
              position: "absolute",
              left:
                Platform.OS === "ios"
                  ? (width * this.currentChallengeDay) /
                  activeChallengeData.numberOfDays -
                  7
                  : (width * this.currentChallengeDay) /
                  activeChallengeData.numberOfDays -
                  7,
              top: Platform.OS === "ios" ? 96 : 94,
              backgroundColor: "#fa896e",
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                fontFamily: fonts.GothamMedium,
                color: "white",
                fontSize: 25,
              }}
            >
              {this.currentChallengeDay}
            </Text>
          </View>
        </>
      );
    };

    const dayDisplay = (
      <ScrollView
        contentContainerStyle={calendarStyles.dayDisplayContainer}
        scrollEnabled={!this.state.isSwiping}
        showsVerticalScrollIndicator={false}
      >
        {this.phaseData && showRC && (
          <>
            <View
              style={{
                paddingVertical: 20,
                width: Dimensions.get("window").width,
                paddingHorizontal: 20,
              }}
            >
              <Progress />
            </View>
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
        {dayDisplay}
        {setting}
        <Loader loading={loading} color={colors.red.standard} />
        <Loader
          progressive={true}
          loading={loadingExercises}
          downloaded={this.state.downloaded}
          totalToDownload={this.state.totalToDownload}
          color={colors.red.standard}
        />
      </View>
    );
  }
}

CalendarHomeScreen.propTypes = {
  setTimeout: PropTypes.func.isRequired,
};

export default ReactTimeout(CalendarHomeScreen);
