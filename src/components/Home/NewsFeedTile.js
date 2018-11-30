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

export default class NewsFeedTile extends React.PureComponent {
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
      title,
      image,
    } = this.props;
    const animatedStyle = {
      transform: [{ scale: this.animatedValue }],
    };
    return (
      <TouchableOpacity
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
                {title.toUpperCase()}
              </Text>
            </View>
          </ImageBackground>
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

NewsFeedTile.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  image: PropTypes.number.isRequired,
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    margin: 5,
    height: 100,
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
    borderRadius: 2,
  },
  titleContainer: {
    backgroundColor: colors.transparentWhite,
    padding: 8,
    paddingBottom: 3,
    maxWidth: width / 1.8,
    borderRadius: 2,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 15,
    textAlign: 'center',
  },
});
