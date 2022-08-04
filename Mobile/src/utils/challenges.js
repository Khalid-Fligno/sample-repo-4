import AsyncStorage from "@react-native-community/async-storage";
import { db } from "../../config/firebase";
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

export const getCurrentPhase = (data, dateString) => { 
  let currentDate = moment(dateString).format("YYYY-MM-DD")
  return data.find(phase => moment(currentDate).isBetween(phase.startDate, phase.endDate, undefined, "[]"))
}

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
    const workoutDoc = await db
      .collection("newWorkouts")
      .doc(workoutData.id)
      .get()
    return workoutDoc.data()
  } else {
    return workoutData
  }
};

export const fetchRecipeData = async () => {
  let breakFastMeals = [];
  let lunchMeals = [];
  let dinnerMeals = [];
  let snackMeals = [];
  let preworkoutMeals = [];
  let treats = [];

  const snapshot = await db.collection("recipes")
    .orderBy('title')
    .get();

  if (snapshot.empty) {
    return null;
  }

  snapshot.forEach((res) => {
    const recipe = res.data()
    let mealsArray
    if(recipe.breakfast) mealsArray = breakFastMeals
    else if (recipe.lunch) mealsArray = lunchMeals
    else if (recipe.dinner) mealsArray = dinnerMeals
    else if (recipe.snack || recipe.drink) mealsArray = snackMeals
    else if (recipe.preworkout) mealsArray = preworkoutMeals
    else if (recipe.treats) mealsArray = treats
    
    mealsArray?.push(recipe)
  })

  return {
    breakfast: breakFastMeals,
    snack: snackMeals,
    lunch: lunchMeals,
    dinner: dinnerMeals,
    preworkout: preworkoutMeals,
    treats: treats,
  }
}

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
  
    return challengeRef.docs.map(doc => doc.data())
};

export const getLatestChallenge = (challenges) => {
  return challenges.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
};

export const getValidChallenges = async (uid) => {
  const userChallenges = await getChallengeDetails(uid)

  return userChallenges.filter(challenge => {
    let challengeEndDate = moment(challenge.createdOn, "YYYY-MM-DD")
      .add(6,"months")
    let currentDate = moment();
    let isChallengeValid = moment(currentDate).isSameOrBefore(challengeEndDate);
    if (!isChallengeValid) {
      removeChallengeFromUser(uid, challenge.id)
    }
    return isChallengeValid;
  })
}
export const hasChallenges = async (uid) => {
  const userChallenges = await getValidChallenges(uid);
  return userChallenges.length > 0
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

// Given a document reference for a user and the an id for the challenge
// Find the given challenge under the user and return it
export const getUserChallenge = async (userRef, challengeId) => {
  const snapshot = await userRef
    .collection('challenges')
    .doc(challengeId)
    .get();

  return snapshot.data()
}

export const createNewChallengeModel = (data) => {

  if(!data) return null

  const phases = data.phases.map((res) => {
      return (
          {
              "name": res.name,
              "displayName": res.displayName,
              "startDate": moment(new Date(), 'YYYY-MM-DD').add(res.startDay - 1, 'days').format('YYYY-MM-DD'),
              "endDate": moment(new Date(), 'YYYY-MM-DD').add(res.endDay - 1, 'days').format('YYYY-MM-DD'),
              "startDay": res.startDay,
              "endDay": res.endDay,
              "pdfUrl": res.pdfUrl
          }
      )
  })

  return {
      "name": data.name,
      "displayName": data.displayName,
      "id": data.id,
      "tag": data.tag,
      "startDate": moment(new Date()).format('YYYY-MM-DD'),
      "endDate": moment(new Date(), 'YYYY-MM-DD').add(data.numberOfDays - 1, 'days').format('YYYY-MM-DD'),
      "status": data.status ? data.status : "InActive",
      "phases": phases,
      "workouts": [],
      "onBoardingInfo": {},
      "currentProgressInfo": {},
      "createdOn": data.createdOn ? data.createdOn : moment(new Date()).format('YYYY-MM-DD'),
      "numberOfDays": data.numberOfDays,
      "numberOfWeeks": data.numberOfWeeks,
      "imageUrl": data.imageUrl,
      "shopifyProductId": data.shopifyProductId,
      "createdAt": data.createdAt ? data.createdAt : '',
      "productId": data.productId,
      "productReChargeId": data.shopifyProductId,
      "isSchedule": false
  }
}