import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment";
import { useState } from "react";
import { db } from "../../../../config/firebase";
import { diff } from "../../../../utils/index";
import { navigate } from '../../../../navigation/rootNavigation'

export const useCounter = () => {
  const [profile, setProfile] = useState(undefined);
  const [initialProgressInfo, setInitialProgressInfo] = useState(undefined);
  const [currentProgressInfo, setCurrentProgressInfo] = useState(undefined);
  const [unitsOfMeasurement, setUnitsOfMeasurement] = useState(undefined);
  const [weightDiff, setWeightDiff] = useState(null);
  const [waistDiff, setWaistDiff] = useState(null);
  const [hipDiff, setHipDiff] = useState(null);
  const [modal, setModal] = useState(false);
  const [burpeeRes, setBurpeeRess] = useState(null);
  const [userData, setUserData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  
  const fetchUserData = async () => {
    setLoading(true)
    const uid = await AsyncStorage.getItem("uid");
    const userDataFromFirebase = await db
      .collection("users")
      .doc(uid)
      .get();

    const userData = userDataFromFirebase.data()

    if (userData) {
      if (
        userData.weeklyTargets.currentWeekStartDate !==
        moment().startOf("week").format("YYYY-MM-DD")
      ) {
        const data = {
          weeklyTargets: {
            currentWeekStartDate: moment().startOf("week").format("YYYY-MM-DD"),
          },
        };

        await db
          .collection("users")
          .doc(userData.id)
          .set(data, { merge: true })
          .catch((err) => console.log(err));
      }

      setUserData(userData)
      setLoading(false)
    }
  }

  const fetchProgressInfo = async () => {
    setProfile(userData?.totalWorkoutCompleted)
    setInitialProgressInfo(userData?.initialProgressInfo)
    setCurrentProgressInfo(userData?.currentProgressInfo)
    setUnitsOfMeasurement(userData?.unitsOfMeasurement)
  };

  const progressDifference = (
    initialProgressInfo,
    currentProgressInfo
  ) => {
    if (initialProgressInfo && currentProgressInfo) {
      const weight = diff(initialProgressInfo?.weight, currentProgressInfo?.weight);
      const waist = diff(initialProgressInfo?.waist, currentProgressInfo?.waist);
      const hip = diff(initialProgressInfo?.hip, currentProgressInfo?.hip)
      setWeightDiff(weight)
      setWaistDiff(waist)
      setHipDiff(hip)
    }
  }

  const updateProgressBtn = (
    initialProgressInfo,
    currentProgressInfo
  ) => {
    navigate("ProgressEdit", {
      isInitial: false,
      initialProgressInfo: initialProgressInfo,
      currentProgressInfo: currentProgressInfo
    })
    setModal(false)
  }

  const editBeforeBtn = (
    initialProgressInfo,
    currentProgressInfo
  ) => {
    navigate("ProgressEdit", {
      isInitial: true,
      initialProgressInfo: initialProgressInfo,
      currentProgressInfo: currentProgressInfo
    })
    setModal(false)
  }

  const getBurpeeCount = (
    afterBurpee,
    beforeBurpee
  ) => {
    if (afterBurpee) {
      return afterBurpee
    }
    return beforeBurpee
  }

  const latestBurpee = (
    initialProgressInfo,
    currentProgressInfo
  ) => {
    let result = "-";

    if (
      initialProgressInfo &&
      currentProgressInfo &&
      initialProgressInfo?.burpeeCount &&
      currentProgressInfo?.burpeeCount
    ) {
      result = currentProgressInfo.burpeeCount
    } else if (
      currentProgressInfo?.burpeeCount ||
      initialProgressInfo?.burpeeCount
    ) {
      result = getBurpeeCount(
        currentProgressInfo?.burpeeCount,
        initialProgressInfo?.burpeeCount
      )
    }
    setBurpeeRess(result);
  }

  const diffMeasurement = (
    measurement,
    currentMeasurement,
    initialMeasurement
  ) => {
    let result = undefined;

    if (measurement) {
      result = measurement
    } else if (
      currentMeasurement
    ) {
      result = currentMeasurement
    } else if (
      initialMeasurement
    ) {
      result = initialMeasurement
    }

    return result;
  }

  const toggleModal = () => {
    setModal(!modal)
  };

  return {
    profile,
    setProfile,
    initialProgressInfo,
    setInitialProgressInfo,
    currentProgressInfo,
    setCurrentProgressInfo,
    unitsOfMeasurement,
    setUnitsOfMeasurement,
    weightDiff,
    setWeightDiff,
    waistDiff,
    setWaistDiff,
    hipDiff,
    setHipDiff,
    burpeeRes,
    setBurpeeRess,
    userData,
    setUserData,
    loading,
    setLoading,
    modal,
    setModal,
    fetchUserData,
    fetchProgressInfo,
    progressDifference,
    updateProgressBtn,
    editBeforeBtn,
    latestBurpee,
    diffMeasurement,
    toggleModal
  }
}