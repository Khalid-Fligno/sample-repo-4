import React from 'react';
import renderer from 'react-test-renderer';
import HiitWorkoutProgress from '../HiitWorkoutProgress';

describe('Hiit Workout Progress', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<HiitWorkoutProgress
      currentRound={1}
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
