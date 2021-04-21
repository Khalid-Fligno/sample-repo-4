import React from 'react';
import renderer from 'react-test-renderer';
import NewRecipeBadge from '../NewRecipeBadge';

describe('New Recipe Badge', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<NewRecipeBadge />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
