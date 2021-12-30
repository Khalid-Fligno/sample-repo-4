import AsyncStorage from '@react-native-community/async-storage';
import { db } from '../../config/firebase';
import moment from 'moment';
import { Alert } from 'react-native';


export const isActiveChallenge = async () => {
  const uid = await AsyncStorage.getItem('uid');
  const challengeRef = db.collection('users').doc(uid).collection('challenges')
  const snapshot = await challengeRef.where("status", "==", "Active").get();
  const scheduleSnapshot = await challengeRef.where("isSchedule", "==", true).get();
  if (snapshot.empty) {
    if (scheduleSnapshot.empty) {
      return false;
    } else {
      // console.log('scheduleSnapshot: ', scheduleSnapshot)
      let list = [];
      scheduleSnapshot.forEach(doc => {
        list.push(doc.data());
      });
      return list[0];
    }
  } else {
    let list = [];
    snapshot.forEach(doc => {
      list.push(doc.data());
    });
    return list[0];
  }
}

export const getCurrentPhase = (data, currentDate1) => {
  let phase = undefined
  data.forEach(el => {
    let currentDate = moment(currentDate1).format('YYYY-MM-DD')
    // console.log(el.startDate, el.endDate,currentDate)
    const isBetween = moment(currentDate).isBetween(el.startDate, el.endDate, undefined, '[]')
    // console.log("????/////",isBetween)
    if (isBetween) {
      console.log('El: ', el)
      phase = el
    }
  });
  // console.log("Current Phase",phase )
  return phase
}
export const getTotalChallengeWorkoutsCompleted = (data, stringDate) => {
  let totalworkoutCompleted = data.workouts.filter((res) => {
    let resTime = new Date(res.date).getTime();
    let selectedTime = new Date(stringDate).getTime()
    return resTime <= selectedTime
  })
  return totalworkoutCompleted
}
export const getCurrentChallengeDay = (startDate, currentDate) => {
  // let startTime = new Date(startDate).getTime();
  // let currentTime = new Date(currentDate).getTime();
  // let currentDay = Math.round(( currentTime - startTime) / (1000 * 3600 * 24))+1
  // return currentDay;

  var b = moment(startDate);
  var a = moment(currentDate);
  return a.diff(b, 'days') + 1
}

export const getTodayRecommendedWorkout = async (workouts, activeChallengeUserData, selectedDate) => {

  // let Difference_In_Time = new Date(selectedDate).getTime() - new Date(activeChallengeUserData.startDate).getTime();
  // // To calculate the no. of days between two dates
  // let currentDay = Math.round(Difference_In_Time / (1000 * 3600 * 24))+1;
  // // console.log("???....",currentDay)
  var b = moment(activeChallengeUserData.startDate);
  var a = moment(selectedDate);
  let currentDay = a.diff(b, 'days') + 1;
  let workoutIds = [];
  let todayRcWorkouts = []

  const workoutData = workouts.find((res) => res.days.includes(currentDay));
  workouts.map((workout) => {
    workout.days.map((day) => {
      if (day === currentDay) {
        workoutIds.push(workout.id);
      }
    });
  });
  if (workoutData && workoutData.id) {
    const programRef = db.collection('newWorkouts').where('id', '==', workoutData.id);
    const programRefTwo = db.collection('newWorkouts').where('id', 'in', workoutIds);
    const snapshot = await programRef.get();
    const snapshotTwo = await programRefTwo.get();
    snapshotTwo.docs.map((res) => todayRcWorkouts.push(res.data()));
    if (snapshot.docs.length === 0) {
      return [];
    } else {
      // return snapshot.docs.map((res) => res.data());
      return todayRcWorkouts.length === 1 ? todayRcWorkouts[0] : todayRcWorkouts
    }
  } else {
    console.log("????", workoutData)
    return [workoutData]
  }

}

