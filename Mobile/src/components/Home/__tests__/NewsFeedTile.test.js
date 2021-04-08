import React from 'react';
import renderer from 'react-test-renderer';
import NewsFeedTile from '../NewsFeedTile';

describe('NewsFeedTile', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<NewsFeedTile
      image={1}
      title="Test Title"
      onPress={jest.fn()}
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
