import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  AsyncStorage,
  Dimensions,
  ImageBackground,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Loader from '../../../components/Shared/Loader';
import CustomButton from '../../../components/Shared/CustomButton';
import { db } from '../../../../config/firebase';
import InviteFriends from '../../../components/Profile/InviteFriends';
import FreeGiftSection from '../../../components/Profile/FreeGiftSection';
import fonts from '../../../styles/fonts';
import colors from '../../../styles/colors';

const { width } = Dimensions.get('window');

export default class InviteFriendsScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      contactsView: false,
      friendsInvited: undefined,
      loading: false,
    };
  }
  componentDidMount() {
    this.fetchProfile();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchProfile = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    this.unsubscribe = await db.collection('users').doc(uid)
      .onSnapshot(async (doc) => {
        if (doc.exists) {
          this.setState({ friendsInvited: await doc.data().friendsInvited || undefined, loading: false });
        } else {
          this.setState({ loading: false });
        }
      });
  }
  switchView = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    this.setState({ contactsView: true });
  }
  recordInvites = async (numberOfInvites) => {
    const uid = await AsyncStorage.getItem('uid');
    const { friendsInvited } = this.state;
    const friendsInvitedNew = numberOfInvites + (friendsInvited || 0);
    const userRef = db.collection('users').doc(uid);
    await userRef.set({ friendsInvited: friendsInvitedNew }, { merge: true });
    this.setState({ contactsView: false });
  }
  render() {
    const { friendsInvited, contactsView, loading } = this.state;
    if (contactsView) {
      return (
        <InviteFriends
          recordInvites={this.recordInvites}
        />
      );
    }
    return (
      <SafeAreaView style={styles.safeContainer}>
        <ImageBackground
          source={require('../../../../assets/images/special-offer-screen-background.jpg')}
          style={styles.rewardsContainer}
        >
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Text style={styles.headingText}>INVITE FRIENDS AND</Text>
            <Text style={styles.headingText}>EARN FREE GIFTS!</Text>
            <Text style={styles.friendsInvitedNumber}>{(friendsInvited && friendsInvited) || 0}</Text>
            <Text style={styles.friendsInvitedText}>FRIENDS INVITED</Text>
            <FreeGiftSection
              isUnlocked={friendsInvited && friendsInvited >= 10}
              minimumInvites={10}
              giftName="Weekend Guide"
              promoCode="INVITE-WKEND-V4174"
            />
            <FreeGiftSection
              isUnlocked={friendsInvited && friendsInvited >= 20}
              minimumInvites={20}
              giftName="FitazFK Booty Bands"
              promoCode="INVITE-BOOTY-QE5MG"
            />
            <FreeGiftSection
              isUnlocked={friendsInvited && friendsInvited >= 30}
              minimumInvites={30}
              giftName="FitazFK Tank"
              promoCode="INVITE-TANK-QH9JP"
            />
            <Text style={styles.disclaimerText}>
              For use at www.fitazfk.com.  Postage not included for physical items.  Offer available for a limited time only.
            </Text>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <CustomButton
              title="SELECT CONTACTS"
              onPress={this.switchView}
              green
            />
          </View>
        </ImageBackground>
        <Loader
          loading={loading}
          color={colors.charcoal.standard}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
  scrollView: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 80,
  },
  rewardsContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headingText: {
    fontFamily: fonts.ultraItalic,
    fontSize: 18,
    color: colors.white,
  },
  friendsInvitedNumber: {
    fontFamily: fonts.ultraItalic,
    color: colors.white,
    fontSize: 48,
    marginTop: 10,
    marginBottom: 10,
  },
  friendsInvitedText: {
    fontFamily: fonts.standardNarrow,
    fontSize: 14,
    color: colors.white,
    marginBottom: 20,
  },
  disclaimerText: {
    fontFamily: fonts.standardNarrow,
    fontSize: 12,
    color: colors.white,
    margin: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    alignItems: 'center',
    width,
  },
});
