import React from 'react';
import { StyleSheet, View, Text, AsyncStorage } from 'react-native';
import { FileSystem } from 'expo';
import { db } from '../../../../../config/firebase';
import colors from '../../../../styles/colors';

export default class HiitWorkoutCompleteScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentWillMount = async () => {
    try {
      FileSystem.deleteAsync(`${FileSystem.cacheDirectory}exercise-1.mp4`, { idempotent: true });
      FileSystem.deleteAsync(`${FileSystem.cacheDirectory}exercise-2.mp4`, { idempotent: true });
    } catch (err) {
      console.log(err);
    }
  }
  componentDidMount = async () => {
    const uid = await AsyncStorage.getItem('uid');
    const userRef = db.collection('users').doc(uid);
    return db.runTransaction((transaction) => {
      return transaction.get(userRef).then((userDoc) => {
        const newHiitWeeklyComplete = userDoc.data().hiitWeeklyComplete + 1;
        transaction.update(userRef, { hiitWeeklyComplete: newHiitWeeklyComplete });
      });
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>
          Hiit Workout Complete
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
