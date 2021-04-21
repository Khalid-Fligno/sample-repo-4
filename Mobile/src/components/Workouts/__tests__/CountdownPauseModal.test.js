import React from 'react';
import renderer from 'react-test-renderer';
import CountdownPauseModal from '../CountdownPauseModal';

describe('Countdown Pause Modal', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<CountdownPauseModal
      isVisible
      handleQuit={jest.fn()}
      handleUnpause={jest.fn()}
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
