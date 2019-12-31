import React from 'react';
import renderer from 'react-test-renderer';
import WorkoutPauseModal from '../WorkoutPauseModal';

describe('Workout Pause Modal', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<WorkoutPauseModal
      isVisible
      handleQuit={jest.fn()}
      handleRestart={jest.fn()}
      handleUnpause={jest.fn()}
      exerciseList={[{ test: 'Test' }]}
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
