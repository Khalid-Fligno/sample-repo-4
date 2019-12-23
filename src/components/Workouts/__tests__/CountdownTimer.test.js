import React from 'react';
import renderer from 'react-test-renderer';
import CountdownTimer from '../CountdownTimer';

describe('Countdown Timer', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<CountdownTimer
      totalDuration={1}
      handleFinish={jest.fn()}
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
