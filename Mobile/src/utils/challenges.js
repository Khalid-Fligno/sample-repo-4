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

  var b = moment(startDate);
  var a = moment(currentDate);
  return a.diff(b, 'days') + 1
}

export const getCurrentDay = (number) => {
  for (let i = 1; i <= number; i++) {
    const data = {
      "day": i,
      "recipeMeal": []
    }
    console.log(data);
    return data
  }
}

export const getTodayRecommendedWorkout = async (workouts, activeChallengeUserData, selectedDate) => {

  var b = moment(activeChallengeUserData.startDate);
  var a = moment(selectedDate);
  let currentDay = a.diff(b, 'days') + 1;

  const workoutData = workouts.find((res) => res.days.includes(currentDay));
  if (workoutData && workoutData.id) {
    const programRef = db.collection('newWorkouts').where('id', '==', workoutData.id);
    const snapshot = await programRef.get();
    if (snapshot.docs.length === 0) {
      return [];
    } else {
      return snapshot.docs.map((res) => res.data());
    }
  } else {
    console.log("????", workoutData)
    return [workoutData]
  }

}

export const fetchActiveRecipe = async () => {
  //Fetch all recipe ID
  const data = []
  this.unsubscribeFACD = await db
    .collection("recipes")
    .get()
    .then(snapshot => {
      snapshot.forEach(res => {
        data.push(res.data().id)
      })
    })

  console.log('Data Recipe: ', data)

  // this.setState({recipeId: data})
}

