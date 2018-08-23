export const findFocus = (workoutObject) => {
  if (workoutObject && workoutObject.upperBody) {
    return 'Upper';
  } else if (workoutObject && workoutObject.lowerBody) {
    return 'Lower';
  } else if (workoutObject && workoutObject.fullBody) {
    return 'Full';
  } else if (workoutObject && workoutObject.core) {
    return 'Core';
  }
  return null;
};

export const findLocation = (workoutObject) => {
  if (workoutObject && workoutObject.gym) {
    return 'Gym';
  } else if (workoutObject && workoutObject.home) {
    return 'Home';
  } else if (workoutObject && workoutObject.park) {
    return 'Park';
  }
  return null;
};
