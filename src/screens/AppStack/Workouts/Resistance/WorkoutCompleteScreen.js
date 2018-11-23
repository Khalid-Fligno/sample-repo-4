import React from 'react';
import { StyleSheet, View, Text, AsyncStorage, Alert } from 'react-native';
import { FileSystem } from 'expo';
import Loader from '../../../../components/Shared/Loader';
import { db } from '../../../../../config/firebase';
import colors from '../../../../styles/colors';

const updateTallies = (obj, resistanceCategoryId, newTally) => {
  return Object.assign({}, obj, { [resistanceCategoryId]: newTally });
};

export default class WorkoutCompleteScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      exerciseList: props.navigation.getParam('exerciseList', null),
      resistanceCategoryId: props.navigation.getParam('resistanceCategoryId', null),
    };
  }
  componentDidMount = async () => {
    try {
      Promise.all(this.state.exerciseList.map(async (exercise, index) => {
        FileSystem.deleteAsync(`${FileSystem.cacheDirectory}exercise-${index + 1}.mp4`, { idempotent: true });
      }));
    } catch (err) {
      Alert.alert('Filesystem delete error', `${err}`);
    }
  }
  completeWorkout = async (resistanceCategoryId) => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    const userRef = db.collection('users').doc(uid);
    this.updateWeekly(userRef);
    this.updateCycle(userRef, resistanceCategoryId);
    this.setState({ loading: false });
    this.props.navigation.navigate('WorkoutsHome');
  }
  updateWeekly = (userRef) => {
    return db.runTransaction((transaction) => {
      return transaction.get(userRef).then((userDoc) => {
        const newResistanceWeeklyComplete = userDoc.data().resistanceWeeklyComplete + 1;
        transaction.update(userRef, { resistanceWeeklyComplete: newResistanceWeeklyComplete });
      });
    });
  }
  updateCycle = (userRef, resistanceCategoryId) => {
    return db.runTransaction((transaction) => {
      return transaction.get(userRef).then((userDoc) => {
        const newResistanceCategoryTally = userDoc.data().completedWorkoutTally[resistanceCategoryId] + 1;
        const oldCompletedWorkoutTally = userDoc.data().completedWorkoutTally;
        const newCompletedWorkoutTally = updateTallies(oldCompletedWorkoutTally, resistanceCategoryId, newResistanceCategoryTally);
        transaction.update(userRef, { completedWorkoutTally: newCompletedWorkoutTally });
      });
    });
  }
  render() {
    const { loading, resistanceCategoryId } = this.state;
    return (
      <View style={styles.container}>
        <Text>
          Workout Complete
        </Text>
        <Text
          onPress={() => this.completeWorkout(resistanceCategoryId)}
        >
          Done
        </Text>
        <Loader
          color={colors.coral.standard}
          loading={loading}
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
});
