import React from 'react';
import renderer from 'react-test-renderer';
import WorkoutTile from '../WorkoutTile';

describe('Workout Tile', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<WorkoutTile
      onPress={jest.fn()}
      title1="Test"
      image={1}
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
