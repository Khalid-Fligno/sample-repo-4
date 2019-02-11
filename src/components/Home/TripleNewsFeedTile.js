import React from 'react';
import {
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground,
  View,
  Animated,
} from 'react-native';
import PropTypes from 'prop-types';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const { width } = Dimensions.get('window');

export default class DoubleNewsFeedTile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.animatedValueLeft = new Animated.Value(1);
    this.animatedValueCenter = new Animated.Value(1);
    this.animatedValueRight = new Animated.Value(1);
  }
  handlePressInLeft = () => {
    Animated.spring(this.animatedValueLeft, {
      toValue: 0.92,
    }).start();
  }
  handlePressOutLeft = () => {
    Animated.spring(this.animatedValueLeft, {
      toValue: 1,
      friction: 3,
      tension: 40,
    }).start();
  }
  handlePressInCenter = () => {
    Animated.spring(this.animatedValueCenter, {
      toValue: 0.92,
    }).start();
  }
  handlePressOutCenter = () => {
    Animated.spring(this.animatedValueCenter, {
      toValue: 1,
      friction: 3,
      tension: 40,
    }).start();
  }
  handlePressInRight = () => {
    Animated.spring(this.animatedValueRight, {
      toValue: 0.92,
    }).start();
  }
  handlePressOutRight = () => {
    Animated.spring(this.animatedValueRight, {
      toValue: 1,
      friction: 3,
      tension: 40,
    }).start();
  }
  render() {
    const {
      imageLeft,
      imageCenter,
      imageRight,
      titleLeft,
      titleCenter,
      titleRight,
      onPressLeft,
      onPressCenter,
      onPressRight,
    } = this.props;
    const animatedStyleLeft = {
      transform: [{ scale: this.animatedValueLeft }],
    };
    const animatedStyleCenter = {
      transform: [{ scale: this.animatedValueCenter }],
    };
    const animatedStyleRight = {
      transform: [{ scale: this.animatedValueRight }],
    };
    return (
      <View style={styles.doubleTileContainer}>
        <TouchableOpacity
          delayPressIn={50}
          onPress={onPressLeft}
          style={styles.cardContainer}
          onPressIn={this.handlePressIn}
          onPressOut={this.handlePressOut}
        >
          <Animated.View
            style={[styles.flexContainer, animatedStyleLeft]}
          >
            <ImageBackground
              resizeMode="cover"
              source={imageLeft}
              style={styles.image}
            >
              <View style={styles.opacityLayer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>
                    {titleLeft}
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity
          delayPressIn={50}
          onPress={onPressCenter}
          style={styles.cardContainer}
          onPressIn={this.handlePressInCenter}
          onPressOut={this.handlePressOutCenter}
        >
          <Animated.View
            style={[styles.flexContainer, animatedStyleCenter]}
          >
            <ImageBackground
              resizeMode="cover"
              source={imageCenter}
              style={styles.image}
            >
              <View style={styles.opacityLayer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>
                    {titleCenter}
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity
          delayPressIn={50}
          onPress={onPressRight}
          style={styles.cardContainer}
          onPressIn={this.handlePressInRight}
          onPressOut={this.handlePressOutRight}
        >
          <Animated.View
            style={[styles.flexContainer, animatedStyleRight]}
          >
            <ImageBackground
              resizeMode="cover"
              source={imageRight}
              style={styles.image}
            >
              <View style={styles.opacityLayer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>
                    {titleRight}
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }
}

DoubleNewsFeedTile.propTypes = {
  imageLeft: PropTypes.number.isRequired,
  imageCenter: PropTypes.number.isRequired,
  imageRight: PropTypes.number.isRequired,
  titleLeft: PropTypes.string.isRequired,
  titleCenter: PropTypes.string.isRequired,
  titleRight: PropTypes.string.isRequired,
  onPressLeft: PropTypes.func.isRequired,
  onPressCenter: PropTypes.func.isRequired,
  onPressRight: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  doubleTileContainer: {
    flex: 1,
    height: (width - 30) / 3,
    flexDirection: 'row',
  },
  cardContainer: {
    flex: 1,
    margin: 5,
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
    overflow: 'hidden',
    borderRadius: 1,
  },
  opacityLayer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.transparentBlackLight,
  },
  titleContainer: {
    maxWidth: width / 2.4,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    textAlign: 'center',
    shadowColor: colors.black,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
  },
});
