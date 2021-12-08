import AsyncStorage from '@react-native-community/async-storage';
import { db } from '../../config/firebase';
import moment from 'moment';
import { Alert } from 'react-native';


export const isActiveChallenge = async() =>{
    const uid = await AsyncStorage.getItem('uid');
    const challengeRef = db.collection('users').doc(uid).collection('challenges')
    const snapshot = await challengeRef.where("status", "==" , "Active").get();
    const scheduleSnapshot = await challengeRef.where("isSchedule", "==" , true).get();
    if (snapshot.empty) {
      if(scheduleSnapshot.empty){
        return false;
      }else{
        console.log('scheduleSnapshot: ', scheduleSnapshot)
        let list = [];
        scheduleSnapshot.forEach(doc => {
            list.push(doc.data());
          });
        return list[0];
      }
    }else{
        let list = [];
        snapshot.forEach(doc => {
            list.push(doc.data());
          });
        return list[0];
    }
}

export const getCurrentPhase = (data,currentDate1) =>{
    let phase = undefined
    data.forEach(el => {
        let currentDate = moment(currentDate1).format('YYYY-MM-DD')
        // console.log(el.startDate, el.endDate,currentDate)
        const isBetween = moment(currentDate).isBetween(el.startDate, el.endDate, undefined, '[]')
        // console.log("????/////",isBetween)
        if(isBetween){
          phase =  el
        }
    });
    // console.log("Current Phase",phase )
    return phase
}
export const getTotalChallengeWorkoutsCompleted = (data,stringDate) =>{
    let totalworkoutCompleted = data.workouts.filter((res)=>{
                                    let resTime = new Date(res.date).getTime();
                                    let selectedTime = new Date(stringDate).getTime()
                                    return resTime <= selectedTime
                                })
    return totalworkoutCompleted            
}
export const getCurrentChallengeDay = (startDate,currentDate) =>{
    // let startTime = new Date(startDate).getTime();
    // let currentTime = new Date(currentDate).getTime();
    // let currentDay = Math.round(( currentTime - startTime) / (1000 * 3600 * 24))+1
    // return currentDay; 

    var b = moment(startDate);
    var a = moment(currentDate);
    return a.diff(b, 'days')+1
}

export const getTodayRecommendedWorkout = async(workouts,activeChallengeUserData,selectedDate) =>{

    // let Difference_In_Time = new Date(selectedDate).getTime() - new Date(activeChallengeUserData.startDate).getTime(); 
    // // To calculate the no. of days between two dates 
    // let currentDay = Math.round(Difference_In_Time / (1000 * 3600 * 24))+1;
    // // console.log("???....",currentDay)
    var b = moment(activeChallengeUserData.startDate);
    var a = moment(selectedDate);
    let currentDay = a.diff(b, 'days')+1; 
    
    const workoutData =  workouts.find((res)=>res.days.includes(currentDay));
    if(workoutData && workoutData.id){
      const programRef = db.collection('newWorkouts').where('id','==',workoutData.id);
      const snapshot = await programRef.get();
      if (snapshot.docs.length === 0) {
        return [];
      }else{
        return  snapshot.docs.map((res)=>res.data());
      }
    }else{
      console.log("????",workoutData)
      return [workoutData]
    }

}

export const fetchRecipeData = async (challengeRecipe) => {
  let recipeMeal = []
  if(challengeRecipe){
    const recipe = []
    const level1 = challengeRecipe[0].level1[0].phases[0].meals
    const level2 = challengeRecipe[0].level2[0].phases[0].meals
    level1.forEach((el) => recipe.push(el))
    level2.forEach((el) => recipe.push(el))
    const recipeRef = db.collection('recipes');
    const snapshot = await recipeRef.get();
    if (snapshot.empty) {
      return null
    }else{
      snapshot.forEach(res=>{
        if(recipe.includes(res.data().id)){
          recipeMeal.push(res.data());
        }
      })
    }
  }
  
  const challengeMealsFilterList = recipeMeal.map((res)=>res.id)

  const breakfastList = recipeMeal.filter((res)=>res.breakfast)
  const lunchList = recipeMeal.filter((res)=>res.lunch)
  const dinnerList = recipeMeal.filter((res)=>res.dinner)
  const snackList = recipeMeal.filter((res)=>res.snack)
  const drinkList = recipeMeal.filter((res)=>res.drink)
  const preworkoutList = recipeMeal.filter((res)=>res.preworkout)
  const treatsList = recipeMeal.filter((res)=>res.treats)



  const recommendedRecipe = [{
    breakfast:breakfastList,
    snack:snackList,
    lunch:lunchList,
    dinner:dinnerList,
    drink:drinkList,
    preworkout:preworkoutList,
    treats:treatsList
  }]
  return {
    recommendedRecipe,
    challengeMealsFilterList
  }

}

