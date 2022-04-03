import AsyncStorage from "@react-native-community/async-storage";
import { db } from "../config/firebase";
import moment from "moment";
import { Alert } from "react-native";

export const isActiveChallenge = async () => {
  const uid = await AsyncStorage.getItem("uid");
  const challengeRef = db.collection("users").doc(uid).collection("challenges");
  const snapshot = await challengeRef.where("status", "==", "Active").get();
  const scheduleSnapshot = await challengeRef
    .where("isSchedule", "==", true)
    .get();
  if (snapshot.empty) {
    if (scheduleSnapshot.empty) {
      return false;
    } else {
      let list = [];
      scheduleSnapshot.forEach((doc) => {
        list.push(doc.data());
      });
      return list[0];
    }
  } else {
    let list = [];
    snapshot.forEach((doc) => {
      list.push(doc.data());
    });
    return list[0];
  }
};

export const getCurrentPhase = (data, currentDate1) => {
  let phase = undefined;
  data.forEach((el) => {
    let currentDate = moment(currentDate1).format("YYYY-MM-DD");

    const isBetween = moment(currentDate).isBetween(
      el.startDate,
      el.endDate,
      undefined,
      "[]"
    );

    if (isBetween) {
      phase = el;
    }
  });

  return phase;
};
export const getTotalChallengeWorkoutsCompleted = (data, stringDate) => {
  let totalworkoutCompleted = data.workouts.filter((res) => {
    let resTime = new Date(res.date).getTime();
    let selectedTime = new Date(stringDate).getTime();
    return resTime <= selectedTime;
  });
  return totalworkoutCompleted;
};
export const getCurrentChallengeDay = (startDate, currentDate) => {
  var b = moment(startDate);
  var a = moment(currentDate);
  return a.diff(b, "days") + 1;
};

export const getCurrentDay = (number) => {
  for (let i = 1; i <= number; i++) {
    const data = {
      day: i,
      recipeMeal: [],
    };

    return data;
  }
};

export const getTodayRecommendedWorkout = async (
  workouts,
  activeChallengeUserData,
  selectedDate
) => {
  var b = moment(activeChallengeUserData.startDate);
  var a = moment(selectedDate);
  let currentDay = a.diff(b, "days") + 1;

  const workoutData = workouts.find((res) => res.days.includes(currentDay));
  if (workoutData && workoutData.id) {
    const programRef = db
      .collection("newWorkouts")
      .where("id", "==", workoutData.id);
    const snapshot = await programRef.get();
    if (snapshot.docs.length === 0) {
      return [];
    } else {
      return snapshot.docs.map((res) => res.data());
    }
  } else {
    return [workoutData];
  }
};

export const convertRecipeData = async (recipeId) => {
  const recipeResult = [];
  const recipeRef = db.collection("recipes");
  const snapshot = await recipeRef.get();
  if (recipeId) {
    if (snapshot.empty) {
      return null;
    } else {
      snapshot.forEach((res) => {
        if (recipeId.includes(res.data().id)) {
          recipeResult.push(res.data());
        }
      });
    }
  }
  return {
    recipeResult,
  };
};

export const fetchRecipeData = async (challengeRecipe) => {
  let phaseMeals = [];
  let recipes = [];
  let breakFastMeals = [];
  let lunchMeals = [];
  let dinnerMeals = [];
  let snackMeals = [];
  let drinkMeals = [];
  let preworkoutMeals = [];
  let treats = [];
  if (challengeRecipe) {
    const recipeRef = db.collection("recipes");
    const snapshot = await recipeRef.get();

    const mealsId = challengeRecipe[0]?.level2[0]?.phases[0]?.meals;

    if (snapshot.empty) {
      return null;
    } else {
      snapshot.forEach((res) => {
        recipes.push(res.data());
      });

      snapshot.forEach((res) => {
        if (mealsId && mealsId.includes(res.data().id)) {
          phaseMeals.push(res.data());
        }
      });
    }

    // BREAKFAST
    breakFastMeals = recipes.filter((item) => item.breakfast) || [];

    // LUNCH
    lunchMeals = recipes.filter((item) => item.lunch) || [];

    // DINNER
    dinnerMeals = recipes.filter((item) => item.dinner) || [];

    // SNACK
    snackMeals = recipes.filter((item) => item.snack) || [];

    // DRINK
    drinkMeals = recipes.filter((item) => item.drink) || [];

    // PREWORKOUT
    preworkoutMeals = recipes.filter((item) => item.preworkout) || [];

    //  TREATS
    treats = recipes.filter((item) => item.treats) || [];
  }

  const recommendedRecipe = [
    {
      breakfast: breakFastMeals,
      snack: snackMeals,
      lunch: lunchMeals,
      dinner: dinnerMeals,
      drink: drinkMeals,
      preworkout: preworkoutMeals,
      treats: treats,
    },
  ];

  return {
    recommendedRecipe,
  };
};

