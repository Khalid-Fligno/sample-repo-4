import colors from '../src/styles/colors';

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

export const onboardingHeaderButtonMap = {
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
