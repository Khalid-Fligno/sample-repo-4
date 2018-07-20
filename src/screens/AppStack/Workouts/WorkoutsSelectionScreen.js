import React from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { db } from '../../../../config/firebase';
import Loader from '../../../components/Loader';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

export default class WorkoutsSelectionScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      workouts: [],
      loading: false,
    };
  }
  componentDidMount = async () => {
    await this.fetchWorkouts();
  }
  componentWillUnmount = async () => {
    await this.unsubscribe();
  }
  fetchWorkouts = async () => {
    this.setState({ loading: true });
    const type = this.props.navigation.getParam('workoutType', null);
    const location = this.props.navigation.getParam('workoutLocation', null);
    try {
      this.unsubscribe = await db.collection('workouts')
        .where(type, '==', true)
        .where(location, '==', true)
        .onSnapshot((querySnapshot) => {
          const workouts = [];
          querySnapshot.forEach((doc) => {
            workouts.push(doc.data());
          });
          this.setState({
            workouts,
            loading: false,
          });
        });
    } catch (err) {
      this.setState({ loading: false });
    }
  }
  render() {
    const { workouts, loading } = this.state;
    const { navigate, getParam } = this.props.navigation;
    const workoutType = getParam('workoutType', null);
    const workoutLocation = getParam('workoutLocation', null);
    const workoutList = workouts.map((workout) => (
      <TouchableOpacity
        key={workout.id}
        onPress={() => navigate('WorkoutInfo', { exercises: workout.exercises, workout })}
        style={styles.workoutButton}
      >
        <Text style={styles.workoutButtonText}>
          {workout.name}
        </Text>
      </TouchableOpacity>
    ));
    if (loading) {
      return (
        <Loader
          loading={loading}
          color={colors.coral.standard}
        />
      );
    }
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
        {workoutList}
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
