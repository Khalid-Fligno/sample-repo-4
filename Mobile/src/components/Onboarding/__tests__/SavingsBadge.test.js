import React from 'react';
import renderer from 'react-test-renderer';
import SavingsBadge from '../SavingsBadge';

describe('New Recipe Badge', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<SavingsBadge text="Test" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
