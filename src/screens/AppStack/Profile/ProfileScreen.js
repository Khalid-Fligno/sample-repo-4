import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Dimensions,
  Clipboard,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
// import AsyncStorage from '@react-native-community/async-storage';
import * as Localization from 'expo-localization';
import { ListItem } from 'react-native-elements';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';

import { db } from '../../../../config/firebase';
import Loader from '../../../components/Shared/Loader';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const moment = require('moment-timezone');

const { width } = Dimensions.get('window');

export default class ProfileHomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      profile: undefined,
      loading: false,
      timezone: undefined,
      dobModalVisible: false,
      chosenDate: null,
    };
  }
  componentDidMount = async () => {
    this.fetchProfile();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  setDate = async (event, selectedDate) => {
    const currentDate = selectedDate;
    this.setState({ chosenDate: currentDate });
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
            chosenDate: new Date(await doc.data().dob),
          });
        } else {
          this.setState({ loading: false });
        }
      });
  }
  toggleDobModal = () => {
    this.setState((prevState) => ({ dobModalVisible: !prevState.dobModalVisible }));
  }
  closeDobModal = () => {
    this.setState({ dobModalVisible: false });
  }
  saveNewDob = async () => {
    this.closeDobModal();
    const { chosenDate } = this.state;
    const timezone = await Localization.timezone;
    const dob = moment.tz(chosenDate, timezone).format('YYYY-MM-DD');
    const uid = await AsyncStorage.getItem('uid');
    const userRef = db.collection('users').doc(uid);
    const data = {
      dob,
    };
    await userRef.set(data, { merge: true });
  }
  render() {
    const {
      profile,
      timezone,
      loading,
      dobModalVisible,
      chosenDate,
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
                title="DOB"
                titleStyle={styles.listItemTitleStyle}
                subtitle={profile && profile.dob}
                subtitleStyle={styles.listItemSubtitleStyle}
                containerStyle={styles.listItemContainer}
                hideChevron
                onPress={this.toggleDobModal}
              />
              <ListItem
                title="Email"
                titleStyle={styles.listItemTitleStyle}
                subtitle={profile && profile.email}
                subtitleStyle={styles.listItemSubtitleStyle}
                containerStyle={styles.listItemContainer}
                hideChevron
                onPress={() => {
                  if (profile && profile.email) {
                    Clipboard.setString(profile.email);
                    Alert.alert('', 'Email address copied to clipboard');
                  }
                }}
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
        <Modal
          isVisible={dobModalVisible}
          onBackdropPress={this.closeDobModal}
          animationIn="fadeIn"
          animationInTiming={600}
          animationOut="fadeOut"
          animationOutTiming={600}
        >
          <View style={styles.modalContainer}>
            <DateTimePicker
              mode="date"
              value={chosenDate}
              onChange={this.setDate}
              minimumDate={new Date(1940, 0, 1)}
              maximumDate={new Date(2008, 0, 1)}
              itemStyle={{
                fontFamily: fonts.standard,
              }}
            />
            <TouchableOpacity
              title="DONE"
              onPress={this.saveNewDob}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>
                DONE
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
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
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 4,
    overflow: 'hidden',
  },
  modalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.coral.standard,
    height: 50,
    width: '100%',
  },
  modalButtonText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    marginTop: 3,
  },
});
