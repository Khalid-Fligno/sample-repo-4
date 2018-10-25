export const findFocus = (workoutObject) => {
  if (workoutObject.upperBody) {
    return 'Upper';
  } else if (workoutObject.lowerBody) {
    return 'Lower';
  } else if (workoutObject.fullBody) {
    return 'Full';
  } else if (workoutObject.core) {
    return 'Core';
  }
  return null;
};

export const findLocation = (workoutObject) => {
  if (workoutObject.gym) {
    return 'Gym';
  } else if (workoutObject.home) {
    return 'Home';
  } else if (workoutObject.park) {
    return 'Park';
  }
  return null;
};
