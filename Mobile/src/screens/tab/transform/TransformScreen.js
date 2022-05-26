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
import { DayDisplayComponent } from "../../../components/tab/transform/DayDisplayComponent";
import globalStyle from "../../../styles/globalStyles";
import {
  convertRecipeData,
  fetchRecipeData,
  getCurrentChallengeDay,
  getCurrentPhase,
  getTodayRecommendedMeal,
  getTodayRecommendedWorkout,
} from "../../../utils/challenges";
import { addDocument, addSubDocument } from "../../../hook/firestore/write";
import {
  getCollection,
  getDocument,
  getSpecificSubCollectionTransForm
} from "../../../hook/firestore/read";
import { COLLECTION_NAMES } from "../../../library/collections/index"
import { useStorage } from "../../../hook/storage"
import Loader from "../../../components/Shared/Loader";
import colors from "../../../styles/colors";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import * as FileSystem from "expo-file-system";
import { downloadExerciseWC, loadExercise } from "../../../utils/workouts";
import { checkVersion } from "react-native-check-version";
import createUserChallengeData from "../../../components/Challenges/UserChallengeData";
import OnBoardingNotification from "../../../components/Shared/OnBoardingNotification";
import { SettingComponent } from "../../../components/tab/transform/SettingComponent";
import { NavigationActions } from "react-navigation";

