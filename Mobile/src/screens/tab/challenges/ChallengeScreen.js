import React, {
  useEffect,
  useState,
  useRef
} from "react"
import {
  Alert,
  Platform,
  Text,
  View
} from "react-native";
import moment from "moment";
import CustomCalendarStrip from "../../../components/Calendar/CustomCalendarStrip";
import { DayDisplayComponent } from "../../../components/tab/challenges/DayDisplayComponent";
import globalStyle from "../../../styles/globalStyles";
import { convertRecipeData, fetchRecipeData, getCurrentChallengeDay, getCurrentPhase, getTodayRecommendedMeal, getTodayRecommendedWorkout, getTotalChallengeWorkoutsCompleted, isActiveChallenge } from "../../../utils/challenges";
import { addDocument, addSubDocument } from "../../../hook/firestore/write";
import { getCollection, getDocument, getSpecificSubCollection } from "../../../hook/firestore/read";
import { COLLECTION_NAMES } from "../../../library/collections/index"
import { useStorage } from "../../../hook/storage"
import Loader from "../../../components/Shared/Loader";
import colors from "../../../styles/colors";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import calendarStyles from "../../AppStack/Calendar/calendarStyle";
import * as FileSystem from "expo-file-system";
import { downloadExerciseWC, loadExercise } from "../../../utils/workouts";
import { checkVersion } from "react-native-check-version";
import createUserChallengeData from "../../../components/Challenges/UserChallengeData";
import OnBoardingNotification from "../../../components/Shared/OnBoardingNotification";
import { SettingComponent } from "../../../components/tab/challenges/SettingComponent";
import { NavigationActions } from "react-navigation";

