import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import colors from '../../../styles/colors';

export default class WorkoutInfoScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      exercises: [],
    };
  }
  componentWillMount() {
    const exercises = this.props.navigation.getParam('exercises', null);
    this.setState({ exercises });
  }
  render() {
    const { exercises } = this.state;
    const exerciseList = exercises.map((exercise) => {
      return (
        <Text key={exercise}>
          {exercise}
        </Text>
      );
    });
    return (
      <View style={styles.container}>
        <Text>
          Workout Screen
        </Text>
        {exerciseList}
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
