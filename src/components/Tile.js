import React from 'react';
import { View, ImageBackground, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

const { width } = Dimensions.get('window');

const Tile = ({
  onPress,
  title1,
  image,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.cardContainer}
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
  </TouchableOpacity>
);

Tile.propTypes = {
  onPress: PropTypes.func.isRequired,
  title1: PropTypes.string.isRequired,
  image: PropTypes.number.isRequired,
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    margin: 5,
    paddingLeft: 10,
    paddingRight: 10,
    width,
    shadowColor: colors.charcoal.standard,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  image: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 25,
    borderRadius: 2,
    overflow: 'hidden',
  },
  titleContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.65 )',
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

export default Tile;
