import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ImageBackground,
  Alert,
} from 'react-native';
import { auth } from '../../config/firebase';
import { OTHERSIMG } from '../../library/images/others/others';
import { styles } from './style';

export const SpecialOfferScreen = ({navigation}) => {

  const clickContinue = () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate('Subscription', { specialOffer: true });
      } else {
        navigation.navigate('Landing', { specialOffer: true });
        Alert.alert('', 'Log in or sign up to redeem this offer');
      }
    });
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ImageBackground
        source={OTHERSIMG.SPECIALOFFERSCREENBACKGROUND}
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
            onPress={clickContinue}
            activeOpacity={0.7}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
          />
        </View>
        <Text style={styles.disclaimer}>
          *Based on Australian App store prices.  Discount may be higher or lower based on your local App Store territory pricing tiers.
        </Text>
      </ImageBackground>
    </SafeAreaView>
  );
}