export const fetchRecipeData = async (challengeRecipe) => {
  let phaseMeals = []
  const breakfastActive = []
  const lunchActive = []
  const dinnerActive = []
  const snackActive = []
  const drinkActive = []
  // const preworkoutActive = []
  // const treatsActive = []

  if (challengeRecipe) {
    const recipe = []
    const level1P1 = challengeRecipe[0].level1[0].phases[0].meals
    const level1P2 = challengeRecipe[0].level1[0].phases[1].meals
    const level1P3 = challengeRecipe[0].level1[0].phases[2].meals
    const level2P1 = challengeRecipe[0].level2[0].phases[0].meals
    const level2P2 = challengeRecipe[0].level2[0].phases[1].meals
    const level2P3 = challengeRecipe[0].level2[0].phases[2].meals

    level1P1.forEach((el) => recipe.push(el))
    level1P2.forEach((el) => recipe.push(el))
    level1P3.forEach((el) => recipe.push(el))
    level2P1.forEach((el) => recipe.push(el))
    level2P2.forEach((el) => recipe.push(el))
    level2P3.forEach((el) => recipe.push(el))

    const recipeRef = db.collection('recipes');
    const snapshot = await recipeRef.get();
    const mealsId = challengeRecipe[0].level2[0].phases[0].meals

    if (snapshot.empty) {
      return null
    } else {
      snapshot.forEach(res => {
        if (mealsId.includes(res.data().id)) {
          phaseMeals.push(res.data());
        }
      })
    }

    phaseMeals.forEach((resMeals) => {
      try {
        resMeals.types.forEach((resType) => {
          if (resType === 'breakfast') {
            snapshot.forEach((res) => {
              if (resMeals.breakfast === res.data().breakfast) {
                breakfastActive.push(res.data())
              }
            })
          }
          if (resType === 'lunch') {
            snapshot.forEach((res) => {
              if (resMeals.lunch === res.data().lunch) {
                lunchActive.push(res.data())
              }
            })
          }
          if (resType === 'dinner') {
            snapshot.forEach((res) => {
              if (resMeals.dinner === res.data().dinner) {
                dinnerActive.push(res.data())
              }
            })
          }
          if (resType === 'snack') {
            snapshot.forEach((res) => {
              if (resMeals.snack === res.data().snack) {
                snackActive.push(res.data())
              }
            })

          }
          if (resType === 'drink') {
            snapshot.forEach((res) => {
              if (resMeals.drink === res.data().drink) {
                drinkActive.push(res.data())
              }
            })
          }
        })
      } catch (err) {

      }
    })
  }

  console.log('treatsActive: ', treatsActive)

  const recommendedRecipe = [{
    breakfast: breakfastActive,
    snack: snackActive,
    lunch: lunchActive,
    dinner: dinnerActive,
    drink: drinkActive,
    // preworkout: preworkoutActive,
    // treats: treatsActive,
  }]

  return {
    recommendedRecipe,
    challengeAllMealsFilterList
  }

}


