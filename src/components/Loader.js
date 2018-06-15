import React from 'react';
import { View, StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { DotIndicator } from 'react-native-indicators';
import PropTypes from 'prop-types';
import colors from '../styles/colors';

const Loader = ({
  loading,
  color,
}) => (
  <View style={styles.loaderContainer}>
    <Spinner
      visible={loading}
      animation="fade"
      size="small"
      overlayColor="rgba(0, 0, 0, 0)"
    >
      <DotIndicator
        color={color}
        count={3}
        size={10}
      />
    </Spinner>
  </View>
);

Loader.propTypes = {
  loading: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default Loader;