export const getTodayRecommendedMeal = async (
  phaseData,
  activeChallengeData
) => {
  let phaseMeals = [];
  let breakfastResult = [];
  let lunchResult = [];
  let dinnerResult = [];
  let snackResult = [];
  let drinkResult = [];
  let preworkoutResult = [];
  let treatsResult = [];
  let phaseNames = [];
  let snapshotDocs = [];

  let levelName = activeChallengeData.levelTags;
  let phaseTag = phaseData.name;
  let data = phaseData.meals;
  const recipeRef = db.collection("recipes");
  const snapshot = await recipeRef.get();

  if (phaseTag === "Phase1") {
    phaseNames.push("P1");
  }
  if (phaseTag === "Phase2") {
    phaseNames.push("P2");
  }
  if (phaseTag === "Phase3") {
    phaseNames.push("P3");
  }

  snapshot.forEach((res) => {
    snapshotDocs.push(res.data());
  });

  if (activeChallengeData && activeChallengeData.newChallenge) {
    if (snapshot.empty) {
      return null;
    } else {
      snapshot.forEach((res) => {
        if (data.includes(res.data().id)) {
          phaseMeals.push(res.data());
        }
      });
    }
  } else {
    const recipeRef = db
      .collection("recipes")
      .where("accessFilter", "array-contains", activeChallengeData.tag);
    const snapshot = await recipeRef.get();

    snapshot.forEach((doc) => {
      if (doc.data().availability.includes(phaseData.displayName.toUpperCase()))
        phaseMeals.push(doc.data());
    });
  }

  breakfastResult = snapshotDocs
    .filter((snapshotDoc) => {
      const filteredPhaseMeals =
        phaseMeals.filter(
          (meal) =>
            meal.types.includes("breakfast") &&
            // meal.showTransform &&
            meal.breakfast
        ) || [];

      if (snapshotDoc.breakfast && snapshotDoc.showTransform) {
        switch (levelName) {
          case "L1":
            if (
              snapshotDoc.tags?.includes(phaseNames[0])
            ) {
              return filteredPhaseMeals.length > 0 ? snapshotDoc : false;
            }
            break;
          case "L2":
          case "L3":
            if (snapshotDoc.tags?.includes(levelName)) {
              return filteredPhaseMeals.length > 0 ? snapshotDoc : false;
            }
            break;
        }
      }
    })
    .reduce((accum, item) => {
      return [...accum, item];
    }, []);

  lunchResult = snapshotDocs
    .filter((snapshotDoc) => {
      const filteredPhaseMeals =
        phaseMeals.filter(
          (meal) => meal.types.includes("lunch") && meal.lunch
        ) || [];

      if (snapshotDoc.lunch && snapshotDoc.showTransform) {
        switch (levelName) {
          case "L1":
            if (
              snapshotDoc.tags?.includes(phaseNames[0])
            ) {
              return filteredPhaseMeals.length > 0 ? snapshotDoc : false;
            }
            break;
          case "L2":
          case "L3":
            if (snapshotDoc.tags?.includes(levelName)) {
              return filteredPhaseMeals.length > 0 ? snapshotDoc : false;
            }
            break;
        }
      }
    })
    .reduce((accum, item) => {
      return [...accum, item];
    }, []);

  dinnerResult = snapshotDocs
    .filter((snapshotDoc) => {
      const filteredPhaseMeals =
        phaseMeals.filter(
          (meal) => meal.types.includes("dinner") && meal.dinner
        ) || [];

      if (snapshotDoc.dinner && snapshotDoc.showTransform) {
        switch (levelName) {
          case "L1":
            if (
              snapshotDoc.tags?.includes(phaseNames[0])
            ) {
              return filteredPhaseMeals.length > 0 ? snapshotDoc : false;
            }
            break;
          case "L2":
          case "L3":
            if (snapshotDoc.tags?.includes(levelName)) {
              return filteredPhaseMeals.length > 0 ? snapshotDoc : false;
            }
            break;
        }
      }
    })
    .reduce((accum, item) => {
      return [...accum, item];
    }, []);

  snackResult = snapshotDocs
    .filter((snapshotDoc) => {
      const filteredPhaseMeals =
        phaseMeals.filter(
          (meal) => meal.types.includes("snack") && meal.snack
        ) || [];

      if (snapshotDoc.snack && snapshotDoc.showTransform) {
        switch (levelName) {
          case "L1":
            if (
              snapshotDoc.tags?.includes(phaseNames[0])
            ) {
              return filteredPhaseMeals.length > 0 ? snapshotDoc : false;
            }
            break;
          case "L2":
          case "L3":
            if (snapshotDoc.tags?.includes(levelName)) {
              return filteredPhaseMeals.length > 0 ? snapshotDoc : false;
            }
            break;
        }
      }
    })
    .reduce((accum, item) => {
      return [...accum, item];
    }, []);

  drinkResult = snapshotDocs
    .filter((snapshotDoc) => {
      const filteredPhaseMeals =
        phaseMeals.filter(
          (meal) => meal.types.includes("drink") && meal.drink
        ) || [];

      if (snapshotDoc.drink && snapshotDoc.showTransform) {
        switch (levelName) {
          case "L1":
            if (
              snapshotDoc.tags?.includes(phaseNames[0])
            ) {
              return filteredPhaseMeals.length > 0 ? snapshotDoc : false;
            }
            break;
          case "L2":
          case "L3":
            if (snapshotDoc.tags?.includes(levelName)) {
              return filteredPhaseMeals.length > 0 ? snapshotDoc : false;
            }
            break;
        }
      }
    })
    .reduce((accum, item) => {
      return [...accum, item];
    }, []);

  preworkoutResult = snapshotDocs
    .filter((snapshotDoc) => {
      const filteredPhaseMeals =
        phaseMeals.filter(
          (meal) => meal.types.includes("preworkout") && meal.preworkout
        ) || [];

      if (snapshotDoc.preworkout && snapshotDoc.showTransform) {
        switch (levelName) {
          case "L1":
            if (
              snapshotDoc.tags?.includes(phaseNames[0])
            ) {
              return filteredPhaseMeals.length > 0 ? snapshotDoc : false;
            }
            break;
          case "L2":
          case "L3":
            if (snapshotDoc.tags?.includes(levelName)) {
              return filteredPhaseMeals.length > 0 ? snapshotDoc : false;
            }
            break;
        }
      }
    })
    .reduce((accum, item) => {
      return [...accum, item];
    }, []);

  treatsResult = snapshotDocs
    .filter((snapshotDoc) => {
      const filteredPhaseMeals = phaseMeals.filter(
        (meal) => meal.types.includes("treats") && meal.treats
      );

      if (snapshotDoc.treats && snapshotDoc.showTransform) {
        switch (levelName) {
          case "L1":
            if (
              snapshotDoc.tags?.includes(phaseNames[0])
            ) {
              return filteredPhaseMeals.length > 0 ? snapshotDoc : false;
            }
            break;
          case "L2":
          case "L3":
            if (snapshotDoc.tags?.includes(levelName)) {
              return filteredPhaseMeals.length > 0 ? snapshotDoc : false;
            }
            break;
        }
      }
    })
    .reduce((accum, item) => {
      return [...accum, item];
    }, []);

  const challengeMealsFilterList = phaseMeals.map((res) => res.id);

  // const getRandomNumber = (length)=>  Math.floor((Math.random() * length) + 0);
  const breakfastList = phaseMeals.filter((res) => res.breakfastVisible);
  const lunchList = phaseMeals.filter((res) => res.lunchVisible);
  const dinnerList = phaseMeals.filter((res) => res.dinnerVisible);
  const snackList = phaseMeals.filter((res) => res.snackVisible);
  const drinkList = phaseMeals.filter((res) => res.drinkVisible);
  const preworkoutList = phaseMeals.filter((res) => res.preworkoutVisible);
  const treatsList = phaseMeals.filter((res) => res.treatsVisible);

  const recommendedMeal = [
    {
      breakfast: breakfastList,
      snack: snackList,
      lunch: lunchList,
      dinner: dinnerList,
      drink: drinkList,
      preworkout: preworkoutList,
      treats: treatsList,
    },
  ];

  const recommendedRecipe = [
    {
      breakfast: breakfastResult,
      lunch: lunchResult,
      dinner: dinnerResult,
      snack: snackResult,
      drink: drinkResult,
      preworkout: preworkoutResult,
      treats: treatsResult,
    },
  ];

  console.log('recommendedRecipe: ', recommendedRecipe)

  const phaseDefaultTags = phaseNames[0];

  return {
    recommendedRecipe,
    recommendedMeal,
    challengeMealsFilterList,
    phaseDefaultTags,
  };
};