export const getTodayRecommendedMeal = async (phaseData, activeChallengeData) => {
  // const dietryPreferences = activeChallengeUserData.onBoardingInfo.dietryPreferences
  let phaseMeals = []
  let breakfastResult = []
  let lunchResult = []
  let dinnerResult = []
  let snackResult = []
  let drinkResult = []

  let levelName = activeChallengeData.levelTags
  let phaseName = phaseData.displayName
  let data = phaseData.meals;
  const recipeRef = db.collection('recipes');
  const snapshot = await recipeRef.get();

  if (activeChallengeData && activeChallengeData.newChallenge) {
    if (snapshot.empty) {
      return null
    } else {
      snapshot.forEach(res => {
        if (data.includes(res.data().id)) {
          phaseMeals.push(res.data());
        }
      })
    }
  }
  else {
    const recipeRef = db.collection('recipes')
        .where("accessFilter", "array-contains", activeChallengeData.tag)
    const snapshot = await recipeRef.get();

    snapshot.forEach(doc => {
      if (doc.data().availability.includes(phaseData.displayName.toUpperCase()))
        phaseMeals.push(doc.data())
    });
  }

  phaseMeals.forEach((resMeals) => {
    resMeals.types.forEach((resType) => {
      if (resType === 'breakfast') {
        snapshot.forEach((res) => {
          if (resMeals.breakfast === res.data().breakfast) {
            try {
              res.data().tags.forEach((resLevel) => {
                if (levelName === resLevel) {
                  res.data().tags.forEach((resPhase) => {
                    if (phaseName === resPhase) {
                      breakfastResult.push(res.data())
                    } else {
                      return null
                    }
                  })
                }
              })
            } catch (err) {
              // console.log('error: ', err)
            }
          }
        })
      }
      if (resType === 'lunch') {
        snapshot.forEach((res) => {
          if (resMeals.lunch === res.data().lunch) {
            try {
              res.data().tags.forEach((resLevel) => {
                if (levelName === resLevel) {
                  res.data().tags.forEach((resPhase) => {
                    if (phaseName === resPhase) {
                      lunchResult.push(res.data())
                    } else {
                      return null
                    }
                  })
                }
              })
            } catch (err) {
              // console.log('error: ', err)
            }
          }
        })
      }
      if (resType === 'dinner') {
        snapshot.forEach((res) => {
          if (resMeals.dinner === res.data().dinner) {
            try {
              res.data().tags.forEach((resLevel) => {
                if (levelName === resLevel) {
                  res.data().tags.forEach((resPhase) => {
                    if (phaseName === resPhase) {
                      dinnerResult.push(res.data())
                    } else {
                      return null
                    }
                  })
                }
              })
            } catch (err) {
              // console.log('error: ', err)
            }
          }
        })
      }
      if (resType === 'snack') {
        snapshot.forEach((res) => {
          if (resMeals.snack === res.data().snack) {
            try {
              res.data().tags.forEach((resLevel) => {
                if (levelName === resLevel) {
                  res.data().tags.forEach((resPhase) => {
                    if (phaseName === resPhase) {
                      snackResult.push(res.data())
                    } else {
                      return null
                    }
                  })
                }
              })
            } catch (err) {
              // console.log('error: ', err)
            }
          }
        })

      }
      if (resType === 'drink') {
        snapshot.forEach((res) => {
          if (resMeals.drink === res.data().drink) {
            try {
              res.data().tags.forEach((resLevel) => {
                if (levelName === resLevel) {
                  res.data().tags.forEach((resPhase) => {
                    if (phaseName === resPhase) {
                      drinkResult.push(res.data())
                    } else {
                      return null
                    }
                  })
                }
              })
            } catch (err) {
              // console.log('error: ', err)
            }
          }
        })
      }
    })
  })

  const challengeMealsFilterList = phaseMeals.map((res) => res.id)

  // const getRandomNumber = (length)=>  Math.floor((Math.random() * length) + 0);
  const breakfastList = phaseMeals.filter((res) => res.breakfast)
  const lunchList = phaseMeals.filter((res) => res.lunch)
  const dinnerList = phaseMeals.filter((res) => res.dinner)
  const snackList = phaseMeals.filter((res) => res.snack)
  const drinkList = phaseMeals.filter((res) => res.drink)
  const preworkoutList = phaseMeals.filter((res) => res.preworkout)
  const treatsList = phaseMeals.filter((res) => res.treats)

  const recommendedMeal = [{
    breakfast: breakfastList,
    snack: snackList,
    lunch: lunchList,
    dinner: dinnerList,
    drink: drinkList,
    preworkout: preworkoutList,
    treats: treatsList
  }]

  const recommendedRecipe = [{
    breakfast: breakfastResult,
    lunch: lunchResult,
    dinner: dinnerResult,
    snack: snackResult,
    drink: drinkResult
  }]

  const phaseDefaultTags = phaseData

  return {
    recommendedRecipe,
    recommendedMeal,
    challengeMealsFilterList,
    phaseDefaultTags
  }
}


/** unit function */
Date.shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
Date.fullMonths = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
export const short_months = (dt) => {
  return Date.shortMonths[dt.getMonth()];
}
export const full_months = (dt) => {
  return Date.fullMonths[dt.getMonth()];
}


