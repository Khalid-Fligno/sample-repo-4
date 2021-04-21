import React from 'react';
import renderer from 'react-test-renderer';
import ImageModal from '../ImageModal';

describe('Image Modal', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<ImageModal
      imageModalVisible
      toggleImageModal={jest.fn()}
      color="Test"
      imageSource={{ uri: 'test' }}
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
