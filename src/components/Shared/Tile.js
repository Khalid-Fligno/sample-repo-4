import React from 'react';
import { View, ImageBackground, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import PropTypes from 'prop-types';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const { width } = Dimensions.get('window');

export default class Tile extends React.PureComponent {
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
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {title1.toUpperCase()}
              </Text>
            </View>
          </ImageBackground>
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

Tile.propTypes = {
  onPress: PropTypes.func.isRequired,
  title1: PropTypes.string.isRequired,
  image: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
};

Tile.defaultProps = {
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
  flexContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    overflow: 'hidden',
  },
  titleContainer: {
    backgroundColor: colors.transparentWhite,
    paddingTop: 8,
    paddingRight: 12,
    paddingBottom: 3,
    paddingLeft: 12,
    borderRadius: 2,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.black,
    textAlign: 'center',
  },
});
