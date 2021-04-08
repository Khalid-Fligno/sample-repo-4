import React from 'react';
import renderer from 'react-test-renderer';
import NutritionHomeScreen from '../NutritionHomeScreen';

describe('Nutrition Home Screen', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<NutritionHomeScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
