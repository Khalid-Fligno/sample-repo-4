import React from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

export default class WorkoutsHomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigate('WorkoutsLocation', { workoutType: 'fullBody' })}
          style={styles.workoutButton}
        >
          <Text style={styles.workoutButtonText}>
            Full Body
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigate('WorkoutsLocation', { workoutType: 'upperBody' })}
          style={styles.workoutButton}
        >
          <Text style={styles.workoutButtonText}>
            Upper Body
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigate('WorkoutsLocation', { workoutType: 'lowerBody' })}
          style={styles.workoutButton}
        >
          <Text style={styles.workoutButtonText}>
            Lower Body
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigate('WorkoutsLocation', { workoutType: 'core' })}
          style={styles.workoutButton}
        >
          <Text style={styles.workoutButtonText}>
            Core
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
