import React from 'react';
import {
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import PropTypes from 'prop-types';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const { width } = Dimensions.get('window');

export default class WorkoutTile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(1);
  }
  handlePressIn = () => {
    Animated.spring(this.animatedValue, {
      toValue: 0.92,
    }).start();
  }
  handlePressOut = () => {
    Animated.spring(this.animatedValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
    }).start();
  }
  render() {
    const {
      onPress,
      title1,
      image,
      disabled,
      // cycleTargets,
      // resistanceCategoryId,
    } = this.props;
    const animatedStyle = {
      transform: [{ scale: this.animatedValue }],
    };
    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        style={styles.cardContainer}
        onPressIn={this.handlePressIn}
        onPressOut={this.handlePressOut}
      >
        <Animated.View
          style={[styles.flexContainer, animatedStyle]}
        >
          <ImageBackground
            source={image}
            style={styles.image}
          >
            <View style={styles.opacityLayer}>
              <Text style={styles.title}>
                {title1.toUpperCase()}
              </Text>
              {/* {
                cycleTargets !== undefined && (
                  <Text style={styles.targetText}>
                    {
                      cycleTargets !== undefined && `Completed: ${cycleTargets[resistanceCategoryId]}`
                    }
                  </Text>
                )
              } */}
            </View>
          </ImageBackground>
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

WorkoutTile.propTypes = {
  onPress: PropTypes.func.isRequired,
  title1: PropTypes.string.isRequired,
  // cycleTargets: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  // resistanceCategoryId: PropTypes.number,
  image: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
};

WorkoutTile.defaultProps = {
  disabled: false,
  // cycleTargets: undefined,
  // resistanceCategoryId: undefined,
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
  flexContainer: {
    flex: 1,
  },
  image: {
    backgroundColor: colors.black,
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
  // targetText: {
  //   fontFamily: fonts.standard,
  //   fontSize: 12,
  //   color: colors.white,
  //   textAlign: 'center',
  //   shadowColor: colors.black,
  //   shadowOpacity: 1,
  //   shadowOffset: { width: 0, height: 0 },
  //   shadowRadius: 5,
  // },
});
