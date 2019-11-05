import React from 'react';
import {
  View,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';
import ProfileButton from '../Shared/ProfileButton';
import Icon from '../Shared/Icon';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const { width } = Dimensions.get('window');

const headerContainer = {
  width,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: 50,
  borderBottomWidth: 0,
};

export default class Header extends React.PureComponent {
  handleBack = () => {
    const { navigation } = this.props;
    navigation.pop();
  }
  handleLogout = () => {
    const { navigation } = this.props;
    if (navigation.state.params.handleLogout) {
      navigation.state.params.handleLogout();
    }
  }
  handleHelper = () => {
    const { navigation } = this.props;
    if (navigation.state.params.toggleHelperModal) {
      navigation.state.params.toggleHelperModal();
    }
  }
  handleSkip = () => {
    const { navigation } = this.props;
    if (navigation.state.params.handleSkip) {
      navigation.state.params.handleSkip();
    }
  }
  handleCancel = () => {
    const { navigation } = this.props;
    if (navigation.state.params.handleCancel) {
      navigation.state.params.handleCancel();
    }
  }
  handleProfileButton = () => {
    const { navigation } = this.props;
    navigation.navigate('ProfileHome');
  }
  handleRestore = () => {
    const { navigation } = this.props;
    if (navigation.state.params.handleRestore) {
      navigation.state.params.handleRestore();
    }
  }
  handleStart = () => {
    const { navigation } = this.props;
    if (navigation.state.params.handleStart) {
      navigation.state.params.handleStart();
    }
  }
  render() {
    const {
      stack,
      navigation,
      withBackButton,
      withHelpButton,
      withSkipButton,
      withCancelButton,
      withRestoreButton,
      withStartButton,
      withProfileButton,
      headerTitleParams,
      withLogoutButton,
    } = this.props;
    return (
      <SafeAreaView
        style={[
          styles.noShadow,
          stack === 'home' && styles.defaultHeaderShadow,
          stack === 'progress' && styles.defaultHeaderShadow,
          navigation.state.routeName === 'RecipeSelection' && styles.defaultHeaderShadow,
          navigation.state.routeName === 'Recipe' && styles.defaultHeaderShadow,
          navigation.state.routeName === 'WorkoutInfo' && styles.defaultHeaderShadow,
          navigation.state.routeName === 'HiitWorkoutInfo' && styles.defaultHeaderShadow,
          navigation.state.routeName === 'ProfileHome' && styles.defaultHeaderShadow,
        ]}
      >
        <StatusBar barStyle="light-content" />
        <View
          style={[
            styles.defaultHeader,
            stack === 'nutrition' && styles.nutritionHeader,
            stack === 'workouts' && styles.workoutsHeader,
            stack === 'calendar' && styles.calendarHeader,
            stack === 'progress' && styles.progressHeader,
          ]}
        >
          {
            withBackButton && (
              <TouchableOpacity
                style={styles.headerContentContainerLeft}
                onPress={this.handleBack}
              >
                <Icon
                  name="chevron-left"
                  size={20}
                  color={colors.white}
                />
              </TouchableOpacity>
            )
          }
          {
            withHelpButton && (
              <TouchableOpacity
                style={styles.headerContentContainerLeft}
                onPress={this.handleHelper}
              >
                <Icon
                  name="question-speech-bubble"
                  size={30}
                  color={colors.white}
                />
              </TouchableOpacity>
            )
          }
          {
            withLogoutButton && (
              <TouchableOpacity
                style={styles.headerContentContainerLeft}
                onPress={this.handleLogout}
              >
                <Text style={styles.logoutButton}>
                  Logout
                </Text>
              </TouchableOpacity>
            )
          }
          {
            !withBackButton && !withHelpButton && !withLogoutButton && (
              <View style={styles.headerContentContainerLeft} />
            )
          }
          <View style={styles.headerContentContainer}>
            {
              headerTitleParams ? (
                <Text style={styles.headerTitleText}>
                  {headerTitleParams}
                </Text>
              ) : (
                <Image
                  source={require('../../../assets/icons/fitazfk-icon-outline-white.png')}
                  style={styles.fitazfkIcon}
                />
              )
            }
          </View>
          {
            withSkipButton && (
              <TouchableOpacity
                style={styles.headerContentContainerRight}
                onPress={this.handleSkip}
              >
                <Text style={styles.skipButton}>
                  Skip
                </Text>
              </TouchableOpacity>
            )
          }
          {
            withCancelButton && (
              <TouchableOpacity
                style={styles.headerContentContainerRight}
                onPress={this.handleCancel}
              >
                <Text style={styles.skipButton}>
                  Cancel
                </Text>
              </TouchableOpacity>
            )
          }
          {
            withRestoreButton && (
              <TouchableOpacity
                style={styles.headerContentContainerRight}
                onPress={this.handleRestore}
              >
                <Text style={styles.skipButton}>
                  Restore
                </Text>
              </TouchableOpacity>
            )
          }
          {
            withStartButton && navigation.state.params.handleStart && (
              <TouchableOpacity
                style={styles.headerContentContainerRight}
                onPress={this.handleStart}
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
            withStartButton && !navigation.state.params.handleStart && (
              <View style={styles.headerContentContainerRightLoading}>
                <ActivityIndicator
                  color={colors.white}
                  style={styles.activityIndicator}
                />
              </View>
            )
          }
          {
            withProfileButton && (
              <TouchableOpacity
                style={styles.headerContentContainerRight}
                onPress={this.handleProfileButton}
              >
                <ProfileButton />
              </TouchableOpacity>
              )
          }
          {
            !withStartButton && !withSkipButton && !withCancelButton && !withProfileButton && !withRestoreButton && (
              <View style={styles.headerContentContainerRight} />
            )
          }
        </View>
      </SafeAreaView>
    );
  }
}

Header.propTypes = {
  withBackButton: PropTypes.bool,
  withLogoutButton: PropTypes.bool,
  withHelpButton: PropTypes.bool,
  withSkipButton: PropTypes.bool,
  withCancelButton: PropTypes.bool,
  withRestoreButton: PropTypes.bool,
  withStartButton: PropTypes.bool,
  withProfileButton: PropTypes.bool,
  stack: PropTypes.string,
  headerTitleParams: PropTypes.string,
};

Header.defaultProps = {
  withBackButton: false,
  withLogoutButton: false,
  withHelpButton: false,
  withSkipButton: false,
  withCancelButton: false,
  withRestoreButton: false,
  withStartButton: false,
  withProfileButton: false,
  stack: null,
  headerTitleParams: null,
};

const styles = StyleSheet.create({
  defaultHeaderShadow: {
    backgroundColor: colors.black,
    shadowColor: colors.charcoal.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  noShadow: {
    backgroundColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    borderBottomWidth: 0,
  },
  logoutButton: {
    fontFamily: fonts.standard,
    fontSize: 16,
    color: colors.white,
    marginTop: 5,
    marginLeft: 4,
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
    backgroundColor: colors.charcoal.darkest,
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
    flexGrow: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContentContainerLeft: {
    flex: 1,
    height: 50,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerContentContainerRight: {
    flex: 1,
    height: 50,
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerContentContainerRightLoading: {
    flex: 1,
    height: 50,
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  activityIndicator: {
    marginRight: 10,
  },
  headerTitleText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.white,
    marginTop: 5,
  },
  fitazfkIcon: {
    width: 30,
    height: 30,
  },
});
