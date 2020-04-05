import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  ImageBackground,
  Alert,
} from 'react-native';
import { Button } from 'react-native-elements';
import { auth } from '../../../config/firebase';
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
        this.props.navigation.navigate('Subscription', { specialOffer: true });
      } else {
        this.props.navigation.navigate('Landing', { specialOffer: true });
        Alert.alert('', 'Log in or sign up to redeem this offer');
      }
    });
  }
  render() {
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <ImageBackground
          source={require('../../../assets/images/special-offer-screen-background.jpg')}
          style={styles.flexContainer}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.headingLarge}>
              FK YEAH!
            </Text>
            <Text style={styles.heading}>
              HIT THE BUTTON BELOW TO SCORE YOUR
            </Text>
            <Text style={styles.headingLarge}>
              1 MONTH FREE{'\n'}+{'\n'}20% OFF!*
            </Text>
            <Button
              title="REDEEM OFFER NOW"
              onPress={this.continue}
              activeOpacity={0.7}
              buttonStyle={styles.button}
              titleStyle={styles.buttonText}
            />
            {/* <Text style={styles.bodyBold}>
              OFFER VALID FOR 24 HOURS ONLY!
            </Text> */}
          </View>
          <Text style={styles.disclaimer}>
            *Based on Australian App store prices.  Discount may be higher or lower based on your local App Store territory pricing tiers.
          </Text>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: colors.black,
  },
  flexContainer: {
    flex: 1,
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
    fontSize: 36,
    color: colors.white,
    marginBottom: 20,
    textAlign: 'center',
  },
  heading: {
    fontFamily: fonts.standard,
    fontSize: 20,
    color: colors.white,
    textAlign: 'center',
    padding: 15,
    paddingBottom: 0,
  },
  // bodyBold: {
  //   fontFamily: fonts.bold,
  //   fontSize: 18,
  //   color: colors.white,
  //   textAlign: 'center',
  //   padding: 30,
  // },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    width: 200,
    borderRadius: 4,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    backgroundColor: colors.coral.standard,
    shadowColor: colors.black,
  },
  buttonText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    marginTop: 3,
  },
  disclaimer: {
    fontFamily: fonts.standard,
    fontSize: 8,
    color: colors.white,
    textAlign: 'center',
    padding: 15,
  },
});
