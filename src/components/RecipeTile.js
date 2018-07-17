import React from 'react';
import { Dimensions, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Card } from 'react-native-elements';
import PropTypes from 'prop-types';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

const { width } = Dimensions.get('window');

const RecipeTile = ({
  onPress,
  title,
  subTitle,
  image,
  tags
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.cardContainer}
  >
    <Card
      image={{ uri: image }}
      containerStyle={styles.card}
    >
      <Text style={styles.title}>
        {title}
      </Text>
      <Text style={styles.subTitle}>
        {subTitle}
      </Text>
      <View
        style={styles.tagContainer}
      >
        {
          tags && tags.map((tag) => (
            <View
              style={styles.tagCircle}
            >
              <Text
                style={styles.tagText}
              >
                {tag}
              </Text>
            </View>
          ))
      }
      </View>
    </Card>
  </TouchableOpacity>
);

RecipeTile.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
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
  tagContainer: {
    flexDirection: 'row',
  },
  tagCircle: {
    height: 24,
    width: 24,
    marginTop: 3,
    marginRight: 5,
    borderWidth: 2.5,
    borderColor: colors.violet.standard,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.violet.standard,
    marginTop: 4,
  },
});

export default RecipeTile;
