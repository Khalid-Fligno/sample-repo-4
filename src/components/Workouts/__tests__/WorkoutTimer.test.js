import React from 'react';
import renderer from 'react-test-renderer';
import WorkoutTimer from '../WorkoutTimer';

describe('Workout Timer', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<WorkoutTimer
      totalDuration={1}
      start
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
