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
var tileHeight = 200;
export default class Tile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(1);
  }
  handlePressIn = () => {
    Animated.spring(this.animatedValue, {
      toValue: 0.92,
      useNativeDriver: true 
    }).start();
  }
  handlePressOut = () => {
    Animated.spring(this.animatedValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true 
    }).start();
  }
  render() {
    const {
      onPress,
      title1,
      image,
      disabled,
      showTitle,
      overlayTitle,
      height,
      customContainerStyle,
      showTitleStyle,
      overlayTitleStyle,
      imageUrl
    } = this.props;
    tileHeight = height
    const animatedStyle = {
      transform: [{ scale: this.animatedValue }],
    };
    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        style={[styles.cardContainer,customContainerStyle]}
        onPressIn={this.handlePressIn}
        onPressOut={this.handlePressOut}
      >
        <Animated.View
          style={[styles.flexContainer, animatedStyle]}
        >
          <ImageBackground
            source={imageUrl?{uri:imageUrl}:image}
            style={styles.image}
          >
            {
              overlayTitle && (<View style={styles.opacityLayer}>
                <Text style={[styles.title,overlayTitleStyle]}>
                 {title1.toUpperCase()}
                </Text>
              </View>)
            } 
          </ImageBackground>
        </Animated.View>
        <View>
         { showTitle && (<Text style={[styles.title,showTitleStyle]}>
            {title1}
          </Text>)}
        </View>
      </TouchableOpacity>
    );
  }
}

Tile.propTypes = {
  onPress: PropTypes.func.isRequired,
  title1: PropTypes.string.isRequired,
  image: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
  height: PropTypes.number,
  customContainerStyle: PropTypes.object,
  showTitleStyle:PropTypes.object,
  overlayTitleStyle:PropTypes.object,
  imageUrl:PropTypes.string
};

Tile.defaultProps = {
  disabled: false,
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 0.25,
    margin: 5,
    marginTop:0,
    // width,
    shadowColor: colors.charcoal.standard,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    height:tileHeight
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
  opacityLayer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.transparentBlackLightest,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.black,
    // shadowColor: colors.black,
    // shadowOpacity: 1,
    marginTop:10,
    marginBottom:10,
    // shadowOffset: { width: 0, height: 0 },
    // shadowRadius: 5,
    width:'100%',
    textTransform:'capitalize'
  },
});
