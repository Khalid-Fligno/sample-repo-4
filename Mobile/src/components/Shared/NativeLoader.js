import React from 'react';
import { View, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import colors from '../../styles/colors';

const { width } = Dimensions.get('window');

const Loader = () => {
  return (
    <View style={styles.loaderContainer}>
      <View style={styles.contentContainer}>
        <ActivityIndicator />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    width,
    position: 'absolute',
    flex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.5,
    backgroundColor: colors.black,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.transparentLight,
  },
});

export default Loader;
