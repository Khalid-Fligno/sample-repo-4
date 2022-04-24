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
import { fetchRecipeData, getCurrentChallengeDay, getCurrentPhase, getTodayRecommendedMeal, getTodayRecommendedWorkout, getTotalChallengeWorkoutsCompleted, isActiveChallenge } from "../../../utils/challenges";
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
  const [isSchedule, setIsSchedule] = useState();
  const [ScheduleData, setScheduleData] = useState();
  const [loading, setLoading] = useState(false);
  const [activeChallengeData, setActiveChallengeData] = useState();
  const [activeChallengeUserData, setActiveChallengeUserData] = useState();
  const [todayRcWorkout, setTodayRcWorkout] = useState(undefined);
  const [currentDay, setCurrentDay] = useState();
  const [showRC, setShowRC] = useState(false)
  const [phaseData, setPhaseData] = useState();
  const [phase, setPhase] = useState();
  const [totalChallengeWorkoutsCompleted, setTotalChallengeWorkoutsCompleted] = useState();
  const [currentChallengeDay, setCurrentChallengeDay] = useState();
  const [transformLevel, setTransformLevel] = useState();
  const [loadingExercises, setLoadingExercises] = useState()
  const [totalToDownload, setTotalToDownload] = useState()
  const [newWorkoutParams, setNewWorkoutParams] = useState()
  const [initialBurpeeTestCompleted, setInitialBurpeeTestCompleted] = useState()
  const [completeCha, setCompleteCha] = useState()
  const [todayRecommendedRecipe, setTodayRecommendedRecipe] = useState()
  const [todayRecommendedMeal, setTodayRecommendedMeal] = useState()
  const [challengeMealsFilterList, setChallengeMealsFilterList] = useState()
  const [phaseDefaultTags, setPhaseDefaultTags] = useState()
  const [skipped, setSkipped] = useState()
  const [isSettingVisible, setIsSettingVisible] = useState()
  const [AllRecipe, setAllRecipe] = useState()
  const [challengeRecipe, setChallengeRecipe] = useState()
  const calendarStrip = useRef(null)

  const fetchUserAndChallengeData = async () => {
    // start loading
    setLoading(true)
    const version = await checkVersion();
    const uid = await useStorage.getItem("uid");
    const data = {
      AppVersion:
        Platform.OS === "ios"
          ? String(version.version)
          : String(getVersion()),
    }
    const setUserRef = await addDocument(
      COLLECTION_NAMES.USERS,
      uid,
      data
    )
    const userRef = await getDocument(
      COLLECTION_NAMES.USERS,
      uid
    )
    const challengeRef = await getCollection(
      COLLECTION_NAMES.CHALLENGES,
    )

    if (!setUserRef) {
      console.log('Error setUserRef')
    }

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
      const setUserWeeklyTarget = await addDocument(
        COLLECTION_NAMES.USERS,
        userRef.id,
        data
      )

      if (!setUserWeeklyTarget) {
        console.log('Error setUserWeeklyTarget')
      }
    }

    if (userRef && challengeRef) {
      const getInitialBurpeeTestCompleted = userRef?.initialBurpeeTestCompleted ?? false
      const documents = challengeRef.docs.map((doc) => doc.data());
      const level_1 = documents.filter((res) => {
        if (res.id === "88969d13-fd11-4fde-966e-df1270fb97dd") {
          return res.id;
        }
      });
      const level_2 = documents.filter((res) => {
        if (res.id === "7798f53c-f613-435d-b94b-b67f1f43b51b") {
          return res.id;
        }
      });

      const level_3 = documents.filter((res) => {
        if (res.id === "0d48d056-2623-4201-b25a-3f1d78083dba") {
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

      fetchRecipeData(challengeLevel).then((res) => {
        setAllRecipe(res.recommendedRecipe)
      });

      setChallengeRecipe(challengeLevel)
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
        fetchActiveChallengeData(list[0]);
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

  const fetchActiveChallengeData = async (activeChallengeUserData) => {
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

      const isBetween = moment(stringDate).isBetween(
        activeChallengeUserData.startDate,
        activeChallengeUserData.endDate,
        undefined,
        "[]"
      );

      if (calendarStrip.current) {
        if (isBetween) setShowRC(true);
        else setShowRC(false);
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

        //TODO get recommended workout here
        const todayRcWorkout = (
          await getTodayRecommendedWorkout(
            activeChallengeData.workouts,
            activeChallengeUserData,
            stringDate
          )
        )[0];

        if (todayRcWorkout) {
          setTodayRcWorkout(todayRcWorkout);

          // TODO getToday one recommended meal randomly
          getTodayRecommendedMeal(phaseData, activeChallengeData).then(
            (res) => {
              setTodayRecommendedRecipe(res.recommendedRecipe)
              setTodayRecommendedMeal(res.recommendedMeal)
              setChallengeMealsFilterList(res.challengeMealsFilterList)
              setPhaseDefaultTags(res.phaseDefaultTags)
              setLoading(false)
            })
        } else {
          setTodayRcWorkout(undefined);

          // TODO getToday one recommended meal randomly
          getTodayRecommendedMeal(phaseData, activeChallengeData).then(
            (res) => {
              setTodayRecommendedRecipe(res.recommendedRecipe)
              setTodayRecommendedMeal(res.recommendedMeal)
              setChallengeMealsFilterList(res.challengeMealsFilterList)
              setPhaseDefaultTags(res.phaseDefaultTags)
              setLoading(false)
            })
        }
      }
    } else {
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
    console.log('activeChallenge: ', activeChallenge)

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
        setCalendarSelectedDate(moment(activeChallenge.startDate))
        setIsSchedule(true)
        setScheduleData(activeChallenge)
        setLoading(true)
        setCurrentDay(activeChallenge.startDate);
        fetchActiveChallengeData(activeChallenge);
      }
      if (isBetween) {
        setIsSchedule(true)
        setScheduleData(activeChallenge)
        if (!activeChallengeData) {
          fetchActiveChallengeData(activeChallenge);
        } else {
          getCurrentPhaseInfo(
            activeChallengeUserData,
            activeChallengeData,
            stringDate
          );
        }
      } else {
        setIsSchedule(true)
        setScheduleData(activeChallenge)
        setLoading(true)
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
        setIsSchedule(true)
        setScheduleData(activeChallenge)
        if (!activeChallengeData) {
          fetchActiveChallengeData(activeChallenge);
        } else {
          getCurrentPhaseInfo(
            activeChallengeUserData,
            activeChallengeData,
            stringDate
          );
        }
      } else {
        setIsSchedule(true)
        setScheduleData(activeChallenge)
        setLoading(true)
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
    // const currentChallengeDay = getCurrentChallengeDay(
    //   activeChallengeUserData.startDate,
    //   stringDate
    // );
    // if (!currentChallengeDay) {
    //   console.log('Error currentChallengeDay')
    // }
    // setCurrentChallengeDay(currentChallengeDay)
    // console.log('currentChallengeDay: ', currentChallengeDay)

    // const data = {
    //   recipes: {
    //     days: currentChallengeDay
    //   }
    // }
    // const uid = await useStorage.getItem("uid");
    // const isCurrentChallengeDayAdded = await addSubDocument(
    //   COLLECTION_NAMES.USERS, 
    //   COLLECTION_NAMES.CHALLENGES,
    //   uid,
    //   activeChallengeUserData.id,
    //   data
    // )

    // if (!isCurrentChallengeDayAdded) {
    //   console.log('Error isCurrentChallengeDayAdded')
    // }

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
      // AllRecipe={AllRecipe}
      // favoriteRecipe={favoriteRecipe}
      // todayRecommendedRecipe={todayRecommendedRecipe}
      // todayRecommendedMeal={todayRecommendedMeal}
      // setLoading={setLoading}
      // navigation={navigation}
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