/** unit function */
Date.shortMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
Date.fullMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const short_months = (dt) => {
  return Date.shortMonths[dt.getMonth()];
};
export const full_months = (dt) => {
  return Date.fullMonths[dt.getMonth()];
};

//-------------- for login -----------------------
export const getChallengeDetails = async (userid) => {
  let userChallenge = [];
  const challengeRef = await db
    .collection("users")
    .doc(userid)
    .collection("challenges")
    .get();
  if (challengeRef.size > 0) {
    challengeRef.docs.forEach((doc) => {
      userChallenge.push(doc.data());
    });
    return userChallenge;
  }
};
export const getLatestChallenge = (challenges) => {
  return challenges.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
};
export const hasChallenges = async (uid) => {
  const userChallenges = await getChallengeDetails(uid);

  if (userChallenges !== undefined && userChallenges.length > 0) {
    let isChallengeValidStatus = [];
    isChallengeValidStatus = userChallenges.map((challenge) => {
      let challengeEndDate = moment(challenge.createdOn, "YYYY-MM-DD").add(
        6,
        "months"
      );
      let currentDate = moment();
      let isChallengeValid =
        moment(currentDate).isSameOrBefore(challengeEndDate);
      if (!isChallengeValid) {
        Alert.alert("Alert!", `Your ${challenge.displayName} has expired.`);
        removeChallengeFromUser(uid, challenge.id);
      }
      return isChallengeValid;
    });

    if (isChallengeValidStatus.includes(true)) {
      return true;
    } else {
      Alert.alert("Alert!", "Your challenge has expired.");
      return false;
    }
  } else {
    return false;
  }
};

