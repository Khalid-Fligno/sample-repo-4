import React from 'react';
import renderer from 'react-test-renderer';
import HiitCircuitWorkoutProgress from '../HiitCircuitWorkoutProgress';

describe('Hiit Circuit Workout Progress', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<HiitCircuitWorkoutProgress
      currentExercise={1}
      currentSet={1}
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
