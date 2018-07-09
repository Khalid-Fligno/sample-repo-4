import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import colors from '../../../styles/colors';

export default class WorkoutsSelectionScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { getParam } = this.props.navigation;
    const workoutType = getParam('workoutType', null);
    const workoutLocation = getParam('workoutLocation', null);

    return (
      <View style={styles.container}>
        <Text>
          Workouts Selection Screen
        </Text>
        <Text>
          {workoutType}
        </Text>
        <Text>
          {workoutLocation}
        </Text>
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
