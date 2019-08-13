import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Alert,
  AsyncStorage,
} from 'react-native';
import CustomButton from '../../components/Shared/CustomButton';
import { auth, db } from '../../../config/firebase';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';

export default class SpecialOfferScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  continue = () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const uid = await AsyncStorage.getItem('uid');
        await db.collection('users').doc(uid)
          .get()
          .then(async (doc) => {
            if (await doc.data().subscriptionInfo.expiry > Date.now()) {
              this.props.navigation.navigate('App');
              Alert.alert('', 'This offer is only valid for users without an active subscription');
            } else {
              this.props.navigation.navigate('Subscription', { specialOffer: true });
            }
          });
      } else {
        this.props.navigation.navigate('Landing', { specialOffer: true });
        Alert.alert('', 'Log in or sign up to redeem this offer');
      }
    });
  }
  render() {
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <Text style={styles.headingLarge}>
              20% off*
            </Text>
            <Text style={styles.heading}>
              full-priced
            </Text>
            <Text style={styles.heading}>
              subscriptions
            </Text>
            <Text style={styles.body}>
              *Based on AU App Store prices.  Discount may be higher or lower based on your App Store territory pricing tiers.
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              title="REDEEM OFFER"
              onPress={this.continue}
              primary
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: colors.black,
  },
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingLarge: {
    fontFamily: fonts.ultraItalic,
    fontSize: 28,
    marginBottom: 20,
  },
  heading: {
    fontFamily: fonts.ultraItalic,
    fontSize: 20,
    marginBottom: 20,
  },
  body: {
    fontFamily: fonts.standard,
    fontSize: 10,
    padding: 15,
  },
  buttonContainer: {
    padding: 10,
  },
});
