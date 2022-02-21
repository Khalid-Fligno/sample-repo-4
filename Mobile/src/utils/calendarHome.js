import AsyncStorage from "@react-native-community/async-storage";
import { Alert } from "react-native";
import { db } from "../../config/firebase";
import * as FileSystem from "expo-file-system";
import { LEVEL_1_TAG, LEVEL_2_TAG, LEVEL_3_TAG } from "../library/constants";
import { checkVersion } from "react-native-check-version";
import moment from "moment";

export const promptUser = (activeChallengeUserData, datas, navigation) => {
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

          const id = activeChallengeUserData.id;
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

          navigation.pop();
        },
      },
    ]);
  }
};

export const downloadRecipeCoverImage = async (recipeData) => {
  const fileUri = `${FileSystem.cacheDirectory}recipe-${recipeData.id}.jpg`;
  return await FileSystem.getInfoAsync(fileUri)
    .then(async ({ exists }) => {
      if (!exists) {
        return await FileSystem.downloadAsync(
          recipeData.coverImage,
          `${FileSystem.cacheDirectory}recipe-${recipeData.id}.jpg`
        );
      }
    })
    .catch(() => {
      Alert.alert("", "Image download error");
    });
};

export const fetchChallengeLevels = async () => {
  await db
    .collection("challenges")
    .get()
    .then((querySnapshot) => {
      const documents = querySnapshot.docs.map((doc) => doc.data());

      const level_1 = documents.filter((res) => {
        if (res.levelTags === LEVEL_1_TAG) {
          return res.id;
        }
      });
      const level_2 = documents.filter((res) => {
        if (res.levelTags === LEVEL_2_TAG) {
          return res.id;
        }
      });

      const level_3 = documents.filter((res) => {
        if (res.levelTags === LEVEL_3_TAG) {
          return res.id;
        }
      });

      return [
        {
          level1: level_1,
          level2: level_2,
          level3: level_3,
        },
      ];
    })
    .catch((err) => {
      return [];
    });
};

export const fetchUserDataAndBurpees = async () => {
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
      if (res.data().weeklyTargets == null) {
        const data = {
          weeklyTargets: {
            resistanceWeeklyComplete: 0,
            hiitWeeklyComplete: 0,
            strength: 0,
            interval: 0,
            circuit: 0,
            currentWeekStartDate: moment().startOf("week").format("YYYY-MM-DD"),
          },
        };
        userRef.set(data, { merge: true });
      }

      return data.initialBurpeeTestCompleted;
    })
    .catch((reason) => console.log("Fetching user data error: ", reason));
};
