import React from 'react';
import renderer from 'react-test-renderer';
import FacebookButton from '../FacebookButton';

describe('FacebookButton', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<FacebookButton title="Test" onPress={jest.fn()} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