//-------------- for login -----------------------
export const getChallengeDetails = async (userid) => {
  let userChallenge = [];
  const challengeRef = await db.collection("users").doc(userid).collection("challenges").get();
  if (challengeRef.size > 0) {
    challengeRef.docs.forEach(doc => {
      userChallenge.push(doc.data());
    });
    return userChallenge;
  }
}
export const getLatestChallenge = (challenges) => {
  return challenges.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
}
export const hasChallenges = async (uid) => {
  const userChallenges = await getChallengeDetails(uid);

  // console.log("getActive challneg",userChallenges)
  if (userChallenges !== undefined && userChallenges.length > 0) {
    let isChallengeValidStatus = [];
    isChallengeValidStatus = userChallenges.map(challenge => {
      let challengeEndDate = moment(challenge.createdOn, 'YYYY-MM-DD').add(6, 'months');
      let currentDate = moment();
      let isChallengeValid = moment(currentDate).isSameOrBefore(challengeEndDate);
      // console.log("Is challenge valid",isChallengeValid);
      // console.log("Created On date=>",challenge.createdOn,challengeEndDate,currentDate);
      if (!isChallengeValid) {
        Alert.alert('Alert!', `Your ${challenge.displayName} has expired.`)
        removeChallengeFromUser(uid, challenge.id);
      }
      return isChallengeValid

    })
    console.log(isChallengeValidStatus)
    if (isChallengeValidStatus.includes(true)) {
      // console.log("Challenge is still valid")
      return true;
    } else {
      Alert.alert("Alert!", "Your challenge has expired.");
      return false;
    }
  } else {
    return false;
  }
}

export const removeChallengeFromUser = async (uid, challengeId) => {
  await db.collection('users').doc(uid).collection('challenges').doc(challengeId).delete();
}
//---------------------for login subscription---------------

export const updateUserSubscription = async (subscriptionData, userId) => {
  //console.log("subscriptionData",subscriptionData);
  const user = await db.collection('users').doc(userId);
  user.set(subscriptionData, { merge: true });
}
const today = new Date();
const oneDay = new Date(new Date().setDate(new Date().getDate() + 1));
const oneMonth = new Date(new Date().setMonth(new Date().getMonth() + 1));
const threeMonth = new Date(new Date().setMonth(new Date().getMonth() + 3));
const oneYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
export const subOneDay = {
  "subscriptionInfo": {
    "expiry": oneDay.getTime(),
    "originalPurchaseDate": new Date().getTime(),
    "productId": "6129876664506",
    "title": "App (1 Day Test Subscription)",
  }
}
export const subMonthly = {
  "subscriptionInfo": {
    "expiry": oneMonth.getTime(),
    "originalPurchaseDate": new Date().getTime(),
    "productId": "6122583195834",
    "title": "App (1 Month Subscription)",
  }
}
export const sub3Monthly = {
  "subscriptionInfo": {
    "expiry": threeMonth.getTime(),
    "originalPurchaseDate": new Date().getTime(),
    "productId": "6122583326906",
    "title": "App (3 Month Subscription)"
  }
}
export const subYearly = {
  "subscriptionInfo": {
    "expiry": oneYear.getTime(),
    "originalPurchaseDate": new Date().getTime(),
    "productId": "6122583523514",
    "title": "App (12 Month Subscription)"
  }
}






//------no use ---now
//   const breakfast =  getRandomNumber(breakfastList.length-1) >=0?
//                       Object.assign(
//                         {},
//                         breakfastList[getRandomNumber(breakfastList.length-1)],
//                         {mealTitle:'breakfast',meal:'breakfast'}
//                       ):{mealTitle:'breakfast',meal:'breakfast'};

//        const lunch = getRandomNumber(lunchList.length-1) >=0?
//                         Object.assign(
//                           {},
//                           lunchList[getRandomNumber(lunchList.length-1)],
//                           {mealTitle:'lunch',meal:'lunch'}
//                         ):{mealTitle:'lunch',meal:'lunch'};

//       const dinner = getRandomNumber(dinnerList.length-1) >=0?
//                       Object.assign(
//                         {},
//                         dinnerList[getRandomNumber(dinnerList.length-1)],
//                         {mealTitle:'dinner',meal:'dinner'}
//                       ):{mealTitle:'dinner',meal:'dinner'};

// const morningSnack = getRandomNumber(snackList.length-1) >=0?
//                       Object.assign(
//                         {},
//                         snackList[getRandomNumber(snackList.length-1)],
//                         {mealTitle:'morning Snack',meal:'snack'}
//                       ):{mealTitle:'morning Snack',meal:'snack'};

// const afternoonSnack = getRandomNumber(snackList.length-1) >=0?
//                         Object.assign(
//                           {},snackList[getRandomNumber(snackList.length-1)],
//                           {mealTitle:'afternoon Snack',meal:'snack'}
//                         ):{mealTitle:'afternoon Snack',meal:'snack'};

// const recommendedMeal = [
//     breakfast,
//     morningSnack,
//     lunch,
//     afternoonSnack,
//     dinner
// ]