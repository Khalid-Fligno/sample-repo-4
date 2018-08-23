import React from 'react';
import { StyleSheet, View, AsyncStorage, ScrollView, Dimensions } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { DangerZone } from 'expo';
import { db } from '../../../../config/firebase';
import Loader from '../../../components/Loader';
import Icon from '../../../components/Icon';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { Localization } = DangerZone;
const { width } = Dimensions.get('window');

const moment = require('moment');

export default class ProfileHomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      loading: false,
      timezone: null,
    };
  }
  componentDidMount = async () => {
    this.fetchProfile();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchProfile = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    const timezone = await Localization.getCurrentTimeZoneAsync();
    this.unsubscribe = db.collection('users').doc(uid)
      .onSnapshot(async (doc) => {
        if (doc.exists) {
          this.setState({
            profile: await doc.data(),
            timezone,
            loading: false,
          });
        } else {
          this.setState({ loading: false });
        }
      });
  }
  render() {
    const { profile, timezone, loading } = this.state;
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
          <List containerStyle={styles.listContainer}>
            <ListItem
              title="Name"
              titleStyle={styles.listItemTitleStyle}
              subtitle={`${profile && profile.firstName} ${profile && profile.lastName}`}
              subtitleStyle={styles.listItemSubtitleStyle}
              containerStyle={styles.listItemContainer}
              hideChevron
            />
            <ListItem
              title="Age"
              titleStyle={styles.listItemTitleStyle}
              subtitle={profile && moment().diff(profile.dob, 'years')}
              subtitleStyle={styles.listItemSubtitleStyle}
              containerStyle={styles.listItemContainer}
              hideChevron
            />
            <ListItem
              title="Email"
              titleStyle={styles.listItemTitleStyle}
              subtitle={profile && profile.email}
              subtitleStyle={styles.listItemSubtitleStyle}
              containerStyle={styles.listItemContainer}
              hideChevron
            />
            <ListItem
              title="Timezone"
              titleStyle={styles.listItemTitleStyle}
              subtitle={timezone}
              subtitleStyle={styles.listItemSubtitleStyle}
              containerStyle={styles.listItemContainer}
              hideChevron
            />
          </List>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
  },
  scrollView: {
    paddingTop: 15,
    alignItems: 'center',
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 24,
  },
  listContainer: {
    width,
    marginBottom: 20,
    borderColor: colors.grey.light,
  },
  listItemContainer: {
    borderBottomColor: colors.grey.light,
    backgroundColor: colors.white,
  },
  listItemTitleStyle: {
    fontFamily: fonts.bold,
    color: colors.charcoal.standard,
    fontSize: 16,
  },
  listItemSubtitleStyle: {
    fontFamily: fonts.bold,
    color: colors.grey.standard,
    fontSize: 16,
    marginTop: 5,
  },
});
