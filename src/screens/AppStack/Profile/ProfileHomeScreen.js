import React from 'react';
import { StyleSheet, View, Text, AsyncStorage, Button, ScrollView } from 'react-native';
// import { Pedometer } from 'expo';
import { db } from '../../../../config/firebase';
import Loader from '../../../components/Loader';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

export default class ProfileHomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      loading: false,
      // stepCount: 0,
    };
  }
  componentDidMount() {
    // this.getPedometerInfo();
    this.fetchProfile();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  // getPedometerInfo = () => {
  //   try {
  //     const end = new Date();
  //     const start = new Date();
  //     start.setHours(0, 0, 0, 0);
  //     Pedometer.getStepCountAsync(start, end).then((result) => {
  //       this.setState({ stepCount: result.steps });
  //     });
  //   } catch (err) {
  //     this.setState({ stepCount: 'Pedometer info not available' });
  //   }
  // }
  fetchProfile = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    this.unsubscribe = db.collection('users').doc(uid)
      .onSnapshot(async (doc) => {
        if (doc.exists) {
          this.setState({ profile: await doc.data(), loading: false });
        } else {
          this.setState({ loading: false });
        }
      });
  }
  render() {
    const { profile, loading } = this.state;
    if (loading) {
      return (
        <Loader
          loading={loading}
          color={colors.blue.standard}
        />
      );
    }
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: 24,
            }}
          >
            {profile && profile.firstName} {profile && profile.lastName}
          </Text>
          <Text>
            {profile && profile.email}
          </Text>
          <Text>
            {profile && profile.dob}
          </Text>
          <Button
            title="Edit Account Info"
            onPress={() => this.props.navigation.navigate('EditProfile')}
          />
          <Button
            title="Progress"
            onPress={() => this.props.navigation.navigate('Progress')}
          />
          {/* <Text>Walk! And watch this go up: {this.state.stepCount}</Text> */}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  scrollView: {
    padding: 15,
    alignItems: 'center',
  },
});
