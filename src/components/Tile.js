import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

const Tile = ({ imageSrc, title }) => (
  <TouchableOpacity
    style={{
      margin: 10,
      shadowColor: 'black',
      shadowOpacity: 0.6,
      shadowOffset: { width: 0, height: 5 },
      shadowRadius: 7,
    }}
    activeOpacity={0.8}
  >
    <Image
      source={imageSrc}
      style={{
        width: 200,
        height: 120,
        borderRadius: 10,
      }}
    />
    <View
      style={{
        position: 'absolute',
        width: 200,
        height: 120,
        display: 'flex',
        justifyContent: 'flex-end',
        paddingLeft: 8,
      }}
    >
      <Text
        style={{
          color: 'white',
          fontSize: 18,
          fontFamily: 'GothamBold',
        }}
      >
        {title}
      </Text>
    </View>
  </TouchableOpacity>
);

Tile.propTypes = {
  imageSrc: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

export default Tile;