export const ChallengeScreen = ({ navigation }) => {
  const [CalendarSelectedDate, setCalendarSelectedDate] = useState();
  const [isSchedule, setIsSchedule] = useState(false);
  const [ScheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeChallengeData, setActiveChallengeData] = useState([]);
  const [activeChallengeUserData, setActiveChallengeUserData] = useState([]);
  const [todayRcWorkout, setTodayRcWorkout] = useState(undefined);
  const [currentDay, setCurrentDay] = useState(null);
  const [showRC, setShowRC] = useState(false)
  const [phaseData, setPhaseData] = useState(null);
  const [phase, setPhase] = useState([]);
  const [totalChallengeWorkoutsCompleted, setTotalChallengeWorkoutsCompleted] = useState(null);
  const [currentChallengeDay, setCurrentChallengeDay] = useState(null);
  const [transformLevel, setTransformLevel] = useState(undefined);
  const [loadingExercises, setLoadingExercises] = useState()
  const [totalToDownload, setTotalToDownload] = useState()
  const [newWorkoutParams, setNewWorkoutParams] = useState()
  const [initialBurpeeTestCompleted, setInitialBurpeeTestCompleted] = useState(false)
  const [completeCha, setCompleteCha] = useState(false)
  const [todayRecommendedRecipe, setTodayRecommendedRecipe] = useState([])
  const [todayRecommendedMeal, setTodayRecommendedMeal] = useState([])
  const [challengeMealsFilterList, setChallengeMealsFilterList] = useState([])
  const [phaseDefaultTags, setPhaseDefaultTags] = useState(undefined)
  const [skipped, setSkipped] = useState(false)
  const [isSettingVisible, setIsSettingVisible] = useState(false)
  const [AllRecipe, setAllRecipe] = useState([])
  const [challengeRecipe, setChallengeRecipe] = useState([])
  const [favoriteRecipe, setFavoriteRecipe] = useState([])
  const calendarStrip = useRef(null)

  const fetchUserAndChallengeData = async () => {
    // start loading
    setLoading(true)
    const uid = await useStorage.getItem("uid");
    const userRef = await getDocument(
      COLLECTION_NAMES.USERS,
      uid
    )
    const challengeRef = await getCollection(
      COLLECTION_NAMES.CHALLENGES,
    )

    if (userRef || challengeRef) {
      const getInitialBurpeeTestCompleted = userRef?.initialBurpeeTestCompleted ?? false
      const isWeeklyTargetsAdded = await setWeeklyTargets(userRef)
      const challengeData = await challengesData(challengeRef)
      const isPlatformDataAdded = setPlatformData(userRef)

      if (
        !isWeeklyTargetsAdded &&
        !isPlatformDataAdded
      ) {
        console.log("Error isWeeklyTargetsAdded")
      }

      setAllRecipe(challengeData.challenges.recommendedRecipe[0])
      setChallengeRecipe(challengeData.challengeLevel[0])
      setInitialBurpeeTestCompleted(getInitialBurpeeTestCompleted)
      fetchActiveChallengeUserData(userRef.id)
    }
  }

  const fetchActiveChallengeUserData = async (uid) => {
    try {
      const list = [];
      const getUserChallengeActive = await getSpecificSubCollection(
        COLLECTION_NAMES.USERS,
        COLLECTION_NAMES.CHALLENGES,
        "status",
        uid,
        "Active"
      )

      if (!getUserChallengeActive) {
        console.log('Error getUserChallengeActive')
        return undefined
      }

      getUserChallengeActive.forEach((doc) => {
        list.push(doc.data());
      })

      const activeChallengeEndDate = list[0] ? list[0].endDate : null;
      const currentDate = moment().format("YYYY-MM-DD");
      const isCompleted = moment(currentDate).isSameOrAfter(
        activeChallengeEndDate
      );

      if (list[0] && !isCompleted) {
        fetchActiveChallengeData(list[0], currentDate);
      } else {
        if (isCompleted) {
          const newData = createUserChallengeData(
            { ...list[0], status: "InActive" },
            new Date()
          );
          const challengeRef = await addSubDocument(
            COLLECTION_NAMES.USERS,
            COLLECTION_NAMES.CHALLENGES,
            uid,
            list[0].id,
            newData
          )

          if (!challengeRef) {
            console.log('Error challengeRef')
          }

          setCompleteCha(isCompleted)
          navigation.navigate("ChallengeSubscription", {
            completedChallenge: true,
          });
          Alert.alert(
            "Congratulations!",
            "You have completed your challenge",
            [{ text: "OK", onPress: () => { } }],
            { cancelable: false }
          );
        } else {
          setActiveChallengeUserData(undefined)
          setLoading(false)
        }
      }
    } catch (err) {
      setLoading(false)
      console.log(err);
    }
  };

  const getFavoriteRcipe = async (
    activeChallengeUserData,
    currentDay
  ) => {
    const faveRecipe = activeChallengeUserData?.faveRecipe
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
      faveRecipe.forEach((res) => {

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
      });
    } catch (err) {
      console.log('Error faveRecipe: ', err)
    }

    const recipeList = await convertRecipeData(recipe)

    if (recipeList) {
      const recipes = recipeList.recipeResult;
      const breakfastList = recipes.filter((res) => res.id === breakfastId[0]);
      const lunchList = recipes.filter((res) => res.id === lunchId[0]);
      const dinnerList = recipes.filter((res) => res.id === dinnerId[0]);
      const snackList = recipes.filter((res) => res.id === snackId[0]);
      const drinkList = recipes.filter((res) => res.id === drinkId[0]);
      const preworkoutList = recipes.filter((res) => res.id === preworkoutId[0]);
      const treatsList = recipes.filter((res) => res.id === treatsId[0]);
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

      return {
        recommendedMeal
      }
    }

  }

  const fetchActiveChallengeData = async (
    activeChallengeUserData,
    currentDay
  ) => {
    try {
      const getActiveChallenge = await getDocument(
        COLLECTION_NAMES.CHALLENGES,
        activeChallengeUserData.id
      )

      if (
        getActiveChallenge &&
        activeChallengeUserData
      ) {
        const getSkipped = activeChallengeUserData.onBoardingInfo.skipped ?? false
        const favoriteRecipe = await getFavoriteRcipe(
          activeChallengeUserData,
          currentDay
        )

        setFavoriteRecipe(favoriteRecipe.recommendedMeal[0])
        setActiveChallengeUserData(activeChallengeUserData)
        setActiveChallengeData(getActiveChallenge)
        fetchCalendarEntries(
          activeChallengeUserData,
          getActiveChallenge
        )
        setSkipped(getSkipped)
      }
    } catch (err) {
      setLoading(false)
      console.log("Fetch active challenge data error! ", err);
    }
  };

  const challengesData = async (challengeRef) => {
    const documents = challengeRef.docs.map((doc) => doc.data());
    const ids = {
      level_1: "88969d13-fd11-4fde-966e-df1270fb97dd",
      level_2: "7798f53c-f613-435d-b94b-b67f1f43b51b",
      level_3: "0d48d056-2623-4201-b25a-3f1d78083dba",
    }
    const level_1 = documents.filter((res) => {
      if (res.id === ids.level_1) {
        return res.id;
      }
    });
    const level_2 = documents.filter((res) => {
      if (res.id === ids.level_2) {
        return res.id;
      }
    });
    const level_3 = documents.filter((res) => {
      if (res.id === ids.level_3) {
        return res.id;
      }
    });
    const challengeLevel = [
      {
        level1: level_1,
        level2: level_2,
        level3: level_3,
      },
    ];

    const challenges = await fetchRecipeData(challengeLevel)

    return {
      challenges,
      challengeLevel
    }
  }

  const setWeeklyTargets = async (userRef) => {
    if (!userRef?.weeklyTargets) {
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
      }

      const isWeeklyTargetsAdded = await addDocument(
        COLLECTION_NAMES.USERS,
        userRef.id,
        data
      )

      return isWeeklyTargetsAdded
    }
  }

  const setPlatformData = async (userRef) => {
    const version = await checkVersion();
    const data = {
      AppVersion:
        Platform.OS === "ios"
          ? String(version.version)
          : String(getVersion()),
    }

    return await addDocument(
      COLLECTION_NAMES.USERS,
      userRef.id,
      data
    )
  }

  const getCurrentPhaseInfo = async (
    activeChallengeUserData,
    activeChallengeData,
    stringDate
  ) => {

    if (activeChallengeUserData && activeChallengeData) {
      const test = activeChallengeUserData.startDate;
      const transformLevel = activeChallengeUserData.displayName;
      setTransformLevel(transformLevel)

      if (stringDate >= test) {
        setLoading(true)
      }

      const phase = getCurrentPhase(
        activeChallengeUserData.phases,
        stringDate
      );

      if (phase) {
        setPhase(phase)
        //TODO :fetch the current phase data from Challenges collection
        const phaseData = activeChallengeData.phases.filter(
          (res) => res.name === phase.name ? res : null
        )[0];

        if (!phaseData) {
          return null
        }
        setPhaseData(phaseData)

        //TODO get recommended workout here
        const todayRcWorkout = (
          await getTodayRecommendedWorkout(
            activeChallengeData.workouts,
            activeChallengeUserData,
            stringDate
          )
        )[0];

        // TODO getToday one recommended meal randomly
        const getTodayRecommendedMeals = await getTodayRecommendedMeal(phaseData, activeChallengeData)

        if (todayRcWorkout && getTodayRecommendedMeals) {
          setLoading(false)
          setTodayRcWorkout(todayRcWorkout);
          setTodayRecommendedRecipe(getTodayRecommendedMeals.recommendedRecipe[0])
          setTodayRecommendedMeal(getTodayRecommendedMeals.recommendedMeal[0])
          setChallengeMealsFilterList(getTodayRecommendedMeals.challengeMealsFilterList)
          setPhaseDefaultTags(getTodayRecommendedMeals.phaseDefaultTags)
        } else {
          setLoading(false)
          setTodayRcWorkout(undefined);
          setTodayRecommendedRecipe(getTodayRecommendedMeals.recommendedRecipe[0])
          setTodayRecommendedMeal(getTodayRecommendedMeals.recommendedMeal[0])
          setChallengeMealsFilterList(getTodayRecommendedMeals.challengeMealsFilterList)
          setPhaseDefaultTags(getTodayRecommendedMeals.phaseDefaultTags)
        }

        //TODO :calculate the workout completed till selected date
        const totalChallengeWorkoutsCompleted =
          getTotalChallengeWorkoutsCompleted(
            activeChallengeUserData,
            stringDate
          );

        if (!totalChallengeWorkoutsCompleted) {
          return null
        }
        setTotalChallengeWorkoutsCompleted(totalChallengeWorkoutsCompleted)
      }
    } else {
      setLoading(false)
      console.log('Something went wrong please try again')
    }
  }

  const checkScheduleChallenge = async (
    activeChallengeUserData,
    activeChallengeData,
    stringDate
  ) => {
    console.log('checkScheduleChallenge')
    const activeChallenge = activeChallengeUserData

    if (!activeChallenge) {
      console.log('Error activeChallenge')
    }

    if (
      activeChallenge &&
      moment(activeChallenge.startDate).isSame(stringDate) &&
      activeChallenge.isSchedule
    ) {
      const data = { status: "Active", isSchedule: true }
      const isStatusAndScheduleAdded = await addSubDocument(
        COLLECTION_NAMES.USERS,
        COLLECTION_NAMES.CHALLENGES,
        uid,
        activeChallenge.id,
        data
      )

      if (!isStatusAndScheduleAdded) {
        console.log('User status and isSchedule not added')
      }
    } else if (activeChallenge && activeChallenge.isSchedule) {
      const isBetween = moment(currentDay).isBetween(
        activeChallenge.startDate,
        activeChallenge.endDate,
        undefined,
        "[]"
      );
      const data = { status: "Active", isSchedule: true }
      const isStatusAndScheduleAdded = await addSubDocument(
        COLLECTION_NAMES.USERS,
        COLLECTION_NAMES.CHALLENGES,
        uid,
        activeChallenge.id,
        data
      )

      if (!isStatusAndScheduleAdded) {
        console.log('User status and isSchedule not added')
      }
      if (!isSchedule) {
        setLoading(true)
        setScheduleData(activeChallenge)
        fetchActiveChallengeData(activeChallenge, stringDate);
        setCalendarSelectedDate(moment(activeChallenge.startDate))
        setCurrentDay(activeChallenge.startDate);
        setIsSchedule(true)
      }
      if (isBetween) {
        setScheduleData(activeChallenge)
        setIsSchedule(true)
        if (!activeChallengeData) {
          fetchActiveChallengeData(activeChallenge, stringDate);
        } else {
          getCurrentPhaseInfo(
            activeChallengeUserData,
            activeChallengeData,
            stringDate
          );
        }
      } else {
        setLoading(true)
        setScheduleData(activeChallenge)
        setIsSchedule(true)
      }
    } else {
      setLoading(false)
      const isBetween = moment(currentDay).isBetween(
        activeChallenge.startDate,
        activeChallenge.endDate,
        undefined,
        "[]"
      );

      if (isBetween) {
        setScheduleData(activeChallenge)
        setIsSchedule(true)
        if (!activeChallengeData) {
          fetchActiveChallengeData(activeChallenge, stringDate);
        } else {
          getCurrentPhaseInfo(
            activeChallengeUserData,
            activeChallengeData,
            stringDate
          );
        }
      } else {
        setLoading(false)
        setScheduleData(activeChallenge)
        setIsSchedule(true)
      }
    }
  }

  const fetchCalendarEntries = (
    activeChallengeUserData,
    activeChallengeData
  ) => {
    const selectedDate = calendarStrip.current.getSelectedDate();
    //Todo :call the function to get the data of current date
    handleDateSelected(
      selectedDate,
      activeChallengeUserData,
      activeChallengeData
    );
  };

  const handleDateSelected = async (
    date,
    activeChallengeUserData,
    activeChallengeData
  ) => {
    const stringDate = date.format("YYYY-MM-DD").toString()
    setCurrentDay(stringDate)

    const currentChallengeDay = getCurrentChallengeDay(
      activeChallengeUserData.startDate,
      stringDate
    );

    setCurrentChallengeDay(currentChallengeDay)
    console.log('currentChallengeDay: ', currentChallengeDay)

    const data = {
      recipes: {
        days: currentChallengeDay
      }
    }
    const uid = await useStorage.getItem("uid");
    const isCurrentChallengeDayAdded = await addSubDocument(
      COLLECTION_NAMES.USERS,
      COLLECTION_NAMES.CHALLENGES,
      uid,
      activeChallengeUserData.id,
      data
    )

    if (!isCurrentChallengeDayAdded) {
      console.log('Error isCurrentChallengeDayAdded')
    }

    //TODO:check the active challenge cndtns
    if (
      activeChallengeData &&
      activeChallengeUserData &&
      activeChallengeUserData.status === "Active" &&
      new Date(activeChallengeUserData.startDate).getTime() <=
      new Date(stringDate).getTime() &&
      new Date(activeChallengeUserData.endDate).getTime() >=
      new Date(stringDate).getTime()
    ) {
      console.log('Pass getCurrentPhaseInfo')
      getCurrentPhaseInfo(
        activeChallengeUserData,
        activeChallengeData,
        stringDate
      );
    } else {
      if (!activeChallengeUserData.isSchedule) {
        console.log('Pass checkScheduleChallenge')
        checkScheduleChallenge(
          activeChallengeUserData,
          activeChallengeData,
          stringDate
        );
      } else {
        const isBetween = moment(stringDate).isBetween(
          activeChallengeUserData.startDate,
          activeChallengeUserData.endDate,
          undefined,
          "[]"
        );
        if (isBetween) getCurrentPhaseInfo(
          activeChallengeUserData,
          activeChallengeData
        );
        else {
          setLoading(false)
        }
      }
    }

    const isBetween = moment(stringDate).isBetween(
      activeChallengeUserData.startDate,
      activeChallengeUserData.endDate,
      undefined,
      "[]"
    );

    if (
      calendarStrip.current &&
      isBetween
    ) {
      setShowRC(true);
    } else {
      setShowRC(false);
    }
  }

  const loadExercises = async (workoutData) => {
    setLoading(true)

    Object.assign(workoutData, {
      warmUpExercises: workoutData.warmUpExercises,
    });

    if (workoutData.newWorkout) {
      const getTotalDownload =
        workoutData.exercises.length +
        workoutData.warmUpExercises.length +
        workoutData.coolDownExercises.length +
        workoutData.warmUpExercises.length +
        workoutData.coolDownExercises.length

      console.log('getTotalDownload: ', getTotalDownload)
      setTotalToDownload(getTotalDownload)
    } else {
      const getTotalDownload =
        workoutData.exercises.length +
        workoutData.warmUpExercises.length +
        workoutData.coolDownExercises.length

      setTotalToDownload(getTotalDownload)
    }

    const workout = await loadExercise(workoutData);
    console.log('workout: ', workout)

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
      console.log('warmUpExercises: ', warmUpExercises)

      if (warmUpExercises.length > 0) {
        const coolDownExercises = await downloadExerciseWC(
          workout,
          workout.coolDownExercises,
          workout.coolDownExerciseModel,
          "coolDown"
        );
        console.log('coolDownExercises: ', coolDownExercises)

        if (coolDownExercises.length > 0) {
          const newWorkout = Object.assign({}, workout, {
            warmUpExercises: warmUpExercises,
            coolDownExercises: coolDownExercises,
          });
          // if (this.state.totalToDownload === this.state.downloaded) {
          //   this.goToNext(newWorkout);
          // }
          goToNext(newWorkout)
        } else {
          // this.setState({ loadingExercises: false });
          Alert.alert("Alert!", "Something went wrong!");
        }
      } else {
        // this.setState({ loadingExercises: false });
        Alert.alert("Alert!", "Something went wrong!");
      }
    } else if (workout) {
      if (totalToDownload === downloaded) {
        goToNext(workout);
      }
    } else {
      // this.setState({ loadingExercises: false });
    }
  }

  const goToNext = async (workout) => {
    const fitnessLevel = await useStorage.getItem("fitnessLevel", null);
    setLoading(false)

    if (currentChallengeDay > 0) {
      Object.assign(workout, {
        displayName: `${workout.displayName} - Day ${currentChallengeDay}`,
      });
    }

    if (!initialBurpeeTestCompleted) {
      await FileSystem.downloadAsync(
        "https://firebasestorage.googleapis.com/v0/b/staging-fitazfk-app.appspot.com/o/videos%2FBURPEE%20(2).mp4?alt=media&token=9ae1ae37-6aea-4858-a2e2-1c917007803f",
        `${FileSystem.cacheDirectory}exercise-burpees.mp4`
      );

      navigation.navigate("Burpee1", {
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
      navigation.navigate("WorkoutInfo", {
        workout,
        reps: workout.difficultyLevel[fitnessLevel - 1].toString(),
        workoutSubCategory: workout.workoutSubCategory,
        fitnessLevel,
        extraProps: { fromCalender: true },
        transformRoute: true,
      });
    }
  }

  const resetActiveChallengeUserData = () => {
    navigation.reset(
      [NavigationActions.navigate({ routeName: "CalendarHome" })],
      0
    );
  };

  const handleActiveChallengeSetting = () => {
    toggleSetting();
  }

  const toggleSetting = () => {
    setIsSettingVisible(!isSettingVisible)
  };

  useEffect(() => {
    navigation.setParams({
      activeChallengeSetting: () => handleActiveChallengeSetting(),
    });
  }, [])

  useEffect(() => {
    fetchUserAndChallengeData()
  }, [])


  // console.log('ScheduleData: ', ScheduleData)
  // console.log('isSchedule: ', isSchedule)
  // console.log('showRC: ', showRC)
  // console.log('loading: ', loading)

  return (
    <View style={[globalStyle.container, { paddingHorizontal: 0 }]}>
      <CustomCalendarStrip
        ref1={calendarStrip}
        onDateSelected={(date) => {
          handleDateSelected(
            date,
            activeChallengeUserData,
            activeChallengeData
          );
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
          navigation={navigation}
          data={activeChallengeUserData}
        />
      )}
      <DayDisplayComponent
        phase={phase}
        phaseData={phaseData}
        showRC={showRC}
        activeChallengeData={activeChallengeData}
        currentChallengeDay={currentChallengeDay}
        transformLevel={transformLevel}
        todayRcWorkout={todayRcWorkout}
        loadExercises={loadExercises}
        AllRecipe={AllRecipe}
        favoriteRecipe={favoriteRecipe}
        todayRecommendedRecipe={todayRecommendedRecipe}
        todayRecommendedMeal={todayRecommendedMeal}
        setLoading={setLoading}
        navigation={navigation}
        activeChallengeUserData={activeChallengeUserData}
        phaseDefaultTags={phaseDefaultTags}
        challengeRecipe={challengeRecipe}
      />
      <SettingComponent
        isSettingVisible={isSettingVisible}
        currentDay={currentDay}
        activeChallengeUserData={activeChallengeUserData}
        activeChallengeData={activeChallengeData}
        isSchedule={isSchedule}
        navigation={navigation}
        fetchCalendarEntries={fetchCalendarEntries}
        resetActiveChallengeUserData={resetActiveChallengeUserData}
        completeCha={completeCha}
        toggleSetting={toggleSetting}
        ScheduleData={ScheduleData}
      />
      <Loader
        loading={loading}
        color={colors.red.standard}
      // text={loading ? 'Please wait we are loading workout' : null}
      />
    </View>
  );
}