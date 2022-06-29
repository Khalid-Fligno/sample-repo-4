import { Animated, Easing } from 'react-native';
import colors from '../../styles/colors';

export const fadeSpec = {
  duration: 1200,
  easing: Easing.out(Easing.poly(4)),
  timing: Animated.timing,
};

export const fade = (props) => {
  const { position, scene } = props;
  const { index } = scene;
  const translateX = 0;
  const translateY = 0;
  const opacity = position.interpolate({
    inputRange: [index - 0.7, index, index + 0.7],
    outputRange: [0.3, 1, 0.3],
  });
  
  return {
    opacity,
    transform: [{ translateX }, { translateY }],
  };
};

export const tabColorMap = {
  Home: colors.charcoal.standard,
  Nutrition: colors.violet.standard,
  Workouts: colors.coral.standard,
  Calendar: colors.green.standard,
  Progress: colors.blue.standard,
};

export const workoutsBackButtonMap = {
  WorkoutsHome: true,
  WorkoutsLocation: true,
  WorkoutsSelection: false,
  WorkoutInfo: true,
};

export const workoutsStartButtonMap = {
  WorkoutInfo: true,
};

export const calendarStartButtonMap = {
  WorkoutInfo: true,
};

export const nutritionBackButtonMap = {
  NutritionHome: true,
  RecipeSelection: false,
  Recipe: false,
  RecipeSteps: true,
};
export const calendarBackButtonMap = {
  Recipe: false,
  RecipeSteps: true,
  WorkoutInfo: true,
};
export const calendarProfileButtonMap = {
  Recipe: true,
  RecipeSteps: true,
  WorkoutInfo: false,
  CalendarHome:true
};
export const activeChallengeSetting = {
  Recipe: false,
  RecipeSteps: false,
  WorkoutInfo: false,
  CalendarHome:true
};

export const onboardingBackButtonMap = {
  Onboarding1: false,
  Progress2: true,
};

export const onboardingSkipButtonMap = {
  Onboarding1: false,
  Progress1: true,
  Progress2: true,
};

export const mealNameMap = {
  breakfast: 'BREAKFAST',
  lunch: 'LUNCH',
  dinner: 'DINNER',
  snack: 'SNACK',
};

export const workoutLocationMap = {
  gym: 'GYM',
  home: 'HOME',
  outdoors: 'OUTDOORS',
};

export const workoutFocusMap = {
  fullBody: 'FULL',
  upperBody: 'UPPER',
  lowerBody: 'ABT',
};

export const hiitWorkoutStyleMap = {
  interval: 'INTERVAL',
  circuit: 'CIRCUIT',
};

export const findWorkoutsSelectionTitle = (routeName, workoutLocation, workoutFocus, hiitWorkoutStyle) => {
  if (routeName === 'WorkoutsSelection') {
    return `${workoutLocationMap[workoutLocation]} / ${workoutFocusMap[workoutFocus]}`;
  } else if (routeName === 'HiitWorkoutsSelection') {
    return `${workoutLocationMap[workoutLocation]} / ${hiitWorkoutStyleMap[hiitWorkoutStyle]}`;
  }
  return null;
};

export const findNutritionHeaderTitle = (routeName) => {
  if (routeName === 'Recipe') {
    return 'RECIPE';
  } else if (routeName === 'RecipeSteps') {
    return 'METHOD';
  }
  return null;
};
