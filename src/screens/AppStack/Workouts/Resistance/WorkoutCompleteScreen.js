import React from 'react';
import { StyleSheet, View, Text, AsyncStorage } from 'react-native';
import { FileSystem } from 'expo';
// import { StackActions, NavigationActions } from 'react-navigation';
import Loader from '../../../../components/Shared/Loader';
import { db } from '../../../../../config/firebase';
import colors from '../../../../styles/colors';

export default class WorkoutCompleteScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      exerciseList: props.navigation.getParam('exerciseList', null),
    };
  }
  componentDidMount = async () => {
    try {
      Promise.all(this.state.exerciseList.map(async (exercise, index) => {
        FileSystem.deleteAsync(`${FileSystem.cacheDirectory}exercise-${index + 1}.mp4`, { idempotent: true });
      }));
    } catch (err) {
      console.log(`Filesystem delete error: ${err}`);
    }
  }
  completeWorkout = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    const userRef = db.collection('users').doc(uid);
    return db.runTransaction((transaction) => {
      return transaction.get(userRef).then((userDoc) => {
        const newResistanceWeeklyComplete = userDoc.data().resistanceWeeklyComplete + 1;
        transaction.update(userRef, { resistanceWeeklyComplete: newResistanceWeeklyComplete });
        this.setState({ loading: false });
        this.props.navigation.navigate('WorkoutsHome');
      });
    });
  }
  render() {
    const { loading } = this.state;
    return (
      <View style={styles.container}>
        <Text>
          Workout Complete
        </Text>
        <Text
          onPress={() => this.completeWorkout()}
        >
          Done
        </Text>
        {
          loading && <Loader color={colors.coral.standard} loading={loading} />
        }
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
