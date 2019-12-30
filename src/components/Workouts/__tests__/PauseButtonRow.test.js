import React from 'react';
import renderer from 'react-test-renderer';
import PauseButtonRow from '../PauseButtonRow';

describe('Pause Button Row', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<PauseButtonRow
      nextExerciseName="Test"
      handlePause={jest.fn()}
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
