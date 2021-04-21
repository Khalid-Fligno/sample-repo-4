import React from 'react';
import renderer from 'react-test-renderer';
import ExerciseInfoModal from '../ExerciseInfoModal';

describe('Exercise Info Modal', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<ExerciseInfoModal
      exerciseInfoModalVisible
      hideExerciseInfoModal={jest.fn()}
      exercise={{ displayName: 'Test', exercises: [] }}
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
