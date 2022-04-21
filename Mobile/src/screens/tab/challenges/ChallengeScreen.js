import React, {
  useEffect,
  useState,
  useRef
} from "react"
import {
  View
} from "react-native";
import moment from "moment";
import CustomCalendarStrip from "../../../components/Calendar/CustomCalendarStrip";
import { DayDisplayComponent } from "../../../components/tab/challenges/DayDisplayComponent";
import globalStyle from "../../../styles/globalStyles";
import { getCurrentChallengeDay, getCurrentPhase, getTodayRecommendedWorkout, getTotalChallengeWorkoutsCompleted, isActiveChallenge } from "../../../utils/challenges";
import { addSubDocument } from "../../../hook/firestore/write";
import { getDocument } from "../../../hook/firestore/read";
import { COLLECTION_NAMES } from "../../../library/collections/index"
import { useStorage } from "../../../hook/storage"
import Loader from "../../../components/Shared/Loader";
import colors from "../../../styles/colors";

export const ChallengeScreen = () => {
  const [CalendarSelectedDate, setCalendarSelectedDate] = useState();
  const [isSchedule, setIsSchedule] = useState();
  const [ScheduleData, setScheduleData] = useState();
  const [loading, setLoading] = useState(false);
  const [activeChallengeData, setActiveChallengeData] = useState();
  const [activeChallengeUserData, setActiveChallengeUserData] = useState();
  const [todayRcWorkout, setTodayRcWorkout] = useState();
  const [currentDay, setCurrentDay] = useState();
  const [showRC, setShowRC] = useState(false)
  const [phaseData, setPhaseData] = useState();
  const [totalChallengeWorkoutsCompleted, setTotalChallengeWorkoutsCompleted] = useState();
  const [currentChallengeDay, setCurrentChallengeDay] = useState();
  const [transformLevel, setTransformLevel] = useState();
  const calendarStrip = useRef(null)

  const fetchCalendarEntries = () => {
    const selectedDate = calendarStrip.current.getSelectedDate();
    //Todo :call the function to get the data of current date
    handleDateSelected(selectedDate);
  };

  const handleDateSelected = async (date) => {
    setLoading(false)
    setCurrentDay(date.format("YYYY-MM-DD").toString())
    const currentChallengeDay = getCurrentChallengeDay(
      activeChallengeUserData.startDate,
      currentDay
    );
    if (!currentChallengeDay) {
      return undefined
    }
    setCurrentChallengeDay(currentChallengeDay)

    const data = {
      recipes: {
        days: currentChallengeDay
      }
    }
    const id = activeChallengeUserData.id;
    const uid = await useStorage.getItem("uid");
    const isCurrentChallengeDayAdded = await addSubDocument(
      COLLECTION_NAMES.USERS,
      COLLECTION_NAMES.CHALLENGES,
      uid,
      id,
      data
    )

    if (!isCurrentChallengeDayAdded) {
      return undefined
    }

    //TODO:check the active challenge cndtns
    if (
      activeChallengeData &&
      activeChallengeUserData &&
      activeChallengeUserData.status === "Active" &&
      new Date(activeChallengeUserData.startDate).getTime() <=
      new Date(currentDay).getTime() &&
      new Date(activeChallengeUserData.endDate).getTime() >=
      new Date(currentDay).getTime()
    ) {
      getCurrentPhaseInfo();
    } else {
      if (!isSchedule && !ScheduleData)
        checkScheduleChallenge();
      else {
        const isBetween = moment(currentDay).isBetween(
          ScheduleData.startDate,
          ScheduleData.endDate,
          undefined,
          "[]"
        );
        if (isBetween) getCurrentPhaseInfo();
        else {
          setLoading(false)
        }
      }
    }
  }

  const fetchActiveChallengeData = async (activeChallengeUserData) => {
    console.log('activeChallengeUserData: ', activeChallengeUserData)
    try {
      const getActiveChallenge = await getDocument(
        COLLECTION_NAMES.CHALLENGES,
        activeChallengeUserData.id
      )

      if (getActiveChallenge) {
        setActiveChallengeUserData(activeChallengeUserData)
        setActiveChallengeData(getActiveChallenge)
        getCurrentPhaseInfo();
      }
    } catch(err) {
      setLoading(false)
      console.log("Fetch active challenge data error! ", err);
    }
  };

  const getCurrentPhaseInfo = async () => {
    if (activeChallengeUserData && activeChallengeData) {
      setLoading(false)
      const test = activeChallengeUserData.startDate;
      const transformLevel = activeChallengeUserData.displayName;
      setTransformLevel(transformLevel)

      if (currentDay >= test) {
        setLoading(true)
      }

      const isBetween = moment(currentDay).isBetween(
        activeChallengeUserData.startDate,
        activeChallengeUserData.endDate,
        undefined,
        "[]"
      );
      if (calendarStrip.current) {
        if (isBetween) setShowRC(true);
        else setShowRC(false);
      }

      //TODO :getCurrent phase data
      const phase = getCurrentPhase(
        activeChallengeUserData.phases,
        currentDay
      );
      console.log('phase: ', phase);

      if (phase) {
        //TODO :fetch the current phase data from Challenges collection
        const phaseData = activeChallengeData.phases.filter(
          (res) => res.name === phase.name ? res : null
        )[0];

        if (!phaseData) {
          return null
        }
        console.log('phaseDataphaseData: ', phaseData);
        setPhaseData(phaseData)
        //TODO :calculate the workout completed till selected date
        const totalChallengeWorkoutsCompleted =
          getTotalChallengeWorkoutsCompleted(
            activeChallengeUserData,
            currentDay
          );

        if (!totalChallengeWorkoutsCompleted) {
          return null
        }
        setTotalChallengeWorkoutsCompleted(totalChallengeWorkoutsCompleted)

        //TODO calculate current challenge day
        const currentChallengeDay = getCurrentChallengeDay(
          activeChallengeUserData.startDate,
          currentDay
        );

        if (!currentChallengeDay) {
          return undefined
        }
        setCurrentChallengeDay(currentChallengeDay)

        //TODO get recommended workout here
        const todayRcWorkout = (
          await getTodayRecommendedWorkout(
            activeChallengeData.workouts,
            activeChallengeUserData,
            currentDay
          )
        )[0];

        if (todayRcWorkout) setTodayRcWorkout(todayRcWorkout);
        else setTodayRcWorkout(undefined);
      }
    } else {
      // Alert.alert('Something went wrong please try again')
    }
  }

  const checkScheduleChallenge = async () => {
    const activeChallenge = await isActiveChallenge()
    const todayDate = moment(new Date()).format("YYYY-MM-DD");

    if (!activeChallenge) {
      return undefined
    }

    if (
      activeChallenge &&
      moment(activeChallenge.startDate).isSame(todayDate) &&
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
        return undefined
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
        return undefined
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
          getCurrentPhaseInfo();
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
          getCurrentPhaseInfo();
        }
      } else {
        setIsSchedule(true)
        setScheduleData(activeChallenge)
        setLoading(true)
      }
    }
  }

  useEffect(() => {
    checkScheduleChallenge()
  }, [])

  useEffect(() => {
    fetchActiveChallengeData()
  },[])

  return (
    <View style={[globalStyle.container, { paddingHorizontal: 0 }]}>
      <CustomCalendarStrip
        ref1={calendarStrip}
        onDateSelected={(date) => {
          handleDateSelected(date);
        }}
        CalendarSelectedDate={CalendarSelectedDate}
      />
      {/* {isSchedule && !showRC && !loading && (
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
      )} */}
      <DayDisplayComponent
        phaseData={phaseData}
        showRC={showRC}
        activeChallengeData={activeChallengeData}
        currentChallengeDay={currentChallengeDay}
        transformLevel={transformLevel}
      />
      {/* {setting} */}
      <Loader loading={loading} color={colors.red.standard} />
    </View>
  );
}