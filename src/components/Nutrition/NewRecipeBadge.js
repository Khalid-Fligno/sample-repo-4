import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';

const NewRecipeBadge = () => (
  <View style={styles.newRecipeBadgeContainer}>
    <Text style={styles.newRecipeBadgeText}>NEW!</Text>
  </View>
);

const styles = StyleSheet.create({
  newRecipeBadgeContainer: {
    backgroundColor: colors.violet.standard,
    borderRadius: 5,
    padding: 3,
    paddingBottom: 0,
    marginLeft: 5,
    marginBottom: 4,
  },
  newRecipeBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.white,
  },
});

export default NewRecipeBadge;
