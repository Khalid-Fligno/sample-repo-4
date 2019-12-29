import React from 'react';
import renderer from 'react-test-renderer';
import SubscriptionScreen from '../SubscriptionScreen';

describe('Subscription Screen', () => {
  it('renders correctly', () => {
    const navigation = {
      getParam: jest.fn(),
    };
    const tree = renderer.create(<SubscriptionScreen navigation={navigation} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
