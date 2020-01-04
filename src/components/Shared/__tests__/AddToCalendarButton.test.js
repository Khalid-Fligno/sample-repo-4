import React from 'react';
import renderer from 'react-test-renderer';
import AddToCalendarButton from '../AddToCalendarButton';

describe('Contact Row', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<AddToCalendarButton
      onPress={jest.fn()}
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
