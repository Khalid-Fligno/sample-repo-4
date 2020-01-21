import React from 'react';
import renderer from 'react-test-renderer';
import PrivacyPolicyScreen from '../PrivacyPolicyScreen';

jest.useFakeTimers();

describe('PrivacyPolicyScreen', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<PrivacyPolicyScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
