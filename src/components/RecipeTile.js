import React from 'react';
import { Dimensions, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';
import PropTypes from 'prop-types';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

const { width } = Dimensions.get('window');

const RecipeTile = ({
  onPress,
  title,
  subTitle,
  // imageSource,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.cardContainer}
  >
    <Card
      image={require('../../assets/images/recipes/baked-eggs-1024x768.png')}
      containerStyle={styles.card}
    >
      <Text style={styles.title}>
        {title}
      </Text>
      <Text style={styles.subTitle}>
        {subTitle}
      </Text>
    </Card>
  </TouchableOpacity>
);

RecipeTile.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
  // imageSource: PropTypes.string.isRequired,
};

RecipeTile.defaultProps = {
};

const styles = StyleSheet.create({
  cardContainer: {
    width,
    shadowColor: colors.black,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  card: {
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 0,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 18,
  },
  subTitle: {
    fontFamily: fonts.standard,
    fontSize: 12,
  },
});

export default RecipeTile;
