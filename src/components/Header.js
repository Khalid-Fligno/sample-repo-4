import React from 'react';
import { View, Image, StatusBar, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';
import Icon from '../components/Icon';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

const headerContainer = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: 50,
  borderBottomWidth: 0,
};

const Header = ({
  stack,
  navigation,
  withBackButton,
  withSkipButton,
  withStartButton,
  withProfileButton,
  headerTitleParams,
}) => (
  <SafeAreaView
    style={[
      styles.defaultHeaderShadow,
      stack === 'nutrition' && styles.nutritionHeaderShadow,
      stack === 'workouts' && styles.workoutsHeaderShadow,
      stack === 'calendar' && styles.noShadow,
      stack === 'progress' && styles.noShadow,
    ]}
  >
    <StatusBar
      barStyle="light-content"
    />
    <View
      style={[
        styles.defaultHeader,
        stack === 'nutrition' && styles.nutritionHeader,
        stack === 'workouts' && styles.workoutsHeader,
        stack === 'calendar' && styles.calendarHeader,
        stack === 'progress' && styles.progressHeader,
      ]}
    >
      <TouchableOpacity
        style={styles.headerContentContainerLeft}
        onPress={() => withBackButton && navigation.pop()}
      >
        {
          withBackButton &&
            <Icon
              name="chevron-left"
              size={20}
              color={colors.white}
            />
        }
      </TouchableOpacity>
      <View
        style={styles.headerContentContainer}
      >
        {
          headerTitleParams ? (
            <Text style={styles.headerTitleText}>
              {headerTitleParams}
            </Text>
          ) : (
            <Image
              source={require('../../assets/icons/fitazfk-icon-solid-white.png')}
              style={styles.fitazfkIcon}
            />
          )
        }
      </View>
      {
        withSkipButton && (
          <TouchableOpacity
            style={styles.headerContentContainerRight}
            onPress={() => navigation.state.params.handleSkip()}
          >
            <Text style={styles.skipButton}>
              Skip
            </Text>
          </TouchableOpacity>
        )
      }
      {
        withStartButton && (
          <TouchableOpacity
            style={styles.headerContentContainerRight}
            onPress={() => navigation.state.params.handleStart()}
          >
            <Text style={styles.skipButton}>
              Start
            </Text>
            <Icon
              name="chevron-right"
              size={20}
              color={colors.white}
            />
          </TouchableOpacity>
        )
      }
      {
        withProfileButton && (
          <TouchableOpacity
            style={styles.headerContentContainerRight}
            onPress={() => navigation.navigate('ProfileHome')}
          >
            <Icon
              name="profile-solid"
              size={30}
              color={colors.white}
            />
          </TouchableOpacity>
        )
      }
      {
        !withStartButton && !withSkipButton && !withProfileButton && (
          <View
            style={styles.headerContentContainerRight}
          />
        )
      }
    </View>
  </SafeAreaView>
);

Header.propTypes = {
  withBackButton: PropTypes.bool,
  withSkipButton: PropTypes.bool,
  withStartButton: PropTypes.bool,
  withProfileButton: PropTypes.bool,
  stack: PropTypes.string,
  headerTitleParams: PropTypes.string,
};

Header.defaultProps = {
  withBackButton: false,
  withSkipButton: false,
  withStartButton: false,
  withProfileButton: false,
  stack: null,
  headerTitleParams: null,
};

const styles = StyleSheet.create({
  defaultHeaderShadow: {
    shadowColor: colors.grey.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
  },
  nutritionHeaderShadow: {
    shadowColor: colors.grey.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
  },
  workoutsHeaderShadow: {
    shadowColor: colors.grey.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
  },
  noShadow: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    borderBottomWidth: 0,
  },
  skipButton: {
    fontFamily: fonts.standard,
    fontSize: 16,
    color: colors.white,
    marginTop: 5,
    marginRight: 4,
  },
  defaultHeader: {
    ...headerContainer,
    backgroundColor: colors.charcoal.standard,
  },
  nutritionHeader: {
    ...headerContainer,
    backgroundColor: colors.violet.standard,
  },
  workoutsHeader: {
    ...headerContainer,
    backgroundColor: colors.coral.standard,
  },
  calendarHeader: {
    ...headerContainer,
    backgroundColor: colors.green.standard,
    borderBottomWidth: 1,
    borderBottomColor: colors.green.dark,
  },
  progressHeader: {
    ...headerContainer,
    backgroundColor: colors.blue.standard,
  },
  headerContentContainer: {
    width: 120,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContentContainerLeft: {
    width: 100,
    height: 50,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerContentContainerRight: {
    width: 100,
    height: 50,
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerTitleText: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.white,
    marginTop: 5,
  },
  fitazfkIcon: {
    width: 30,
    height: 30,
  },
});

export default Header;
