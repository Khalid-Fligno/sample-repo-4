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
  borderBottomColor: colors.black,
  borderBottomWidth: 1,
};

const Header = ({
  stack,
  navigation,
  withBackButton,
  withSkipButton,
  withStartButton,
}) => (
  <SafeAreaView>
    <StatusBar
      barStyle="light-content"
    />
    <View
      style={[
        styles.defaultHeader,
        stack === 'nutrition' && styles.nutritionHeader,
        stack === 'workouts' && styles.workoutsHeader,
        stack === 'calendar' && styles.calendarHeader,
        stack === 'profile' && styles.profileHeader,
      ]}
    >
      <TouchableOpacity
        style={styles.headerContentContainerLeft}
        onPress={() => withBackButton && navigation.goBack()}
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
        <Image
          source={require('../../assets/icons/fitazfk-icon-solid-white.png')}
          style={{
            width: 30,
            height: 30,
          }}
        />
      </View>
      {
        withSkipButton && (
          <TouchableOpacity
            style={styles.headerContentContainerRight}
            onPress={() => navigation.state.params.handleSkip()}
          >
            <Text
              style={styles.skipButton}
            >
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
            <Text
              style={styles.skipButton}
            >
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
        !withStartButton && !withSkipButton && (
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
  stack: PropTypes.string,
};

Header.defaultProps = {
  withBackButton: false,
  withSkipButton: false,
  withStartButton: false,
  stack: null,
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.violet.standard,
    height: 50,
    borderBottomColor: colors.charcoal.standard,
    borderBottomWidth: 1,
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
    borderBottomWidth: 1,
    borderBottomColor: colors.charcoal.dark,
  },
  nutritionHeader: {
    ...headerContainer,
    backgroundColor: colors.violet.standard,
    borderBottomWidth: 1,
    borderBottomColor: colors.violet.dark,
  },
  workoutsHeader: {
    ...headerContainer,
    backgroundColor: colors.coral.standard,
    borderBottomWidth: 1,
    borderBottomColor: colors.coral.dark,
  },
  calendarHeader: {
    ...headerContainer,
    backgroundColor: colors.green.standard,
    borderBottomWidth: 1,
    borderBottomColor: colors.green.dark,
  },
  profileHeader: {
    ...headerContainer,
    backgroundColor: colors.blue.standard,
    borderBottomWidth: 1,
    borderBottomColor: colors.blue.dark,
  },
  headerContentContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContentContainerLeft: {
    width: 100,
    height: 50,
    paddingLeft: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerContentContainerRight: {
    width: 100,
    height: 50,
    paddingRight: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default Header;
