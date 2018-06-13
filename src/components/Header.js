import React from 'react';
import { View, Image, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from '../components/Icon';
import colors from '../styles/colors';

const Header = ({
  navigation,
  withBackButton,
}) => (
  <SafeAreaView>
    <StatusBar
      barStyle="light-content"
      backgroundColor={colors.coral.standard}
    />
    <View
      style={styles.headerContainer}
    >
      <TouchableOpacity
        style={styles.headerContentContainer}
        onPress={() => navigation.goBack()}
      >
        {
          withBackButton && 
            <Icon
              name="chevron-left"
              size={24}
              color={colors.white}
            />
        }
      </TouchableOpacity>
      <View
        style={styles.headerContentContainer}
      >
        <Image
          source={require('../../assets/icons/fitazfk-icon-solid-white.png')}
          style={{
            width: 30,
            height: 30,
          }}
        />
      </View>
      <View
        style={styles.headerContentContainer}
      />
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.coral.standard,
    height: 50,
    borderBottomColor: colors.coral.light,
    borderBottomWidth: 1,
    // shadowColor: colors.coral.standard,
    // shadowOpacity: 0.8,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 3,
  },
  headerContentContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Header;