export const convertRecipeData = async (recipeId) => {

  const recipeResult = []
  const recipeRef = db.collection('recipes');
  const snapshot = await recipeRef.get();
  if (recipeId) {
    if (snapshot.empty) {
      return null
    } else {
      snapshot.forEach(res => {
        if (recipeId.includes(res.data().id)) {
          recipeResult.push(res.data());
        }
      })
    }
  }

  return {
    recipeResult
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
  let preworkoutResult = []
  let treatsResult = []

  let levelName = activeChallengeData.levelTags
  let phaseName = phaseData.phaseTags
  let data = phaseData.meals;
  const recipeRef = db.collection('recipes')
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
  } else {
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
          if (res.data().showTransform === true) {
            if (resMeals.breakfast === res.data().breakfast) {
              try {
                res.data().tags.forEach(resTag => {
                  if ('L1' === levelName) {
                    if (resTag === levelName) {
                      if (res.data().tags.includes(phaseName)) {
                        breakfastResult.push(res.data())
                      }
                    }
                  }
                  if ('L2' === levelName) {
                    if (resTag === levelName) {
                      breakfastResult.push(res.data())
                    }
                  }
                  if ('L3' === levelName) {
                    if (resTag === levelName) {
                      breakfastResult.push(res.data())
                    }
                  }
                })
              } catch (err) {
                // console.log('error: ', err)
              }
            }
          }
        })
      }
      if (resType === 'lunch') {
        snapshot.forEach((res) => {
          if (res.data().showTransform === true) {
            if (resMeals.lunch === res.data().lunch) {
              try {
                res.data().tags.forEach(resTag => {
                  if ('L1' === levelName) {
                    if (resTag === levelName) {
                      if (res.data().tags.includes(phaseName)) {
                        lunchResult.push(res.data())
                      }
                    }
                  }
                  if ('L2' === levelName) {
                    if (resTag === levelName) {
                      lunchResult.push(res.data())
                    }
                  }
                  if ('L3' === levelName) {
                    if (resTag === levelName) {
                      lunchResult.push(res.data())
                    }
                  }
                })
              } catch (err) {
                // console.log('error: ', err)
              }
            }
          }
        })
      }
      if (resType === 'dinner') {
        snapshot.forEach((res) => {
          if (res.data().showTransform === true) {
            if (resMeals.dinner === res.data().dinner) {
              try {
                res.data().tags.forEach(resTag => {
                  if ('L1' === levelName) {
                    if (resTag === levelName) {
                      if (res.data().tags.includes(phaseName)) {
                        dinnerResult.push(res.data())
                      }
                    }
                  }
                  if ('L2' === levelName) {
                    if (resTag === levelName) {
                      dinnerResult.push(res.data())
                    }
                  }
                  if ('L3' === levelName) {
                    if (resTag === levelName) {
                      dinnerResult.push(res.data())
                    }
                  }
                })
              } catch (err) {
                // console.log('error: ', err)
              }
            }
          }
        })
      }

      if (resType === 'snack') {
        snapshot.forEach((res) => {
          if (res.data().showTransform === true) {
            if (resMeals.snack === res.data().snack) {
              try {
                res.data().tags.forEach(resTag => {
                  if ('L1' === levelName) {
                    if (resTag === levelName) {
                      if (res.data().tags.includes(phaseName)) {
                        snackResult.push(res.data())
                      }
                    }
                  }
                  if ('L2' === levelName) {
                    if (resTag === levelName) {
                      snackResult.push(res.data())
                    }
                  }
                  if ('L3' === levelName) {
                    if (resTag === levelName) {
                      snackResult.push(res.data())
                    }
                  }
                })
              } catch (err) {
                // console.log('error: ', err)
              }
            }
          }
        })

      }
      if (resType === 'drink') {
        snapshot.forEach((res) => {
          if (res.data().showTransform === true) {
            if (resMeals.drink === res.data().drink) {
              try {
                res.data().tags.forEach(resTag => {
                  if ('L1' === levelName) {
                    if (resTag === levelName) {
                      if (res.data().tags.includes(phaseName)) {
                        drinkResult.push(res.data())
                      }
                    }
                  }
                  if ('L2' === levelName) {
                    if (resTag === levelName) {
                      drinkResult.push(res.data())
                    }
                  }
                  if ('L3' === levelName) {
                    if (resTag === levelName) {
                      drinkResult.push(res.data())
                    }
                  }
                })
              } catch (err) {
                // console.log('error: ', err)
              }
            }
          }
        })
      }

      if (resType === 'preworkout') {
        snapshot.forEach((res) => {
          if (res.data().showTransform === true) {
            if (resMeals.preworkout === res.data().preworkout) {
              try {
                res.data().tags.forEach(resTag => {
                  if ('L1' === levelName) {
                    if (resTag === levelName) {
                      if (res.data().tags.includes(phaseName)) {
                        preworkoutResult.push(res.data())
                      }
                    }
                  }
                  if ('L2' === levelName) {
                    if (resTag === levelName) {
                      preworkoutResult.push(res.data())
                    }
                  }
                  if ('L3' === levelName) {
                    if (resTag === levelName) {
                      preworkoutResult.push(res.data())
                    }
                  }
                })
              } catch (err) {
                // console.log('error: ', err)
              }
            }
          }
        })
      }

      if (resType === 'treats') {
        snapshot.forEach((res) => {
          if (res.data().showTransform === true) {
            if (resMeals.treats === res.data().treats) {
              try {
                res.data().tags.forEach(resTag => {
                  if ('L1' === levelName) {
                    if (resTag === levelName) {
                      if (res.data().tags.includes(phaseName)) {
                        treatsResult.push(res.data())
                      }
                    }
                  }
                  if ('L2' === levelName) {
                    if (resTag === levelName) {
                      treatsResult.push(res.data())
                    }
                  }
                  if ('L3' === levelName) {
                    if (resTag === levelName) {
                      treatsResult.push(res.data())
                    }
                  }
                })
              } catch (err) {
                // console.log('error: ', err)
              }
            }
          }
        })
      }
    })
  })

  const challengeMealsFilterList = phaseMeals.map((res) => res.id)

  // const getRandomNumber = (length)=>  Math.floor((Math.random() * length) + 0);
  const breakfastList = phaseMeals.filter((res) => res.breakfastVisible)
  const lunchList = phaseMeals.filter((res) => res.lunchVisible)
  const dinnerList = phaseMeals.filter((res) => res.dinnerVisible)
  const snackList = phaseMeals.filter((res) => res.snackVisible)
  const drinkList = phaseMeals.filter((res) => res.drinkVisible)
  const preworkoutList = phaseMeals.filter((res) => res.preworkoutVisible)
  const treatsList = phaseMeals.filter((res) => res.treatsVisible)

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
    drink: drinkResult,
    preworkout: preworkoutResult,
    treats: treatsResult
  }]

  // console.log('Recipe Data: ', recommendedRecipe.breakfast)

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
