import {
  findWorkoutsSelectionTitle,
  findNutritionHeaderTitle,
} from '../../stack/utils';

describe('Find Workouts Selection Title', () => {
  test('Gym / Full Body header displays correctly', () => {
    expect(findWorkoutsSelectionTitle('WorkoutsSelection', 'gym', 'fullBody', null)).toBe('GYM / FULL');
  });

  test('Gym / Upper Body header displays correctly', () => {
    expect(findWorkoutsSelectionTitle('WorkoutsSelection', 'gym', 'upperBody', null)).toBe('GYM / UPPER');
  });

  test('Gym / Lower Body header displays correctly', () => {
    expect(findWorkoutsSelectionTitle('WorkoutsSelection', 'gym', 'lowerBody', null)).toBe('GYM / ABT');
  });

  test('Home / Full Body header displays correctly', () => {
    expect(findWorkoutsSelectionTitle('WorkoutsSelection', 'home', 'fullBody', null)).toBe('HOME / FULL');
  });

  test('Home / Upper Body header displays correctly', () => {
    expect(findWorkoutsSelectionTitle('WorkoutsSelection', 'home', 'upperBody', null)).toBe('HOME / UPPER');
  });

  test('Home / Lower Body header displays correctly', () => {
    expect(findWorkoutsSelectionTitle('WorkoutsSelection', 'home', 'lowerBody', null)).toBe('HOME / ABT');
  });

  test('Outdoors / Full Body header displays correctly', () => {
    expect(findWorkoutsSelectionTitle('WorkoutsSelection', 'outdoors', 'fullBody', null)).toBe('OUTDOORS / FULL');
  });

  test('Outdoors / Upper Body header displays correctly', () => {
    expect(findWorkoutsSelectionTitle('WorkoutsSelection', 'outdoors', 'upperBody', null)).toBe('OUTDOORS / UPPER');
  });

  test('Outdoors / Lower Body header displays correctly', () => {
    expect(findWorkoutsSelectionTitle('WorkoutsSelection', 'outdoors', 'lowerBody', null)).toBe('OUTDOORS / ABT');
  });
});

describe('Find Nutrition Header Title', () => {
  test('Recipe screen header displays correctly', () => {
    expect(findNutritionHeaderTitle('Recipe')).toBe('RECIPE');
  });

  test('Method screen header display correctly', () => {
    expect(findNutritionHeaderTitle('RecipeSteps')).toBe('METHOD');
  });
});
