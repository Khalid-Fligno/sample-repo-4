import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import CustomButton from '../../components/Shared/CustomButton';
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
        this.props.navigation.navigate('Landing');
      }
    });
  }
  render() {
    return (
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
            *Based on Australian App store prices.  Discount may be higher or lower based on your App Store territory pricing tiers.
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
    );
  }
}

const styles = StyleSheet.create({
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
    fontSize: 14,
    padding: 15,
  },
  buttonContainer: {
    padding: 10,
  },
});
