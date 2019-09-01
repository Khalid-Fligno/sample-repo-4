import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';

const SavingsBadge = ({ text }) => (
  <View style={styles.newRecipeBadgeContainer}>
    <Text style={styles.newRecipeBadgeText}>{text}</Text>
  </View>
);

SavingsBadge.propTypes = {
  text: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  newRecipeBadgeContainer: {
    backgroundColor: colors.coral.standard,
    borderRadius: 2,
    padding: 3,
    paddingBottom: 0,
    marginLeft: 8,
    marginBottom: 6,
  },
  newRecipeBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 8,
    color: colors.white,
  },
});

export default SavingsBadge;
