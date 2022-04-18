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
import { specialOfferStyle } from '../../styles/offer/specialOfferStyle';

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
        style={specialOfferStyle.flexContainer}
      >
        <View style={specialOfferStyle.contentContainer}>
          <Text style={specialOfferStyle.headingLarge}>
            FK YEAH!
          </Text>
          <Text style={specialOfferStyle.heading}>
            HIT THE BUTTON BELOW TO SCORE YOUR
          </Text>
          <Text style={specialOfferStyle.headingLarge}>
            1 MONTH FREE{'\n'}+{'\n'}20% OFF!*
          </Text>
          <Button
            title="REDEEM OFFER NOW"
            onPress={clickContinue}
            activeOpacity={0.7}
            buttonStyle={specialOfferStyle.button}
            titleStyle={specialOfferStyle.buttonText}
          />
        </View>
        <Text style={specialOfferStyle.disclaimer}>
          *Based on Australian App store prices.  Discount may be higher or lower based on your local App Store territory pricing tiers.
        </Text>
      </ImageBackground>
    </SafeAreaView>
  );
}