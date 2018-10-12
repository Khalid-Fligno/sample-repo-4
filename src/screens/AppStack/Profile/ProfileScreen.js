import React from 'react';
import {
  StyleSheet,
  View,
  AsyncStorage,
  ScrollView,
  Dimensions,
  Picker,
  TouchableOpacity,
  Text,
} from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { DangerZone } from 'expo';
import Modal from 'react-native-modal';
import { db } from '../../../../config/firebase';
import Loader from '../../../components/Shared/Loader';
import Icon from '../../../components/Shared/Icon';
import { weeklySessionsPickerOptions } from '../../../utils';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { Localization } = DangerZone;
const { width } = Dimensions.get('window');

const moment = require('moment');

export default class ProfileHomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      profile: undefined,
      loading: false,
      timezone: undefined,
      resistanceModalVisible: false,
      resistanceWeeklyTarget: undefined,
      hiitModalVisible: false,
      hiitWeeklyTarget: undefined,
      buttonDisabled: false,
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
  updateWeeklyTarget = async (workoutType, newValue) => {
    this.setState({ buttonDisabled: true });
    const uid = await AsyncStorage.getItem('uid');
    const userRef = db.collection('users').doc(uid);
    let data;
    if (workoutType === 'resistance') {
      data = { resistanceWeeklyTarget: newValue };
      userRef.set(data, { merge: true });
      this.setState({ buttonDisabled: false });
      this.toggleResistanceModal();
    } else {
      data = { hiitWeeklyTarget: newValue };
      userRef.set(data, { merge: true });
      this.setState({ buttonDisabled: false });
      this.toggleHiitModal();
    }
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
            resistanceWeeklyTarget: await doc.data().resistanceWeeklyTarget,
            hiitWeeklyTarget: await doc.data().hiitWeeklyTarget,
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
      resistanceModalVisible,
      resistanceWeeklyTarget,
      hiitModalVisible,
      hiitWeeklyTarget,
      buttonDisabled,
    } = this.state;
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
            <ListItem
              title="Weekly Resistance Goal"
              titleStyle={styles.listItemTitleStyle}
              subtitle={profile && `${profile.resistanceWeeklyTarget} sessions`}
              subtitleStyle={styles.listItemSubtitleStyle}
              containerStyle={styles.listItemContainer}
              onPress={() => this.toggleResistanceModal()}
              rightIcon={<Icon name="edit-outline" size={20} color={colors.grey.dark} />}
            />
            <ListItem
              title="Weekly HIIT Goal"
              titleStyle={styles.listItemTitleStyle}
              subtitle={profile && `${profile.hiitWeeklyTarget} sessions`}
              subtitleStyle={styles.listItemSubtitleStyle}
              containerStyle={styles.listItemContainer}
              onPress={() => this.toggleHiitModal()}
              rightIcon={<Icon name="edit-outline" size={20} color={colors.grey.dark} />}
            />
          </List>
          <Modal
            isVisible={resistanceModalVisible}
            onBackdropPress={() => this.toggleResistanceModal()}
            animationIn="fadeIn"
            animationInTiming={600}
            animationOut="fadeOut"
            animationOutTiming={600}
          >
            <View style={styles.modalContainer}>
              <Picker
                selectedValue={resistanceWeeklyTarget}
                onValueChange={(value) => this.setState({ resistanceWeeklyTarget: value })}
              >
                {weeklySessionsPickerOptions.map((i) => (
                  <Picker.Item
                    key={i.value}
                    label={i.label}
                    value={i.value}
                  />
                ))}
              </Picker>
              <TouchableOpacity
                onPress={() => this.updateWeeklyTarget('resistance', resistanceWeeklyTarget)}
                disabled={buttonDisabled}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>
                  UPDATE
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.toggleResistanceModal()}
                disabled={buttonDisabled}
                style={styles.modalCancelButton}
              >
                <Text style={styles.modalButtonText}>
                  CANCEL
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal
            isVisible={hiitModalVisible}
            onBackdropPress={() => this.toggleHiitModal()}
            animationIn="fadeIn"
            animationInTiming={600}
            animationOut="fadeOut"
            animationOutTiming={600}
          >
            <View style={styles.modalContainer}>
              <Picker
                selectedValue={hiitWeeklyTarget}
                onValueChange={(value) => this.setState({ hiitWeeklyTarget: value })}
              >
                {weeklySessionsPickerOptions.map((i) => (
                  <Picker.Item
                    key={i.value}
                    label={i.label}
                    value={i.value}
                  />
                ))}
              </Picker>
              <TouchableOpacity
                onPress={() => this.updateWeeklyTarget('hiit', hiitWeeklyTarget)}
                disabled={buttonDisabled}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>
                  UPDATE
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.toggleHiitModal()}
                disabled={buttonDisabled}
                style={styles.modalCancelButton}
              >
                <Text style={styles.modalButtonText}>
                  CANCEL
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
          {
            loading && <Loader loading={loading} color={colors.charcoal.standard} />
          }
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
    color: colors.grey.standard,
    fontSize: 16,
  },
  listItemSubtitleStyle: {
    fontFamily: fonts.bold,
    color: colors.charcoal.standard,
    fontSize: 16,
    marginTop: 5,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 4,
    overflow: 'hidden',
  },
  modalCancelButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.charcoal.light,
    height: 50,
    width: '100%',
  },
  modalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.charcoal.standard,
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
