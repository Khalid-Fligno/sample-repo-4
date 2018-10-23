import React from 'react';
import { View, StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { DotIndicator } from 'react-native-indicators';
import PropTypes from 'prop-types';
import colors from '../../styles/colors';

const Loader = ({
  loading,
  color,
  overlayColor,
}) => {
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Spinner
          visible
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
  }
  return null;
};

Loader.propTypes = {
  loading: PropTypes.bool.isRequired,
  color: PropTypes.string,
  overlayColor: PropTypes.string,
};

Loader.defaultProps = {
  overlayColor: 'rgba(0, 0, 0, 0.6)',
  color: colors.white,
};

const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default Loader;
