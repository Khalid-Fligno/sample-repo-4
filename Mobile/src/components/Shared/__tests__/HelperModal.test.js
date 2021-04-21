import React from 'react';
import renderer from 'react-test-renderer';
import HelperModal from '../HelperModal';

describe('Helper Modal', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<HelperModal
      helperModalVisible={false}
      hideHelperModal={jest.fn()}
      headingText="Test"
      bodyText="Test"
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
