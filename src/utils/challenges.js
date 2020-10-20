import AsyncStorage from '@react-native-community/async-storage';
import { db } from '../../config/firebase';

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
export const getTodayRecommendedMeal = (phaseData,activeChallengeUserData) =>{
    const dietryPreferences = activeChallengeUserData.onBoardingInfo.dietryPreferences
    const phaseMeals = phaseData.meals.filter((res)=>{
        for(i=0;i<dietryPreferences.length;i++){
        if(res.tags.includes(dietryPreferences[i])){
            return true
        }
        }
    })
    const getRandomNumber = (length)=>  Math.floor((Math.random() * length) + 0);
    const breakfast = phaseMeals.filter((res)=>res.mealType === 'breakfast')
    const lunch = phaseMeals.filter((res)=>res.mealType === 'lunch')
    const dinner = phaseMeals.filter((res)=>res.dinner === 'dinner')
    const snack = phaseMeals.filter((res)=>res.mealType === 'snack')
    const morningSnack = getRandomNumber(snack.length-1) >=0?Object.assign({},snack[getRandomNumber(snack.length-1)],{mealType:'Morning Snack'}):undefined
    const afternoonSnack = getRandomNumber(snack.length-1) >=0?Object.assign({},snack[getRandomNumber(snack.length-1)],{mealType:'Afternoon Snack'}):undefined
    const recommendedMeal = [
        breakfast[getRandomNumber(breakfast.length-1)],
        lunch[getRandomNumber(lunch.length-1)],
        dinner[getRandomNumber(dinner.length-1)],
        morningSnack,
        afternoonSnack
    ]
    return recommendedMeal
}
