import React from 'react';
import Sentry from 'sentry-expo';
import SwitchNavigator from './config/router/index';

// Remove this once Sentry is correctly setup.
Sentry.enableInExpoDevelopment = true;

Sentry.config('https://ad25f20f55644584bd7ef1ffd7dfe1f1@sentry.io/1342308').install();

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <SwitchNavigator />
    );
  }
}
