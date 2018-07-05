import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Pedometer } from 'expo';
import colors from '../../../styles/colors';

export default class ProfileHomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      stepCount: 0,
    };
  }
  componentDidMount() {
    this.getPedometerInfo();
  }
  getPedometerInfo = () => {
    try {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 1);
      Pedometer.getStepCountAsync(start, end).then((result) => {
        this.setState({ stepCount: result.steps });
      });
    } catch (err) {
      this.setState({ stepCount: 'Pedometer info not available' });
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <Text>
          ProfileHomeScreen
        </Text>
        <Text>Walk! And watch this go up: {this.state.stepCount}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
