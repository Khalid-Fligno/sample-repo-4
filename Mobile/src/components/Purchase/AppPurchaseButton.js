import React from 'react';
import {
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const { width } = Dimensions.get('window');

const AppPurchaseButton = ({
  title,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.button}
  >
    <Image
      source={require('../../../assets/icons/shopping-cart.png')}
      style={styles.purchaseIcon}
    />
    <Text
      style={styles.buttonText}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

AppPurchaseButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.facebookBlue,
    height: 45,
    width: width - 30,
    marginTop: 8,
    borderRadius: 4,
    shadowColor: colors.charcoal.dark,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  purchaseIcon: {
    width: 28,
    height: 28,
    marginRight: 10,
  },
  buttonText: {
    marginTop: 6,
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.white,
  },
});

export default AppPurchaseButton;
