import React from 'react';
import { View, Image, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';
import Icon from '../components/Icon';
import colors from '../styles/colors';

const Header = ({
  navigation,
  withBackButton,
}) => (
  <SafeAreaView>
    <StatusBar
      barStyle="light-content"
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
              size={20}
              color={colors.black}
            />
        }
      </TouchableOpacity>
      <View
        style={styles.headerContentContainer}
      >
        <Image
          source={require('../../assets/icons/fitazfk-icon-outline.png')}
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

Header.propTypes = {
  withBackButton: PropTypes.bool,
};

Header.defaultProps = {
  withBackButton: false,
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    height: 50,
    borderTopColor: colors.grey.standard,
    borderTopWidth: 1,
    borderBottomColor: colors.grey.standard,
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
});

export default Header;
