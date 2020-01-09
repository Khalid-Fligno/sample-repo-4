import React from 'react';
import renderer from 'react-test-renderer';
import ProfileButton from '../ProfileButton';

describe('Profile Button', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<ProfileButton />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
