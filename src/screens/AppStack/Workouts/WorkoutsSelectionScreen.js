import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { db } from '../../../../config/firebase';
import Loader from '../../../components/Loader';
import colors from '../../../styles/colors';

export default class WorkoutsSelectionScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      workouts: [],
    };
  }
  componentDidMount = () => {
    this.fetchWorkouts();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchWorkouts = async () => {
    this.setState({ loading: true });
    const type = this.props.navigation.getParam('workoutType', null);
    const location = this.props.navigation.getParam('workoutLocation', null);
    try {
      this.unsubscribe = db.collection('workouts')
        .where('type', '==', type)
        .where('location', '==', location)
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
      <Text
        key={workout.name}
        onPress={() => navigate('WorkoutInfo', { exercises: workout.exercises, workout })}
      >
        {workout.name}
      </Text>
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
  },
});
