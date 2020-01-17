import React from 'react';
import renderer from 'react-test-renderer';
import HelpAndSupportScreen from '../HelpAndSupportScreen';

describe('HelpAndSupportScreen', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<HelpAndSupportScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
