const { db } = require("../../../config/firebase");
import AsyncStorage from "@react-native-community/async-storage";
import { Alert } from "react-native";
import moment from "moment";

const getCurrentInfoUser = async () => {
  const uid = await AsyncStorage.getItem("uid");
  try {
    const users = await db
      .collection("users")
      .doc(uid)
      .get()

    if (users) {
      const userData = users.data();
      const currentProgressInfo = userData?.currentProgressInfo
      return currentProgressInfo
    } else {
      return undefined;
    }
  } catch (err) {
    console.log("fetching user error: ", err);
  }
}

const setDataUser = async (data) => {
  const uid = await AsyncStorage.getItem("uid");
  try {
    await db
      .collection("users")
      .doc(uid)
      .set(data, { merge: true });
  } catch (err) {
    console.log("Store progress error: ", err);
  }
}

const storeProgressInfo = async (data, bool) => {
  const currentProgressInfo = await getCurrentInfoUser()
  const dataObj = {
    currentProgressInfo: bool ? {
      photoURL: currentProgressInfo?.photoURL ?? null,
      weight: parseInt(currentProgressInfo?.weight, 10) ?? null,
      waist: parseInt(currentProgressInfo?.waist, 10) ?? null,
      hip: parseInt(currentProgressInfo?.hip, 10) ?? null,
      burpeeCount: currentProgressInfo?.burpeeCount ?? null,
    } : {},
    initialProgressInfo: {
      photoURL: data.photoURL,
      height: parseInt(data.height, 10),
      goalWeight: parseInt(data.goalWeight, 10),
      weight: parseInt(data.weight, 10),
      waist: parseInt(data.waist, 10),
      hip: parseInt(data.hip, 10),
      burpeeCount: data.burpeeCount,
      date: moment().format("YYYY-MM-DD"),
    },
    fitnessLevel: data.fitnessLevel,
  }

  if (bool) {
    await setDataUser(dataObj);
  } else {
    await setDataUser(dataObj);
  }
};

export default storeProgressInfo;
