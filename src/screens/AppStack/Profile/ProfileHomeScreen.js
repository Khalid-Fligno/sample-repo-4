import React from 'react';
import { StyleSheet, View, Text, AsyncStorage, ScrollView, Dimensions } from 'react-native';
import { List, ListItem } from 'react-native-elements';
// import { Pedometer } from 'expo';
import { db } from '../../../../config/firebase';
import Loader from '../../../components/Loader';
import Icon from '../../../components/Icon';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

const list = [
  { title: 'Help & Support' },
  { title: 'Privacy Policy' },
  { title: 'Terms of Service' },
  { title: 'Billing Terms' },
  { title: 'Log Out' },
];

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
          color={colors.charcoal.standard}
        />
      );
    }
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Icon
            name="profile-outline"
            size={100}
            color={colors.charcoal.standard}
          />
          <Text
            style={{
              marginTop: 15,
              fontFamily: fonts.bold,
              fontSize: 24,
            }}
          >
            {profile && profile.firstName} {profile && profile.lastName}
          </Text>
          <List containerStyle={styles.listContainer}>
            <ListItem
              key="My Profile"
              title="My Profile"
              titleStyle={{
                fontFamily: fonts.bold,
                color: colors.charcoal.standard,
              }}
              onPress={() => this.props.navigation.navigate('Profile')}
            />
          </List>
          {/* <Text>Walk! And watch this go up: {this.state.stepCount}</Text> */}
          <List containerStyle={styles.listContainer}>
            {
              list.map((l) => (
                <ListItem
                  key={l.title}
                  title={l.title}
                  titleStyle={{
                    fontFamily: fonts.bold,
                    color: colors.charcoal.standard,
                  }}
                />
              ))
            }
          </List>
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
    paddingTop: 15,
    alignItems: 'center',
  },
  listContainer: {
    width,
    marginBottom: 20,
  },
});
