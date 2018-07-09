import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

export default class WorkoutsLocationScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { navigate, getParam } = this.props.navigation;
    const workoutType = getParam('workoutType', null);
    return (
      <View style={styles.container}>
        <Text>
          Workouts Location Screen
        </Text>
        <Text>
          {workoutType}
        </Text>
        <Button
          title="Gym"
          onPress={() => navigate('WorkoutsSelection', {
            workoutType,
            workoutLocation: 'Gym',
          })}
          containerViewStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          textStyle={styles.buttonText}
        />
        <Button
          title="Home"
          onPress={() => navigate('WorkoutsSelection', {
            workoutType,
            workoutLocation: 'Home',
          })}
          containerViewStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          textStyle={styles.buttonText}
        />
        <Button
          title="Park"
          onPress={() => navigate('WorkoutsSelection', {
            workoutType,
            workoutLocation: 'Park',
          })}
          containerViewStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          textStyle={styles.buttonText}
        />
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
  buttonContainer: {
    marginTop: 5,
    marginBottom: 5,
  },
  button: {
    width: width - 30,
    backgroundColor: colors.coral.standard,
    borderRadius: 4,
  },
  buttonText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.white,
    marginTop: 3,
  },
});
