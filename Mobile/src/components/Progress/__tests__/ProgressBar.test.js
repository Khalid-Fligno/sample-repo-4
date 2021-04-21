import React from 'react';
import renderer from 'react-test-renderer';
import ProgressBar from '../ProgressBar';

describe('Progress Bar', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<ProgressBar
      progressBarType="Resistance"
      completedWorkouts={1}
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
