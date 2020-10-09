import React from 'react';
import {
  View,
  SafeAreaView,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import ProfileButton from '../Shared/ProfileButton';
import Icon from '../Shared/Icon';
import colors from '../../styles/colors';
import globalStyle from '../../styles/globalStyles';
const { width } = Dimensions.get('window');

const headerContainer = {
  width,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: 50,
  borderBottomWidth: 0,
  backgroundColor:colors.white,
  borderBottomWidth:1,
  borderBottomColor:colors.grey.light
};

export default class Header extends React.PureComponent {
  componentDidMount(){
    if(Platform.OS === 'android'){
      StatusBar.setTranslucent(false);
      StatusBar.setBackgroundColor("#FFF");
    }
  
}
  handleBack = () => {
    const { navigation } = this.props;
    navigation.pop();
  }
  goToHome = () => {
    console.log("<><><<>><><")
    const { navigation } = this.props;
    navigation.navigate('Home')
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
      withHomeButton,
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
          globalStyle.noShadow,
          // stack === 'home' && globalStyle.defaultHeaderShadow,
          // stack === 'progress' && globalStyle.defaultHeaderShadow,
          // navigation.state.routeName === 'RecipeSelection' && globalStyle.defaultHeaderShadow,
          // navigation.state.routeName === 'Recipe' && globalStyle.defaultHeaderShadow,
          // navigation.state.routeName === 'WorkoutInfo' && globalStyle.defaultHeaderShadow,
          // navigation.state.routeName === 'HiitWorkoutInfo' && globalStyle.defaultHeaderShadow,
          // navigation.state.routeName === 'ProfileHome' && globalStyle.defaultHeaderShadow,
        ]}
      >
        <StatusBar barStyle="light-content" />
        <View
          style={[
            styles.defaultHeader,
            // stack === 'nutrition' && styles.nutritionHeader,
            // stack === 'workouts' && styles.workoutsHeader,
            // stack === 'calendar' && styles.calendarHeader,
            // stack === 'progress' && styles.progressHeader,
          ]}
        >
          {
            withBackButton && (
              <TouchableOpacity
                style={globalStyle.headerContentContainerLeft}
                onPress={this.handleBack}
              >
                <Icon
                  name="chevron-left"
                  size={20}
                  color={colors.themeColor.color}
                />
              </TouchableOpacity>
            )
          }
          {
            withHomeButton && (
              <TouchableOpacity
                style={globalStyle.headerContentContainerLeft}
                onPress={this.goToHome}
              >
                <Icon
                  name="chevron-left"
                  size={20}
                  color={colors.themeColor.color}
                />
              </TouchableOpacity>
            )
          }
          {
            withHelpButton && (
              <TouchableOpacity
                style={globalStyle.headerContentContainerLeft}
                onPress={this.handleHelper}
              >
                <Icon
                  name="question-speech-bubble"
                  size={30}
                  color={colors.themeColor.color}
                />
              </TouchableOpacity>
            )
          }
          {
            withLogoutButton && (
              <TouchableOpacity
                style={globalStyle.headerContentContainerLeft}
                onPress={this.handleLogout}
              >
                <Text style={globalStyle.logoutButton}>
                  Logout
                </Text>
              </TouchableOpacity>
            )
          }
          {
            !withBackButton && !withHelpButton && !withLogoutButton && (
              <View style={globalStyle.headerContentContainerLeft} />
            )
          }
          <View style={globalStyle.headerContentContainer}>
            {
              headerTitleParams ? (
                <Text style={globalStyle.headerTitleText}>
                  {headerTitleParams}
                </Text>
              ) : (
                    <Image
                      source={require('../../../assets/icons/fitazfk2-logo.png')}
                      style={globalStyle.fitazfkIcon}
                    />
              
              )
            }
          </View>
          {
            withSkipButton && (
              <TouchableOpacity
                style={globalStyle.headerContentContainerRight}
                onPress={this.handleSkip}
              >
                <Text style={globalStyle.skipButton}>
                  Skip
                </Text>
              </TouchableOpacity>
            )
          }
          {
            withCancelButton && (
              <TouchableOpacity
                style={globalStyle.headerContentContainerRight}
                onPress={this.handleCancel}
              >
                <Text style={globalStyle.skipButton}>
                  Cancel
                </Text>
              </TouchableOpacity>
            )
          }
          {
            withRestoreButton && (
              <TouchableOpacity
                style={globalStyle.headerContentContainerRight}
                onPress={this.handleRestore}
              >
                <Text style={globalStyle.skipButton}>
                  Restore
                </Text>
              </TouchableOpacity>
            )
          }
          {
            withStartButton && navigation.state.params.handleStart && (
              <TouchableOpacity
                style={globalStyle.headerContentContainerRight}
                onPress={this.handleStart}
              >
                <Text style={globalStyle.skipButton}>
                  Start
                </Text>
                <Icon
                  name="chevron-right"
                  size={20}
                  color={colors.black}
                />
              </TouchableOpacity>
            )
          }
          {
            withStartButton && !navigation.state.params.handleStart && (
              <View style={globalStyle.headerContentContainerRightLoading}>
                <ActivityIndicator
                  color={colors.themeColor.color}
                  style={globalStyle.activityIndicator}
                />
              </View>
            )
          }
          {
            withProfileButton && (
              <TouchableOpacity
                style={globalStyle.headerContentContainerRight}
                onPress={this.handleProfileButton}
              >
                <ProfileButton />
              </TouchableOpacity>
              )
          }
          {
            !withStartButton && !withSkipButton && !withCancelButton && !withProfileButton && !withRestoreButton && (
              <View style={globalStyle.headerContentContainerRight} />
            )
          }
        </View>
      </SafeAreaView>
    );
  }
}

Header.propTypes = {
  withBackButton: PropTypes.bool,
  withHomeButton: PropTypes.bool,
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
  withHomeButton: false,
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
  defaultHeader: {
    ...headerContainer,
    backgroundColor: colors.themeColor.headerBackgroundColor,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight+1 : 0
  },
  // nutritionHeader: {
  //   ...headerContainer,
  // },
  // workoutsHeader: {
  //   ...headerContainer,
  // },
  // calendarHeader: {
  //   ...headerContainer,
  //   borderBottomWidth: 1,
  //   borderBottomColor: colors.themeColor.lightColor,
  // },
  // progressHeader: {
  //   ...headerContainer,
  // },
  
});
