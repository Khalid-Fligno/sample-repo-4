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
import AsyncStorage from '@react-native-community/async-storage';
import * as Localization from 'expo-localization';
import { ListItem } from 'react-native-elements';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';

import { db } from '../../../../config/firebase';
import Loader from '../../../components/Shared/Loader';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';
import globalStyle from '../../../styles/globalStyles';
import ProfileStyles from './ProfileStyles';
import HomeScreenStyle from '../Home/HomeScreenStyle';
import ProgressBar from '../../../components/Progress/ProgressBar';
import { heightPercentageToDP as hp ,widthPercentageToDP as wp} from 'react-native-responsive-screen';

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
      cicuit: 0,
      strength: 0,
      interval: 0
    };
  }
  componentDidMount = async () => {
    this.fetchProfile();
    this.fetchActiveChallengeUserData();
  }
  componentWillUnmount() {
    this.unsubscribe();
    this.unsubscribeFACUD();
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
          this.setState({ totalWorkoutCompleted: await doc.data().weeklyTargets.circuit + await doc.data().weeklyTargets.interval + await doc.data().weeklyTargets.strength })
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

  fetchActiveChallengeUserData = async () => {
    try {
      this.setState({ loading: true });
      const uid = await AsyncStorage.getItem("uid");
      this.unsubscribeFACUD = await db
        .collection("users")
        .doc(uid)
        .collection("challenges")
        .where("status", "==", "Active")
        .onSnapshot(async (querySnapshot) => {
          await querySnapshot.forEach(async (doc) => {
            const totalIntervalCompleted =
              await doc.data().workouts.filter(
                (res) => res.target === "interval"
              );
            const totalCircuitCompleted =
              await doc.data().workouts.filter(
                (res) => res.target === "circuit"
              );
            const totalStrengthCompleted =
              await doc.data().workouts.filter(
                (res) => res.target === "strength"
              ); 
            
            this.setState({
              cicuit: totalCircuitCompleted.length,
              strength: totalStrengthCompleted.length,
              interval: totalIntervalCompleted.length
            });

            console.log(totalCircuitCompleted.length, totalIntervalCompleted.length, totalStrengthCompleted.length)  
          });
        });
    } catch (err) {
      this.setState({ loading: false });
      console.log(err);
      Alert.alert("Fetch active challenge user data error!");
    }
  };

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
      totalWorkoutCompleted,
      strength,
      cicuit,
      interval
    } = this.state;
    return (
      <SafeAreaView style={globalStyle.safeContainer}>
        <View style={[globalStyle.container,{paddingHorizontal:0}]}>
          <ScrollView contentContainerStyle={globalStyle.scrollView}>
            <View style={ProfileStyles.listContainer}>
              <ListItem
                title="Name"
                titleStyle={ProfileStyles.listItemTitleStyle}
                subtitle={`${profile && profile.firstName} ${profile && profile.lastName}`}
                subtitleStyle={ProfileStyles.listItemSubtitleStyle}
                containerStyle={ProfileStyles.listItemContainer}
                hideChevron
              />
              <ListItem
                title="DOB"
                titleStyle={ProfileStyles.listItemTitleStyle}
                subtitle={profile && profile.dob}
                subtitleStyle={ProfileStyles.listItemSubtitleStyle}
                containerStyle={ProfileStyles.listItemContainer}
                hideChevron
                onPress={this.toggleDobModal}
              />
              <ListItem
                title="Email"
                titleStyle={ProfileStyles.listItemTitleStyle}
                subtitle={profile && profile.email}
                subtitleStyle={ProfileStyles.listItemSubtitleStyle}
                containerStyle={ProfileStyles.listItemContainer}
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
                titleStyle={ProfileStyles.listItemTitleStyle}
                subtitle={timezone}
                subtitleStyle={ProfileStyles.listItemSubtitleStyle}
                containerStyle={ProfileStyles.listItemContainerBottom}
                hideChevron
              />
                <View>
                    <View style={HomeScreenStyle.sectionHeader}>
                      <Text style={[HomeScreenStyle.bodyText]}>
                          Total workout complete
                      </Text>
                    </View>
                    <View style={{width:'100%',flexDirection:"row",justifyContent:"center"}}>
                        {
                              profile && (
                                <View>
                                  <ProgressBar
                                    completed={profile.totalWorkoutCompleted + profile.totalWorkoutCompleted + strength + cicuit + interval}
                                    total = {0}
                                    size ={wp('38%')}
                                    customProgessTotalStyle ={{marginLeft:0,marginTop:0,marginBottom:0}}
                                  />
                                </View>
                              )
                            }
                    </View>
                  </View>
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
          <View style={globalStyle.modalContainer}>
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
              style={globalStyle.modalButton}
            >
              <Text style={globalStyle.modalButtonText}>
                DONE
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}

