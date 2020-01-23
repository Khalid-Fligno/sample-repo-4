import React from 'react';
import renderer from 'react-test-renderer';
import TermsOfServiceScreen from '../TermsOfServiceScreen';

jest.useFakeTimers();

describe('TermsOfServiceScreen', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<TermsOfServiceScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