export const getTodayRecommendedMeal = async(phaseData,activeChallengeData) =>{
  // const dietryPreferences = activeChallengeUserData.onBoardingInfo.dietryPreferences
  let phaseMeals = []
  if(activeChallengeData && activeChallengeData.newChallenge){
    let data = phaseData.meals;
    const recipeRef = db.collection('recipes');
    const snapshot = await recipeRef.get();
    if (snapshot.empty) {
      return null
    }else{
      snapshot.forEach(res=>{
        if(data.includes(res.data().id)){
          phaseMeals.push(res.data());
        }
      })
    }
  }
  else{
    const recipeRef = db.collection('recipes')
    .where("accessFilter","array-contains",activeChallengeData.tag)
    const snapshot =  await recipeRef.get();

    snapshot.forEach(doc => {
    if(doc.data().availability.includes(phaseData.displayName.toUpperCase()))
      phaseMeals.push(doc.data())
    });
  }

  const challengeMealsFilterList = phaseMeals.map((res)=>res.id)

  // const getRandomNumber = (length)=>  Math.floor((Math.random() * length) + 0);
  const breakfastList = phaseMeals.filter((res)=>res.breakfast)
  const lunchList = phaseMeals.filter((res)=>res.lunch)
  const dinnerList = phaseMeals.filter((res)=>res.dinner)
  const snackList = phaseMeals.filter((res)=>res.snack)
  const drinkList = phaseMeals.filter((res)=>res.drink)
  const preworkoutList = phaseMeals.filter((res)=>res.preworkout)
  const treatsList = phaseMeals.filter((res)=>res.treats)



  const recommendedMeal = [{
    breakfast:breakfastList,
    snack:snackList,
    lunch:lunchList,
    dinner:dinnerList,
    drink:drinkList,
    preworkout:preworkoutList,
    treats:treatsList
  }]
  return {
    recommendedMeal,
    challengeMealsFilterList
  }
}


/** unit function */
Date.shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
Date.fullMonths = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
export const short_months =(dt)=>
   { 
     return Date.shortMonths[dt.getMonth()]; 
   }
export const full_months =(dt)=>
  { 
     return Date.fullMonths[dt.getMonth()]; 
   }   

   
//-------------- for login -----------------------
    export const getChallengeDetails = async(userid) => {
    let userChallenge=[];
    const challengeRef =await db.collection("users").doc(userid).collection("challenges").get();
    if (challengeRef.size > 0) {
         challengeRef.docs.forEach(doc=>{
          userChallenge.push(doc.data());
         });
         return userChallenge;
      }      
  }
  export const getLatestChallenge = (challenges)=>{
    return challenges.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];    
  }
  export const hasChallenges = async(uid) =>{
    const userChallenges= await getChallengeDetails(uid);
    
    // console.log("getActive challneg",userChallenges)
    if(userChallenges !== undefined && userChallenges.length > 0){
      let isChallengeValidStatus  = [];
      isChallengeValidStatus  = userChallenges.map(challenge=>{
        let challengeEndDate = moment(challenge.createdOn, 'YYYY-MM-DD').add(6,'months');
        let currentDate = moment();
        let isChallengeValid = moment(currentDate).isSameOrBefore(challengeEndDate);
        // console.log("Is challenge valid",isChallengeValid);
        // console.log("Created On date=>",challenge.createdOn,challengeEndDate,currentDate);
        if(!isChallengeValid){
          Alert.alert('Alert!',`Your ${challenge.displayName} has expired.`)
          removeChallengeFromUser(uid,challenge.id);
        }
        return  isChallengeValid
        
      })
      console.log(isChallengeValidStatus)
      if(isChallengeValidStatus.includes(true)){
        // console.log("Challenge is still valid")
        return true;
      }else{
        Alert.alert("Alert!","Your challenge has expired.");
        return false;
      }
    }else{
      return false;
    }
  }

  export const removeChallengeFromUser = async(uid,challengeId)=>{
      await db.collection('users').doc(uid).collection('challenges').doc(challengeId).delete();
  }
  //---------------------for login subscription---------------

  export const updateUserSubscription = async(subscriptionData,userId) => {
    //console.log("subscriptionData",subscriptionData);
    const user = await db.collection('users').doc(userId);
    user.set(subscriptionData,{merge:true});
  }
  const today=new Date();
  const oneDay=new Date(new Date().setDate(new Date().getDate()+1));
  const oneMonth=new Date(new Date().setMonth(new Date().getMonth()+1));
  const threeMonth=new Date(new Date().setMonth(new Date().getMonth()+3));
  const oneYear = new Date(new Date().setFullYear(new Date().getFullYear()+1));
  export const subOneDay = { "subscriptionInfo":{
    "expiry":oneDay.getTime(),
    "originalPurchaseDate":new Date().getTime(),
    "productId":"6129876664506",
    "title":"App (1 Day Test Subscription)",
 }}
  export const subMonthly = { "subscriptionInfo":{
    "expiry":oneMonth.getTime(),
    "originalPurchaseDate":new Date().getTime(),
    "productId":"6122583195834",
    "title":"App (1 Month Subscription)",
 }}
 export const sub3Monthly = { "subscriptionInfo":{
  "expiry":threeMonth.getTime(),
  "originalPurchaseDate":new Date().getTime(),
  "productId":"6122583326906",
  "title":"App (3 Month Subscription)"
}}
 export const subYearly = { "subscriptionInfo":{
  "expiry":oneYear.getTime(),
  "originalPurchaseDate":new Date().getTime(),
  "productId":"6122583523514",
  "title":"App (12 Month Subscription)"
}}






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