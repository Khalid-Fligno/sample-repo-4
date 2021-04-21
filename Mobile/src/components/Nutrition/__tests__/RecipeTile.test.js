import React from 'react';
import renderer from 'react-test-renderer';
import RecipeTile from '../RecipeTile';

describe('Recipe Tile', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<RecipeTile
      title="Test"
      subTitle="Test"
      image="Test"
      time="Test"
      onPress={jest.fn()}
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
