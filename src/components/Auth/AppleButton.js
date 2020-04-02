import PropTypes from 'prop-types';
import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const { width } = Dimensions.get('window');

const AppleButton = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.button}>
    <Image
      source={require('../../../assets/icons/apple-icon-black.png')}
      style={styles.appleIcon}
    />
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

AppleButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    height: 45,
    width: width - 30,
    marginTop: 8,
    borderRadius: 4,
    shadowColor: colors.charcoal.dark,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  appleIcon: {
    width: 28,
    height: 28,
    marginRight: 10,
  },
  buttonText: {
    marginTop: 6,
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.black,
  },
});

export default AppleButton;
