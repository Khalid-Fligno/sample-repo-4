import React from 'react';
import { View, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import colors from '../styles/colors';

const Header = () => (
  <SafeAreaView>
    <StatusBar
      barStyle="light-content"
    />
    <View
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: colors.coral.standard,
        height: 50,
        shadowColor: colors.coral.standard,
        shadowOpacity: 0.8,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
      }}
    >
      <Image
        source={require('../../assets/icons/fitazfk-icon-solid-white.png')}
        style={{
          width: 30,
          height: 30,
          marginBottom: 10,
        }}
      />
    </View>
  </SafeAreaView>
);

export default Header;
