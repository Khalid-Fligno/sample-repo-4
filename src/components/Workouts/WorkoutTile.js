import React from 'react';
import {
  View,
  // ImageBackground,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const { width } = Dimensions.get('window');

const WorkoutTile = ({
  onPress,
  title1,
  // image,
  disabled,
  cycleTargets,
  resistanceCategoryId,
}) => (
  <TouchableOpacity
    disabled={disabled}
    onPress={onPress}
    style={styles.cardContainer}
  >
    <View
      style={[styles.image, disabled && styles.imageDisabled]}
    >
      <View style={styles.opacityLayer}>
        <Text style={styles.title}>
          {title1.toUpperCase()}
        </Text>
        <Text style={styles.targetText}>
          {
            cycleTargets && `Completed: ${cycleTargets[resistanceCategoryId]}`
          }
        </Text>
      </View>
    </View>
    {/* <ImageBackground
      source={image}
      style={styles.image}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {title1.toUpperCase()}
        </Text>
      </View>
    </ImageBackground> */}
  </TouchableOpacity>
);

WorkoutTile.propTypes = {
  onPress: PropTypes.func.isRequired,
  title1: PropTypes.string.isRequired,
  cycleTargets: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])).isRequired,
  resistanceCategoryId: PropTypes.number.isRequired,
  // image: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
};

WorkoutTile.defaultProps = {
  disabled: false,
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 0.25,
    margin: 5,
    paddingLeft: 10,
    paddingRight: 10,
    width,
    shadowColor: colors.charcoal.standard,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  image: {
    backgroundColor: colors.black,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    overflow: 'hidden',
  },
  imageDisabled: {
    backgroundColor: colors.grey.standard,
    opacity: 0.5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    overflow: 'hidden',
  },
  opacityLayer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.transparentBlackLight,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.white,
    textAlign: 'center',
    shadowColor: colors.black,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
  },
  targetText: {
    fontFamily: fonts.standard,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default WorkoutTile;
