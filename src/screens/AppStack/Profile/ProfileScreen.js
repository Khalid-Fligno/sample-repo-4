import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  AsyncStorage,
  ScrollView,
  Dimensions,
} from 'react-native';
import * as Localization from 'expo-localization';
import { ListItem } from 'react-native-elements';
import { db } from '../../../../config/firebase';
import Loader from '../../../components/Shared/Loader';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

const moment = require('moment');

export default class ProfileHomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      profile: undefined,
      loading: false,
      timezone: undefined,
    };
  }
  componentDidMount = async () => {
    this.fetchProfile();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  toggleResistanceModal = () => {
    this.setState((prevState) => ({ resistanceModalVisible: !prevState.resistanceModalVisible }));
  }
  toggleHiitModal = () => {
    this.setState((prevState) => ({ hiitModalVisible: !prevState.hiitModalVisible }));
  }
  fetchProfile = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    const { timezone } = Localization;
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
    const {
      profile,
      timezone,
      loading,
    } = this.state;
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.listContainer}>
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
                subtitle={profile && `${moment().diff(profile.dob, 'years')}`}
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
                containerStyle={styles.listItemContainerBottom}
                hideChevron
              />
            </View>
            <Loader
              loading={loading}
              color={colors.charcoal.standard}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
  },
  scrollView: {
    paddingTop: 15,
    alignItems: 'center',
  },
  listContainer: {
    width,
    marginBottom: 20,
    shadowColor: colors.grey.standard,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  listItemContainer: {
    borderBottomColor: colors.grey.light,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
  },
  listItemContainerBottom: {
    backgroundColor: colors.white,
  },
  listItemTitleStyle: {
    fontFamily: fonts.bold,
    color: colors.grey.standard,
    fontSize: 14,
  },
  listItemSubtitleStyle: {
    fontFamily: fonts.bold,
    color: colors.charcoal.standard,
    fontSize: 14,
    marginTop: 5,
  },
});
