import React from 'react';
import { Dimensions, TouchableOpacity, Text, StyleSheet, ImageBackground } from 'react-native';
import PropTypes from 'prop-types';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { View } from '../../node_modules/react-native-animatable';

const { width } = Dimensions.get('window');

const NewsFeedTile = ({
  onPress,
  title,
  // subTitle,
  image,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.cardContainer}
  >
    <ImageBackground
      // source={{ uri: image }}
      source={image}
      style={styles.image}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {title.toUpperCase()}
        </Text>
      </View>
    </ImageBackground>
  </TouchableOpacity>
);

NewsFeedTile.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  // image: PropTypes.string.isRequired,
  image: PropTypes.number.isRequired,
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    margin: 5,
    height: 100,
    shadowColor: colors.grey.dark,
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 1.5,
  },
  image: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 1,
  },
  titleContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.6 )',
    padding: 8,
    paddingBottom: 3,
    maxWidth: width / 2.1,
    borderRadius: 1,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 15,
    textAlign: 'center',
  },
});

export default NewsFeedTile;
