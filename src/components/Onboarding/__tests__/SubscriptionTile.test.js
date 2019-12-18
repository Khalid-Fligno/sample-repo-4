import React from 'react';
import renderer from 'react-test-renderer';
import SubscriptionTile from '../SubscriptionTile';

describe('New Recipe Badge', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<SubscriptionTile
      title="Test"
      price="Test"
      term="Test"
      onPress={jest.fn()}
      priceNumber={1}
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
