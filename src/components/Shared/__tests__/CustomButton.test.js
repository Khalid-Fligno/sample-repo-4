import React from 'react';
import renderer from 'react-test-renderer';
import CustomButton from '../CustomButton';

describe('Custom Button', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<CustomButton
      onPress={jest.fn()}
      title="Test"
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
