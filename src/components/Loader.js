import React from 'react';
import { View, StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { DotIndicator } from 'react-native-indicators';
import PropTypes from 'prop-types';
import colors from '../styles/colors';

const Loader = ({
  loading,
  color,
  overlayColor,
}) => (
  <View style={styles.loaderContainer}>
    <Spinner
      visible={loading}
      animation="fade"
      size="small"
      overlayColor={overlayColor}
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
  overlayColor: PropTypes.string,
};

Loader.defaultProps = {
  overlayColor: 'rgba(0, 0, 0, 0.3)',
};

const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default Loader;
