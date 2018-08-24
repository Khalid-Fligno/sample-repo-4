import React from 'react';
import { View, ImageBackground, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

const { width } = Dimensions.get('window');

const Tile = ({
  image,
  title1,
  title2,
  onPress,
}) => (
  <TouchableOpacity
    style={styles.cardContainer}
    onPress={onPress}
  >
    <ImageBackground
      source={image}
      style={styles.image}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {title1}
        </Text>
        {
          title2 && (
            <Text style={styles.title}>
              {title2}
            </Text>
          )
        }
      </View>
    </ImageBackground>
  </TouchableOpacity>
);

Tile.propTypes = {
  image: PropTypes.number.isRequired,
  title1: PropTypes.string.isRequired,
  title2: PropTypes.string,
  onPress: PropTypes.func.isRequired,
};

Tile.defaultProps = {
  title2: null,
};

const styles = StyleSheet.create({
  cardContainer: {
    width: width - 20,
    flex: 1 / 4,
    margin: 5,
    height: 100,
    shadowColor: colors.grey.dark,
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 1.5,
  },
  image: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 1,
    paddingLeft: 15,
  },
  titleContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0 )',
    padding: 10,
    paddingBottom: 5,
    borderRadius: 2,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 26,
  },
});

export default Tile;
