import React from 'react';
import renderer from 'react-test-renderer';
import ContactRow from '../ContactRow';

describe('Contact Row', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<ContactRow
      onPress={jest.fn()}
      name="Test"
      emailOrNumber="Test"
      selected={false}
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
