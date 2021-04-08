import React from 'react';
import renderer from 'react-test-renderer';
import RecipeTileSkeleton from '../RecipeTileSkeleton';

describe('Recipe Tile', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<RecipeTileSkeleton />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
