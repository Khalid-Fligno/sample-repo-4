import { Animated, Easing } from 'react-native';
import colors from '../../src/styles/colors';

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
  WorkoutsHome: false,
  WorkoutsLocation: true,
  WorkoutsSelection: true,
  WorkoutInfo: true,
};

export const nutritionBackButtonMap = {
  NutritionHome: false,
  RecipeSelection: true,
  Recipe: true,
  RecipeSteps: true,
};

export const onboardingBackButtonMap = {
  Onboarding1: false,
  Onboarding2: false,
  Onboarding3: true,
  Onboarding4: true,
};

export const onboardingSkipButtonMap = {
  Onboarding1: false,
  Onboarding2: true,
  Onboarding3: true,
  Onboarding4: true,
};

export const mealNameMap = {
  breakfast: 'BREAKFAST',
  lunch: 'LUNCH',
  dinner: 'DINNER',
  snack: 'SNACK',
};

export const findNutritionHeaderTitle = (routeName) => {
  if (routeName === 'Recipe') {
    return 'RECIPE';
  } else if (routeName === 'RecipeSteps') {
    return 'METHOD';
  }
  return null;
};
