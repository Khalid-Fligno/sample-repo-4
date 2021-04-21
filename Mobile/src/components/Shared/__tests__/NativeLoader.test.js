import React from 'react';
import renderer from 'react-test-renderer';
import NativeLoader from '../NativeLoader';

describe('Native Loader', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<NativeLoader
      loading={false}
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
