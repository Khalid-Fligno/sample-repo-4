import React from 'react';
import { StyleSheet, View, Text, AsyncStorage } from 'react-native';
import { Pedometer } from 'expo';
import { db } from '../../../../config/firebase';
import WorkoutProgress from '../../../components/WorkoutProgress';
import colors from '../../../styles/colors';

export default class ProfileHomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      // stepCount: 0,
    };
  }
  componentDidMount() {
    // this.getPedometerInfo();
    this.fetchProfile();
  }

  getPedometerInfo = () => {
    try {
      const end = new Date();
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      Pedometer.getStepCountAsync(start, end).then((result) => {
        this.setState({ stepCount: result.steps });
      });
    } catch (err) {
      this.setState({ stepCount: 'Pedometer info not available' });
    }
  }
  fetchProfile = async () => {
    const uid = await AsyncStorage.getItem('uid');
    console.log(uid)
    db.collection('users').doc(uid)
      .onSnapshot(async (doc) => {
        this.setState({ profile: await doc.data() });
      });
  }
  render() {
    const { profile } = this.state;
    console.log(profile)
    return (
      <View style={styles.container}>
        <Text>
          ProfileHomeScreen
        </Text>
        <Text>
          {profile && profile.firstName}
        </Text>
        {/* <Text>Walk! And watch this go up: {this.state.stepCount}</Text> */}
        <WorkoutProgress
          currentExercise={5}
          currentSet={2}
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
