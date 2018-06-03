import React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { LinearGradient } from 'expo';

const Tile = ({ imageSrc, title }) => (
  <TouchableOpacity
    style={{
      margin: 10,
      shadowColor: 'black',
      shadowOpacity: 0.6,
      shadowOffset: { width: 0, height: 5 },
      shadowRadius: 5,
    }}
    activeOpacity={0.7}
  >
    <Image
      source={imageSrc}
      style={{
        width: 200,
        height: 120,
        borderRadius: 10,
      }}
    />
    <LinearGradient
      colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
      style={{
        position: 'absolute',
        bottom: 0,
        borderRadius: 10,
        width: 200,
        height: 120,
        display: 'flex',
        justifyContent: 'flex-end',
        paddingLeft: 12,
        paddingBottom: 4,
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
    </LinearGradient>
  </TouchableOpacity>
);

Tile.propTypes = {
  imageSrc: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

export default Tile;
