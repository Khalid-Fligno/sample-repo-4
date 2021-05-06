import AsyncStorage from "@react-native-community/async-storage";
import { Alert } from "react-native";
import FastImage from "react-native-fast-image";
import { FileSystem } from "react-native-unimodules";
import { db } from "../../config/firebase";

export const findFocus = (workoutObject) => {
  if (workoutObject.filters && workoutObject.filters.indexOf("upperBody") > -1) {
    return 'Upper Body';
  } else if (workoutObject.filters && workoutObject.filters.indexOf("lowerBody") > -1) {
    return 'Lower Body';
  } else if (workoutObject.filters && workoutObject.filters.indexOf("fullBody") > -1) {
    return 'Full Body';
  }else if (workoutObject.filters && workoutObject.filters.indexOf("core") > -1) {
    return 'Core';
  }
  return null;
};


// export const findFocus = (workoutObject) => {
//   if (workoutObject.upperBody) {
//     return 'Upper';
//   } else if (workoutObject.lowerBody) {
//     return 'A, B & T';
//   } else if (workoutObject.fullBody) {
//     return 'Full';
//   }
//   return null;
// };

export const findLocation = (workoutObject) => {
  if (workoutObject.gym) {
    return 'Gym';
  } else if (workoutObject.home) {
    return 'Home';
  } else if (workoutObject.outdoors) {
    return 'Outdoors';
  }
  return null;
};

export const findFocusIcon = (workout) => {
  let focus;
  if (workout.filters && workout.filters.indexOf('fullBody') > -1) {
    focus = 'full';
  } else if (workout.filters && workout.filters.indexOf('upperBody') > -1) {
    focus = 'upper';
  } else if (workout.filters && workout.filters.indexOf('lowerBody') > -1) {
    focus = 'lower';
  }else if (workout.filters && workout.filters.indexOf('core') > -1) {
    focus = 'lower';
  } else {
    focus = 'lower';
  }
  return `workouts-${focus}`;
};


export const findWorkoutType = (workout) => {
  let type = 'strength';
  if( workout.filters && workout.filters.includes('interval')){
    type = 'interval'
  }
  else if(workout.filters && workout.filters.includes('circuit')){
    type = 'circuit'
  }
  return type;
};

export const getLastExercise = (exerciseList,currentExerciseIndex,workout,setCount)=>{
  let lastExercise = false
  let nextExerciseName = ''
  if(!exerciseList[currentExerciseIndex + 1] && workout.workoutProcessType === 'oneByOne') {
    lastExercise = true;
    nextExerciseName = 'NEARLY DONE!';
  }else if(!exerciseList[currentExerciseIndex + 1] && setCount === workout.workoutReps){
    lastExercise = true;
    nextExerciseName = 'NEARLY DONE!';
  }else{
    if(exerciseList[currentExerciseIndex + 1]){
      nextExerciseName = exerciseList[currentExerciseIndex + 1].displayName
    }else{
      nextExerciseName = exerciseList[0].displayName
    }
  }
  return {
    isLastExercise:lastExercise,
    nextExerciseName:nextExerciseName
  }
}

export const showNextExerciseFlag = (workout,setCount,rest) =>{
  let showNextExercise = false  
  if(workout.workoutProcessType === 'oneByOne' && setCount === workout.workoutReps){
    showNextExercise = true
  }else if(rest && !workout.count){
    showNextExercise = true
  }else if(workout.count && workout.workoutProcessType === 'circular'){
    showNextExercise = true
  } 
  return showNextExercise
}

export const setRestImages =async() =>{
    var restImages = (await db.collection('RestImages').doc('WFTvMwRtK5W0krXnIT4o').get()).data();
    // console.log("rest images",restImages);
    if(restImages && restImages.images.length >0 ){
      FastImage.preload(restImages.images.map(res=>{return {uri:res}}));
      await AsyncStorage.setItem('restImages', JSON.stringify(restImages.images) );
    }

}

export const getRandomRestImages =async() =>{
  const getRandomNumber = (length)=>  Math.floor((Math.random() * length) + 0);
  var images =JSON.parse(await AsyncStorage.getItem('restImages'));
  console.log("getting rest images",images[getRandomNumber(images.length)])
  return images[getRandomNumber(images.length)]
}


export const loadExercise = async(workoutData)=>{
  FileSystem.readDirectoryAsync(`${FileSystem.cacheDirectory}`).then((res)=>{
      Promise.all(res.map(async (item,index) => {
          if (item.includes("exercise-")) {
            FileSystem.deleteAsync(`${FileSystem.cacheDirectory}${item}`, { idempotent: true }).then(()=>{
              // console.log(item,"deleted...")
            })
          }
      }))
  })
  if(workoutData.newWorkout){
    let exercises = [];
    const exerciseRef = (await db.collection('Exercises').where('id','in',workoutData.exercises).get()).docs
    exerciseRef.forEach(exercise=>{
      exercises.push(exercise.data());
    })
    if(exercises.length>0){
      workoutData = Object.assign({},workoutData,{exercises:exercises});
      const res = await downloadExercise(workoutData);
      if(res)
        return workoutData;
      else
        return false;
    }else{
      return false;
    }

  }else{
     const res =  await downloadExercise(workoutData);
     if(res)
      return workoutData;
     else
      return false;
  }
}

 const downloadExercise = async(workout)=>{
  try{
      const exercises = workout.exercises
      return Promise.all(exercises.map(async (exercise, index) => {
        return new Promise(async(resolve,reject)=>{
          let videoIndex = 0;
          if(workout.newWorkout)
            videoIndex = exercise.videoUrls.findIndex(res=>res.model === workout.exerciseModel)
          if(exercise.videoUrls && exercise.videoUrls[0].url !== ""){
              await FileSystem.downloadAsync(
                exercise.videoUrls[videoIndex].url,
                `${FileSystem.cacheDirectory}exercise-${index + 1}.mp4`,
              ).then(()=>{
                resolve("Downloaded");
                // console.log(`${FileSystem.cacheDirectory}exercise-${index + 1}.mp4` +"downloaded")
              })
              .catch(err=>resolve("Download failed"))
          }
        })
      }))
  }
  catch(err){
    console.log(err)
    this.setState({ loading: false });
    Alert.alert('Something went wrong','Workout Not Available')
    return "false"

  }
}
// export const getRegisteredWebHooks = () => {
//   return async () => {
//     const options = {
//       method: 'GET',
//       headers: {
//           'Content-Type': 'application/json',
//           'x-recharge-access-token' : RECHARGE_API_KEY
//         },
//       };
//     const res = await fetch("https://api.cloudconvert.com/v2/thumbnail", options);      
//     const body = await res.json();
//     return body;
//   };
// }