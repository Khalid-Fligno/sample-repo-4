import React from 'react';
import renderer from 'react-test-renderer';
import Tile from '../Tile';

describe('Tile', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Tile
      onPress={jest.fn()}
      title1="Test"
      image={1}
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
