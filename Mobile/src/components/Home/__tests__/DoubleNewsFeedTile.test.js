import React from 'react';
import renderer from 'react-test-renderer';
import DoubleNewsFeedTile from '../DoubleNewsFeedTile';

describe('NewsFeedTile', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<DoubleNewsFeedTile
      imageLeft={1}
      imageRight={1}
      titleLeft1="Test Title Left"
      titleRight1="Test Title Right"
      onPressLeft={jest.fn()}
      onPressRight={jest.fn()}
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
