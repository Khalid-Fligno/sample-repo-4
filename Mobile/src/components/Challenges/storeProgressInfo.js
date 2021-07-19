const { db } = require("../../../config/firebase");
import AsyncStorage from "@react-native-community/async-storage";
import { Alert } from "react-native";
import moment from "moment";
import momentTimezone from "moment-timezone";
const storeProgressInfo = async (data) => {
  console.log("<><><>", data);
  const uid = await AsyncStorage.getItem("uid");
  try {
    await db
      .collection("users")
      .doc(uid)
      .set(
        {
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
          currentProgressInfo: {},
          fitnessLevel: data.fitnessLevel,
        },
        { merge: true }
      );
  } catch (err) {
    console.log("Store progress error: ", err);
    Alert.alert("Something went wrong ", "error in store progress info ");
  }
};

export default storeProgressInfo;
