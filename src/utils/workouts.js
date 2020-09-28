export const findFocus = (workoutObject) => {
  if (workoutObject.filters.indexOf("upperBody") > -1) {
    return 'Upper';
  } else if (workoutObject.filters.indexOf("lowerBody") > -1) {
    return 'A, B & T';
  } else if (workoutObject.filters.indexOf("fullBody") > -1) {
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
  if (workout.filters.indexOf('fullBody') > -1) {
    focus = 'full';
  } else if (workout.filters.indexOf('upperBody') > -1) {
    focus = 'upper';
  } else if (workout.filters.indexOf('lowerBody') > -1) {
    focus = 'lower';
  } else {
    
  }
  return `workouts-${focus}`;
};


export const findWorkoutType = (workout) => {
  let type = 'strength';
  if(workout.filters.includes('interval')){
    type = 'interval'
  }
  else if(workout.filters.includes('circuit')){
    type = 'circuit'
  }
  return type;
};