import React from 'react';
import renderer from 'react-test-renderer';
import Loader from '../Loader';

describe('Loader', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Loader
      loading={false}
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
