import React from 'react';
import renderer from 'react-test-renderer';
import WorkoutProgress from '../WorkoutProgress';

describe('Workout Progress', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<WorkoutProgress
      currentExercise={1}
      currentSet={1}
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
