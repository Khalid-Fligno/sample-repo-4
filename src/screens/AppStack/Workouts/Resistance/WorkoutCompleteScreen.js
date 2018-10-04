import React from 'react';
import { StyleSheet, View, Text, AsyncStorage } from 'react-native';
import { FileSystem } from 'expo';
import { db } from '../../../../../config/firebase';
import colors from '../../../../styles/colors';

export default class WorkoutCompleteScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentWillMount = async () => {
    // const exerciseList = this.props.navigation.getParam('exerciseList', null);
    try {
      FileSystem.deleteAsync(`${FileSystem.cacheDirectory}exercise-6.mp4`, { idempotent: true });
    } catch (err) {
      console.log(err);
    }
    // try {
    //   await Promise.all(exerciseList.map(async (exercise, index) => {
    //     await FileSystem.deleteAsync(`${FileSystem.cacheDirectory}exercise-${index + 1}.mp4`);
    //   }));
    // } catch (err) {
    //   console.log(`Filesystem delete error: ${err}`);
    // }
  }
  componentDidMount = async () => {
    const uid = await AsyncStorage.getItem('uid');
    const userRef = db.collection('users').doc(uid);
    return db.runTransaction((transaction) => {
      return transaction.get(userRef).then((userDoc) => {
        const newResistanceWeeklyComplete = userDoc.data().resistanceWeeklyComplete + 1;
        transaction.update(userRef, { resistanceWeeklyComplete: newResistanceWeeklyComplete });
      });
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>
          Workout Complete
        </Text>
        <Text
          onPress={() => this.props.navigation.navigate('WorkoutsHome')}
        >
          Done
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
