export const findFocus = (workoutObject) => {
  if (workoutObject.upperBody) {
    return 'Upper';
  } else if (workoutObject.lowerBody) {
    return 'A, B & T';
  } else if (workoutObject.fullBody) {
    return 'Full';
  }
  return null;
};

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
