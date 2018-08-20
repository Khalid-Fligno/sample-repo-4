import React from 'react';
import SwitchNavigator from './config/router/index';

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
