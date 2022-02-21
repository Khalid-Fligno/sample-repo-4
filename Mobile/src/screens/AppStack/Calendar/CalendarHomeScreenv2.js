import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  ScrollView,
  View,
  Text,
  Alert,
  Linking,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import * as FileSystem from "expo-file-system";
import firebase from "firebase";
import ReactTimeout from "react-timeout";
import { db } from "../../../../config/firebase";
import Loader from "../../../components/Shared/Loader";
import colors from "../../../styles/colors";
import globalStyle from "../../../styles/globalStyles";
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
import { downloadExerciseWC, loadExercise } from "../../../utils/workouts";
import { checkVersion } from "react-native-check-version";
import { getVersion } from "react-native-device-info";
import fonts from "../../../styles/fonts";
import Svg, { Path } from "react-native-svg";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  LEVEL_1_TAG,
  LEVEL_2_TAG,
  LEVEL_3_TAG,
} from "../../../library/constants";
import { isDateSameorAfterCurrent } from "../../../utils/helpers";
import {
  convertRecipeDataCalendar,
  fetchActiveChallengeDataLib,
  fetchActiveChallengeUserDataLib,
  getChallengeLevels,
} from "../../../library/CalendarHomeScreen.lib";

const CalendarHomeScreen = (props) => {
  const { navigation } = props;
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSwiping, setisSwiping] = useState(false);
  const [dayOfWeek, setDayOfWeek] = useState(null);
  const [activeChallengeUserData, setActiveChallengeUserData] = useState(null);
  const [meals, setMeals] = useState(null);

  const [activeChallengeData, setActiveChallengeData] = useState(null);
  const [todayRecommendedMeal, setTodayRecommendedMeal] = useState(null);
  const [challengeMealsFilterList, setChallengeMealsFilterList] =
    useState(null);
  const [isSettingVisible, setIsSettingVisible] = useState(false);
  const [isSchedule, setIsSchedule] = useState(false);
  const [ScheduleData, setScheduleData] = useState(null);
  const [CalendarSelectedDate, setCalendarSelectedDate] = useState(null);
  const [todayRcWorkout, setTodayRcWorkout] = useState(null);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [initialBurpeeTestCompleted, setInitialBurpeeTestCompleted] =
    useState(null);
  const [width, setWidth] = useState(0);
  const [AllRecipe, setAllRecipe] = useState([]);
  const [challengeRecipe, setChallengeRecipe] = useState([]);
  const [transformLevel, setTransformLevel] = useState(null);
  const [completeCha, setCompleteCha] = useState(null);
  const [todayRecommendedRecipe, setTodayRecommendedRecipe] = useState(null);
  const [phaseDefaultTags, setPhaseDefaultTags] = useState(null);
  const [favoriteRecipe, setFavoriteRecipe] = useState([]);
  const [currentDay, setCurrentDay] = useState(null);
  const [activeChallengeEndDate, setActiveChallengeEndDate] = useState(null);

  const calendarStrip = useRef();

  const toggleSetting = () => {
    setIsSettingVisible((prev) => !prev);
  };

  useEffect(() => {
    (async () => {
      if (activeChallengeEndDate) {
        await fetchActiveChallengeData(activeChallengeEndDate);

        return () => {
          fetchActiveChallengeData(activeChallengeEndDate);
        };
      }
    })();
  }, [activeChallengeEndDate]);

  useEffect(() => {
    navigation.setParams({
      toggleHelperModal: undefined,
    });

    navigation.setParams({
      activeChallengeSetting: () => toggleSetting(),
    });

    checkSchedule();
    fetchRecipeChallenge();
    fetchActiveChallengeUserData();
    return () => {
      checkSchedule();
      fetchRecipeChallenge();
      fetchActiveChallengeUserData();
    };
  }, []);

  const checkSchedule = async () => {
    try {
      const res = await isActiveChallenge();
      const isBetween = moment(stringDate).isBetween(
        res.startDate,
        res.endDate,
        undefined,
        "[]"
      );
      if (!isBetween) {
        setIsSchedule(true);
        setScheduleData(res);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRecipeChallenge = async () => {
    return await db
      .collection("challenges")
      .get()
      .then((querySnapshot) => {
        const documents = querySnapshot.docs.map((doc) => doc.data());

        const challengeLevel = documents
          ? getChallengeLevels(documents)
          : [
              {
                level1: [],
                level2: [],
                level3: [],
              },
            ];

        fetchRecipeData(challengeLevel).then((res) => {
          setAllRecipe(res.recommendedRecipe);
          setLoading(true);
        });
        setChallengeRecipe(challengeLevel);
      });
  };

  const fetchActiveChallengeUserData = async () => {
    try {
      setLoading(true);
      const uid = await AsyncStorage.getItem("uid");
      const unsubscribe = db
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
          const isCompleted = isDateSameorAfterCurrent(activeChallengeEndDate);

          if (list[0] && !isCompleted) {
            setActiveChallengeEndDate(activeChallengeEndDate);
            // fetchActiveChallengeData(list[0]);
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
              setCompleteCha(isCompleted);
              navigation.navigate("ChallengeSubscription", {
                completedChallenge: true,
              });
              Alert.alert(
                "Congratulations!",
                "You have completed your challenge",
                [{ text: "OK", onPress: () => {} }],
                { cancelable: false }
              );
            } else {
              setActiveChallengeUserData(null);
              setLoading(false);
            }
          }
        });

      return unsubscribe;
    } catch (err) {
      setLoading(false);
      console.log(err);
      console.log("Fetch active challenge user data error!");
    }
  };

  const fetchActiveChallengeData = async (activeChallengeUserDataProp) => {
    let data = activeChallengeUserDataProp.faveRecipe;
    let recipe = [];
    let breakfastId = [];
    let lunchId = [];
    let dinnerId = [];
    let snackId = [];
    let drinkId = [];
    let preworkoutId = [];
    let treatsId = [];

    const currentChallengeDay = getCurrentChallengeDay(
      activeChallengeUserDataProp.startDate,
      currentDay
    );

    try {
      const unsubscribe = db
        .collection("challenges")
        .doc(await activeChallengeUserDataProp.id)
        .onSnapshot((doc) => {
          if (doc.exists) {
            setActiveChallengeUserData(activeChallengeUserDataProp);
            setActiveChallengeData(doc.data());
            setTimeout(() => {
              this.getCurrentPhaseInfo();
            }, 500);
          }
        });

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
        setSkipped(activeChallengeUserDataProp.onBoardingInfo.skipped ?? false);
      }

      const recommendedMeal = await convertRecipeDataCalendar(
        recipe,
        breakfastId,
        dinnerId,
        lunchId,
        snackId,
        drinkId,
        preworkoutId,
        treatsId
      );
      setFavoriteRecipe(recommendedMeal);

      return unsubscribe;
    } catch (err) {
      setLoading(false);
      console.log(err);
      console.log("Fetch active challenge data error!");
    }
  };

  const getCurrentPhaseInfo = async () => {
    if (activeChallengeUserData && activeChallengeData) {
      setLoading(false);
      const test = activeChallengeUserData.startDate;
      const transformLevel = activeChallengeUserData.displayName;

      if (this.stringDate >= test) {
        setLoading(true);
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
  };
};

export default CalendarHomeScreen;
