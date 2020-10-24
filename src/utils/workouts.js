export const findFocus = (workoutObject) => {
  if (workoutObject.filters && workoutObject.filters.indexOf("upperBody") > -1) {
    return 'Upper';
  } else if (workoutObject.filters && workoutObject.filters.indexOf("lowerBody") > -1) {
    return 'A, B & T';
  } else if (workoutObject.filters && workoutObject.filters.indexOf("fullBody") > -1) {
    return 'Full';
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
  } else {
    
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