export const TransformScreen = ({ navigation }) => {
  const [CalendarSelectedDate, setCalendarSelectedDate] = useState();
  const [isSchedule, setIsSchedule] = useState(false);
  const [ScheduleData, setScheduleData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [activeChallengeData, setActiveChallengeData] = useState([]);
  const [activeChallengeUserData, setActiveChallengeUserData] = useState([]);
  const [todayRcWorkout, setTodayRcWorkout] = useState(undefined);
  const [currentDay, setCurrentDay] = useState(null);
  const [showRC, setShowRC] = useState(false)
  const [phaseData, setPhaseData] = useState([]);
  const [phase, setPhase] = useState([]);
  const [currentChallengeDay, setCurrentChallengeDay] = useState(null);
  const [transformLevel, setTransformLevel] = useState(undefined);
  const [loadingExercises, setLoadingExercises] = useState(false)
  const [newWorkoutParams, setNewWorkoutParams] = useState()
  const [initialBurpeeTestCompleted, setInitialBurpeeTestCompleted] = useState(false)
  const [completeCha, setCompleteCha] = useState(false)
  const [todayRecommendedRecipe, setTodayRecommendedRecipe] = useState([])
  const [todayRecommendedMeal, setTodayRecommendedMeal] = useState([])
  const [phaseDefaultTags, setPhaseDefaultTags] = useState(undefined)
  const [skipped, setSkipped] = useState(false)
  const [isSettingVisible, setIsSettingVisible] = useState(false)
  const [AllRecipe, setAllRecipe] = useState([])
  const [challengeRecipe, setChallengeRecipe] = useState([])
  const [favoriteRecipe, setFavoriteRecipe] = useState([])
  const [files, setFiles] = useState(undefined)
  const [totalToDownload, setTotalToDownload] = useState(0)
  const [downloaded, setDownloaded] = useState(0)
  const [finishdownloaded, setFinishdownloaded] = useState(false)
  const calendarStrip = useRef(null)

  const fetchUserData = async () => {
    // start loading
    setLoading(true)
    const uid = await useStorage.getItem("uid");
    try {
      const user = await getDocument(
        COLLECTION_NAMES.USERS,
        uid
      )

      if (!user) throw new Error("Incomplete data");

      const getInitialBurpeeTestCompleted = user?.initialBurpeeTestCompleted ?? false
      await setWeeklyTargets(user)
      await setPlatformData(user)
      await fetchActiveChallengeUserData(user.id)
      setInitialBurpeeTestCompleted(getInitialBurpeeTestCompleted)
    } catch (err) {
      console.log("Error fetch user: ", err)
    }
  }

  // this func need to transfer in filterRecipeScreen
  const fetchChallengeData = async () => {
    try {
      const challengeRef = await getCollection(
        COLLECTION_NAMES.CHALLENGES,
      )

      if (!challengeRef) {
        throw new Error("Incomplete data");
      }

      const challengesData = await getChallengesData(challengeRef)

      setAllRecipe(challengesData.challenges.recommendedRecipe[0])
      setChallengeRecipe(challengesData.challengeLevel[0])
    } catch (err) {
      console.log("Error fetch challenge: ", err)
    }
  }

  const fetchActiveChallengeUserData = async (uid) => {
    try {
      const getUserChallengeActive = await getSpecificSubCollectionTransForm(
        COLLECTION_NAMES.USERS,
        COLLECTION_NAMES.CHALLENGES,
        "status",
        uid,
        "Active",
        "in"
      )
      let list = [];

      if (!getUserChallengeActive) throw new Error("Incomplete data");

      getUserChallengeActive.forEach((doc) => {
        list.push(doc.data());
      })

      await makeChallengeCompleted(list)
    } catch (err) {
      setLoading(false)
      console.log("Error fetch active user challenge: ", err);
    }
  };

  const makeChallengeCompleted = async (list) => {
    const activeChallengeEndDate = list[0] ? list[0].endDate : null;
    const currentDate = moment().format("YYYY-MM-DD");
    const isCompleted = moment(currentDate).isSameOrAfter(
      activeChallengeEndDate
    );

    if (list[0] && !isCompleted) {
      await fetchActiveChallengeData(list[0], currentDate);
    } else {
      if (isCompleted) {
        const newData = createUserChallengeData(
          { ...list[0], status: "InActive" },
          new Date()
        );

        await addSubDocument(
          COLLECTION_NAMES.USERS,
          COLLECTION_NAMES.CHALLENGES,
          uid,
          list[0].id,
          newData
        )

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
  }

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

      if (!getActiveChallenge) throw new Error("Incomplete Data");

      const getSkipped = activeChallengeUserData.onBoardingInfo.skipped ?? false
      const favoriteRecipe = await getFavoriteRcipe(
        activeChallengeUserData,
        currentDay
      )

      setFavoriteRecipe(favoriteRecipe.recommendedMeal[0])
      setActiveChallengeUserData(activeChallengeUserData)
      setActiveChallengeData(getActiveChallenge)
      setSkipped(getSkipped)
      fetchCalendarEntries(
        activeChallengeUserData,
        getActiveChallenge
      )
    } catch (err) {
      setLoading(false)
      console.log("Error fetch active challenge: ", err);
    }
  };

  const getChallengesData = async (challengeRef) => {
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

  const setWeeklyTargets = async (user) => {
    if (!user?.weeklyTargets) {
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

      return await addDocument(
        COLLECTION_NAMES.USERS,
        user.id,
        data
      )
    }
  }

  const setPlatformData = async (user) => {
    const version = await checkVersion();
    const data = {
      AppVersion:
        Platform.OS === "ios"
          ? String(version.version)
          : String(getVersion()),
    }

    return await addDocument(
      COLLECTION_NAMES.USERS,
      user.id,
      data
    )
  }

  const getCurrentPhaseInfo = async (
    activeChallengeUserData,
    activeChallengeData,
    stringDate
  ) => {
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
        console.log("Error get phase data")
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
      const getTodayRecommendedMeals = await getTodayRecommendedMeal(
        phaseData,
        activeChallengeData
      )

      const favoriteRecipe = await getFavoriteRcipe(
        activeChallengeUserData,
        stringDate
      )

      if (
        todayRcWorkout &&
        getTodayRecommendedMeals &&
        favoriteRecipe
      ) {
        setLoading(false)
        setTodayRcWorkout(todayRcWorkout);
        setTodayRecommendedRecipe(getTodayRecommendedMeals.recommendedRecipe[0])
        setTodayRecommendedMeal(getTodayRecommendedMeals.recommendedMeal[0])
        setPhaseDefaultTags(getTodayRecommendedMeals.phaseDefaultTags)
        setFavoriteRecipe(favoriteRecipe.recommendedMeal[0])
      } else {
        setLoading(false)
        setTodayRcWorkout(undefined);
        setTodayRecommendedRecipe(getTodayRecommendedMeals.recommendedRecipe[0])
        setTodayRecommendedMeal(getTodayRecommendedMeals.recommendedMeal[0])
        setPhaseDefaultTags(getTodayRecommendedMeals.phaseDefaultTags)
        setFavoriteRecipe(favoriteRecipe.recommendedMeal[0])
      }

    } else {
      setLoading(false)
      console.log("Error get phase")
    }
  }
  const checkScheduleChallenge = async (
    activeChallengeUserData,
    activeChallengeData,
    stringDate
  ) => {
    console.log('checkScheduleChallenge')

    if (
      activeChallengeUserData &&
      moment(activeChallengeUserData.startDate).isSame(stringDate) &&
      activeChallengeUserData.isSchedule
    ) {
      const data = { status: "Active", isSchedule: true }
      await addSubDocument(
        COLLECTION_NAMES.USERS,
        COLLECTION_NAMES.CHALLENGES,
        uid,
        activeChallengeUserData.id,
        data
      )

    } else if (activeChallengeUserData && activeChallengeUserData.isSchedule) {
      const isBetween = moment(currentDay).isBetween(
        activeChallengeUserData.startDate,
        activeChallengeUserData.endDate,
        undefined,
        "[]"
      );
      const data = { status: "Active", isSchedule: true }
      await addSubDocument(
        COLLECTION_NAMES.USERS,
        COLLECTION_NAMES.CHALLENGES,
        uid,
        activeChallengeUserData.id,
        data
      )

      if (!isSchedule) {
        setLoading(true)
        setScheduleData(activeChallengeUserData)
        fetchActiveChallengeData(activeChallengeUserData, stringDate);
        setCalendarSelectedDate(moment(activeChallengeUserData.startDate))
        setCurrentDay(activeChallengeUserData.startDate);
        setIsSchedule(true)
      }
      if (isBetween) {
        setScheduleData(activeChallengeUserData)
        setIsSchedule(true)
        if (!activeChallengeData) {
          fetchActiveChallengeData(activeChallengeUserData, stringDate);
        } else {
          getCurrentPhaseInfo(
            activeChallengeUserData,
            activeChallengeData,
            stringDate
          );
        }
      } else {
        setLoading(true)
        setScheduleData(activeChallengeUserData)
        setIsSchedule(true)
      }
    } else {
      setLoading(false)
      const isBetween = moment(currentDay).isBetween(
        activeChallengeUserData.startDate,
        activeChallengeUserData.endDate,
        undefined,
        "[]"
      );

      if (isBetween) {
        setScheduleData(activeChallengeUserData)
        setIsSchedule(true)
        if (!activeChallengeData) {
          fetchActiveChallengeData(activeChallengeUserData, stringDate);
        } else {
          getCurrentPhaseInfo(
            activeChallengeUserData,
            activeChallengeData,
            stringDate
          );
        }
      } else {
        setLoading(false)
        setScheduleData(activeChallengeUserData)
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
    const currentChallengeDay = getCurrentChallengeDay(
      activeChallengeUserData.startDate,
      stringDate
    );
    const data = {
      recipes: {
        days: currentChallengeDay
      }
    }
    const uid = await useStorage.getItem("uid");

    await addSubDocument(
      COLLECTION_NAMES.USERS,
      COLLECTION_NAMES.CHALLENGES,
      uid,
      activeChallengeUserData.id,
      data
    )

    setCurrentDay(stringDate)
    setCurrentChallengeDay(currentChallengeDay)

    const isBetween = isBetweenDate(
      activeChallengeUserData,
      stringDate
    )

    if (
      calendarStrip.current &&
      isBetween
    ) {
      setShowRC(true);
    } else {
      setShowRC(false);
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
        const isBetween = isBetweenDate(
          activeChallengeUserData,
          stringDate
        )
        if (isBetween) getCurrentPhaseInfo(
          activeChallengeUserData,
          activeChallengeData
        );
        else {
          setLoading(false)
        }
      }
    }
  }

  const isBetweenDate = (
    activeChallengeUserData,
    stringDate
  ) => {
    const isBetween = moment(stringDate).isBetween(
      activeChallengeUserData.startDate,
      activeChallengeUserData.endDate,
      undefined,
      "[]"
    );

    return isBetween
  }

  const loadExercises = async (workoutData) => {
    setLoadingExercises(true)

    Object.assign(workoutData, {
      warmUpExercises: workoutData.warmUpExercises,
      displayName: `${workoutData.displayName} - Day ${currentChallengeDay}`,
    });

    if (workoutData.newWorkout) {
      const getTotalDownload =
        workoutData.exercises.length +
        workoutData.warmUpExercises.length +
        workoutData.coolDownExercises.length +
        workoutData.warmUpExercises.length +
        workoutData.coolDownExercises.length

      setTotalToDownload(getTotalDownload)
    } else {
      const getTotalDownload =
        workoutData.exercises.length +
        workoutData.warmUpExercises.length +
        workoutData.coolDownExercises.length

      setTotalToDownload(getTotalDownload)
    }

    const workout = await loadExercise(workoutData, setFiles)

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
        "warmUp",
        setFiles
      );

      if (warmUpExercises.length > 0) {
        const coolDownExercises = await downloadExerciseWC(
          workout,
          workout.coolDownExercises,
          workout.coolDownExerciseModel,
          "coolDown",
          setFiles
        );

        if (coolDownExercises.length > 0) {
          const newWorkout = Object.assign({}, workout, {
            warmUpExercises: warmUpExercises,
            coolDownExercises: coolDownExercises,
          });

          setNewWorkoutParams(newWorkout)
        } else {
          setLoadingExercises(false)
          Alert.alert("Alert!", "Something went wrong!");
        }
      } else {
        setLoadingExercises(false)
        Alert.alert("Alert!", "Something went wrong!");
      }
    } else if (workout) {
      goToNext(workout);
    } else {
      setLoadingExercises(false)
    }
  }

  const goToNext = async (workout) => {
    const fitnessLevel = await useStorage.getItem("fitnessLevel", null);

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

    setTotalToDownload(0)
    setDownloaded(0)
    setFiles(undefined)
    setLoadingExercises(false)
    setFinishdownloaded(false)
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
    setIsSettingVisible(!isSettingVisible);
  };

  useEffect(() => {
    navigation.setParams({
      activeChallengeSetting: () => handleActiveChallengeSetting(),
    });
  }, [])

  useEffect(() => {
    fetchUserData();
  }, [])

  useEffect(() => {
    fetchChallengeData();
  }, [])

  useEffect(() => {
    if (files) {
      for (let i = downloaded; i <= totalToDownload; i++) {
        if (totalToDownload === i) {
          setDownloaded(i)
          setFinishdownloaded(true)
          setFiles(undefined)
        }
      }
    }

    if (newWorkoutParams && finishdownloaded) {
      goToNext(newWorkoutParams)
    }
  }, [files, downloaded, totalToDownload])

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
          <Text
            style={{
              textAlign: "center",
              fontFamily: fonts.GothamMedium,
              fontSize: wp("5%"),
            }}
          >
            {ScheduleData.displayName}
          </Text>
          <Text
            style={{
              textAlign: "center",
              marginTop: wp("2%"),
              color: colors.grey.dark,
              fontFamily: fonts.GothamMedium,
            }}
          >
            Your challenge will start from{" "}
            {moment(ScheduleData.startDate).format("DD MMM YYYY")}
          </Text>
          <Text
            style={{
              textAlign: "center",
              marginTop: wp("2%"),
              color: colors.grey.dark,
              fontFamily: fonts.GothamMedium,
            }}
          >
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
        loadExercises={loadingExercises}
        color={colors.red.standard}
        downloaded={downloaded}
        totalToDownload={totalToDownload}
      // text={loading ? 'Please wait we are loading workout' : null}
      />
    </View>
  );
}