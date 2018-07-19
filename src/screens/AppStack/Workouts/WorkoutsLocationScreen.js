import React from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
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
        <TouchableOpacity
          onPress={() => navigate('WorkoutsSelection', {
            workoutType,
            workoutLocation: 'gym',
          })}
          style={styles.workoutButton}
        >
          <Text style={styles.workoutButtonText}>
            Gym
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigate('WorkoutsSelection', {
            workoutType,
            workoutLocation: 'home',
          })}
          style={styles.workoutButton}
        >
          <Text style={styles.workoutButtonText}>
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigate('WorkoutsSelection', {
            workoutType,
            workoutLocation: 'park',
          })}
          style={styles.workoutButton}
        >
          <Text style={styles.workoutButtonText}>
            Park
          </Text>
        </TouchableOpacity>
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
    paddingTop: 7.5,
    paddingBottom: 7.5,
  },
  buttonContainer: {
    marginTop: 5,
    marginBottom: 5,
  },
  workoutButton: {
    opacity: 0.9,
    flex: 1,
    justifyContent: 'flex-end',
    width: width - 30,
    marginTop: 7.5,
    marginBottom: 7.5,
    paddingLeft: 20,
    paddingBottom: 5,
    borderRadius: 4,
    backgroundColor: colors.coral.standard,
    shadowColor: colors.black,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  workoutButtonText: {
    fontFamily: fonts.boldItalic,
    fontSize: 34,
    color: colors.white,
  },
});
