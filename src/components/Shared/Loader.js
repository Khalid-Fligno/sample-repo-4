import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { DotIndicator } from 'react-native-indicators';
import PropTypes from 'prop-types';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts'; 
const Loader = ({
  loading,
  color,
  overlayColor,
  text,
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
          <View style={styles.contentContainer}>
            <View style={styles.dotIndicatorContainer}>
              <DotIndicator
                color={colors.themeColor.color}
                count={3}
                size={10}
              />
            </View>
            {
              text && (
                <Text style={styles.loaderText}>
                  {text}
                </Text>
              )
            }
          </View>
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
  text: PropTypes.string,
};

Loader.defaultProps = {
  overlayColor: 'rgba(0, 0, 0, 0.6)',
  color: colors.white,
  text: undefined,
};

const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotIndicatorContainer: {
    height: 50,
  },
  loaderText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.bold,
    justifyContent: 'flex-start',
  },
});

export default Loader;
