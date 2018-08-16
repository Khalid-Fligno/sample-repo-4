import React from 'react';
import { StyleSheet, View, Text, AsyncStorage } from 'react-native';
import { db } from '../../../../config/firebase';
import Loader from '../../../components/Loader';
import colors from '../../../styles/colors';

export default class EditProfileScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      loading: false,
    };
  }
  componentDidMount() {
    this.fetchProfile();
  }
  fetchProfile = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    db.collection('users').doc(uid)
      .onSnapshot(async (doc) => {
        this.setState({ profile: await doc.data(), loading: false });
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
        <Text>
          ProfileHomeScreen
        </Text>
        <Text>
          {profile && profile.firstName}
        </Text>
        <Text>
          {profile && profile.lastName}
        </Text>
        <Text>
          {profile && profile.email}
        </Text>
        <Text>
          {profile && profile.dob}
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
