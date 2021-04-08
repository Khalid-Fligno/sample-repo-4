import React from 'react';
import renderer from 'react-test-renderer';
import ExerciseInfoButton from '../ExerciseInfoButton';

describe('Exercise Info Button', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<ExerciseInfoButton
      onPress={jest.fn()}
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
