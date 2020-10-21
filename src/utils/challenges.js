import AsyncStorage from '@react-native-community/async-storage';
import { db } from '../../config/firebase';



export const isActiveChallenge = async() =>{
    const uid = await AsyncStorage.getItem('uid');
    const challengeRef = db.collection('users').doc(uid).collection('challenges')
    const snapshot = await challengeRef.where("status", "==" , "Active").get();
    if (snapshot.empty) {
        return false
    }else{
        let list = []
        snapshot.forEach(doc => {
            list.push(doc.data())
          });
        return list[0]
    }
}

export const getCurrentPhase = (data) =>{
    let phase = {}
    data.forEach(el => {
        let currentTime = new Date().getTime();
        let startTime = new Date(el.startDate).getTime()
        let endTime = new Date(el.endDate).getTime()
        if(currentTime >= startTime && currentTime <=endTime){
          phase =  el
        }
    });
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
export const getCurrentChallengeDay = (date) =>{
    let startDate = new Date(date).getDate();
    let currentDate = new Date().getDate();
    return ( currentDate - startDate) +1
}

export const getTodayRecommendedWorkout = (phaseData,activeChallengeUserData,selectedDate) =>{
    let startDate = new Date(activeChallengeUserData.startDate).getDate();
    let currentDate = new Date(selectedDate).getDate();
    console.log(currentDate)
    const currentDay =  ( currentDate - startDate) +1;
    return phaseData.workouts.find((res)=>res.day === currentDay)
}
export const getTodayRecommendedMeal = (phaseData,activeChallengeUserData) =>{
    const dietryPreferences = activeChallengeUserData.onBoardingInfo.dietryPreferences
    const phaseMeals = phaseData.meals.filter((res)=>{
        for(i=0;i<dietryPreferences.length;i++){
        if(res.tags.includes(dietryPreferences[i])){
            return true
        }
        }
    })
    const challengeMealsFilterList = phaseMeals.map((res)=>res.id)

    const getRandomNumber = (length)=>  Math.floor((Math.random() * length) + 0);
    const breakfastList = phaseMeals.filter((res)=>res.mealType.includes('breakfast'))
    const lunchList = phaseMeals.filter((res)=>res.mealType.includes('lunch'))
    const dinnerList = phaseMeals.filter((res)=>res.mealType.includes('dinner'))
    const snackList = phaseMeals.filter((res)=>res.mealType.includes('snack'))

    console.log("????",lunchList)
    const breakfast =  getRandomNumber(breakfastList.length-1) >=0?Object.assign({},breakfastList[getRandomNumber(breakfastList.length-1)],{mealTitle:'breakfast',meal:'breakfast'}):undefined;
    const lunch = getRandomNumber(lunchList.length-1) >=0?Object.assign({},lunchList[getRandomNumber(lunchList.length-1)],{mealTitle:'lunch',meal:'lunch'}):undefined;
    const dinner = getRandomNumber(dinnerList.length-1) >=0?Object.assign({},dinnerList[getRandomNumber(dinnerList.length-1)],{mealTitle:'dinner',meal:'dinner'}):undefined;
    const morningSnack = getRandomNumber(snackList.length-1) >=0?Object.assign({},snackList[getRandomNumber(snackList.length-1)],{mealTitle:'morning Snack',meal:'snack'}):undefined;
    const afternoonSnack = getRandomNumber(snackList.length-1) >=0?Object.assign({},snackList[getRandomNumber(snackList.length-1)],{mealTitle:'afternoon Snack',meal:'snack'}):undefined;
    
    
    const recommendedMeal = [
        breakfast,
        lunch,
        dinner,
        morningSnack,
        afternoonSnack
    ]
  
    return {
                recommendedMeal,
                challengeMealsFilterList
           }
}
