import React from 'react';
import renderer from 'react-test-renderer';
import FreeGiftSection from '../FreeGiftSection';

describe('Free Gift Section', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<FreeGiftSection
      giftName="Test"
      minimumInvites={1}
      promoCode="Test"
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
