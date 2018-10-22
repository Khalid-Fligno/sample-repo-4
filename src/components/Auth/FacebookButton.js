import React from 'react';
import { Dimensions, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const { width } = Dimensions.get('window');

const FacebookButton = ({
  title,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.button}
  >
    <Image
      source={require('../../../assets/icons/facebook-icon-white.png')}
      style={styles.facebookIcon}
    />
    <Text
      style={styles.buttonText}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

FacebookButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(59,89,152)',
    height: 50,
    width: width - 30,
    marginTop: 8,
    borderRadius: 4,
    shadowColor: colors.charcoal.dark,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  facebookIcon: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  buttonText: {
    marginTop: 4,
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.white,
  },
});

export default FacebookButton;
