import colors from '../src/styles/colors';

export const tabColorMap = {
  Home: colors.charcoal.standard,
  Nutrition: colors.violet.standard,
  Workouts: colors.coral.standard,
  Calendar: colors.green.standard,
  Profile: colors.blue.standard,
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
};

export const onboardingHeaderButtonMap = {
  Onboarding1: false,
  Onboarding2: true,
  Onboarding3: true,
};