export const removeChallengeFromUser = async (uid, challengeId) => {
  await db
    .collection("users")
    .doc(uid)
    .collection("challenges")
    .doc(challengeId)
    .delete();
};
//---------------------for login subscription---------------

export const updateUserSubscription = async (subscriptionData, userId) => {
  const user = await db.collection("users").doc(userId);
  user.set(subscriptionData, { merge: true });
};
const today = new Date();
const oneDay = new Date(new Date().setDate(new Date().getDate() + 1));
const oneMonth = new Date(new Date().setMonth(new Date().getMonth() + 1));
const threeMonth = new Date(new Date().setMonth(new Date().getMonth() + 3));
const oneYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
export const subOneDay = {
  subscriptionInfo: {
    expiry: oneDay.getTime(),
    originalPurchaseDate: new Date().getTime(),
    productId: "6129876664506",
    title: "App (1 Day Test Subscription)",
  },
};
export const subMonthly = {
  subscriptionInfo: {
    expiry: oneMonth.getTime(),
    originalPurchaseDate: new Date().getTime(),
    productId: "6122583195834",
    title: "App (1 Month Subscription)",
  },
};
export const sub3Monthly = {
  subscriptionInfo: {
    expiry: threeMonth.getTime(),
    originalPurchaseDate: new Date().getTime(),
    productId: "6122583326906",
    title: "App (3 Month Subscription)",
  },
};
export const subYearly = {
  subscriptionInfo: {
    expiry: oneYear.getTime(),
    originalPurchaseDate: new Date().getTime(),
    productId: "6122583523514",
    title: "App (12 Month Subscription)",
  },
};
