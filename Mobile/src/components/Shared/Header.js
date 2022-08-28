import React, { useEffect } from "react";
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
} from "react-native";
import PropTypes from "prop-types";
import ProfileButton from "../Shared/ProfileButton";
import Icon from "../Shared/Icon";
import colors from "../../styles/colors";
import globalStyle from "../../styles/globalStyles";
import VIcon from "react-native-vector-icons/Fontisto";
import { IMAGE } from "../../library/images";
const { width } = Dimensions.get("window");

const headerContainer = {
  width,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  height: 50,
  borderBottomWidth: 0,
  backgroundColor: colors.white,
  borderBottomWidth: 1,
  borderBottomColor: colors.grey.light,
};

const Header = (props) => {
  const {
    stack,
    navigation,
    withBackButton,
    withHomeButton,
    withHelpButton,
    withRightHelpButton,
    withSkipButton,
    withCancelButton,
    withStartButton,
    withProfileButton,
    headerTitleParams,
    withLogoutButton,
    activeChallengeSetting,
  } = props;

  useEffect(() => {
    if (Platform.OS === "android") {
      StatusBar.setTranslucent(false);
      StatusBar.setBackgroundColor("#FFF");
    }
  }, []);

  const handleBack = () => {
    // navigation.pop();
    navigation.state.params !== undefined
      ? navigation.state.params.isInitial !== undefined
        ? navigation.state.params.progressEdit !== undefined
          ? navigation.navigate("ProgressEdit")
          : navigation.navigate("ProgressHome")
        : navigation.pop()
      : navigation.pop();
  };

  const goToHome = () => {
    navigation.navigate("Home");
  };
  const handleLogout = () => {
    if (navigation.state.params.handleLogout) {
      navigation.state.params.handleLogout();
    }
  };
  const handleHelper = () => {
    if (navigation.state.params.toggleHelperModal) {
      navigation.state.params.toggleHelperModal();
    }
  };
  const handleSkip = () => {
    if (navigation.state.params.handleSkip) {
      navigation.state.params.handleSkip();
    }
  };
  const handleCancel = () => {
    if (navigation.state.params.handleCancel) {
      navigation.state.params.handleCancel();
    }
  };
  const handleProfileButton = () => {
    navigation.navigate("ProfileHome");
  };

  const handleStart = () => {
    if (navigation.state.params.handleStart) {
      navigation.state.params.handleStart();
    }
  };
  const handleActiveChallengeSetting = () => {
    if (navigation.state.params.activeChallengeSetting) {
      navigation.state.params.activeChallengeSetting();
    }
  };

  return (
    <SafeAreaView style={[globalStyle.noShadow]}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.defaultHeader]}>
        {withBackButton && (
          <TouchableOpacity
            style={globalStyle.headerContentContainerLeft}
            onPress={handleBack}
          >
            <Icon name="chevron-left" size={20} color={colors.black} />
          </TouchableOpacity>
        )}

        {activeChallengeSetting && (
          <View style={globalStyle.headerContentContainerLeft}>
            <TouchableOpacity
              style={{
                height: 30,
                width: 30,
                marginLeft: 5,
              }}
              onPress={handleActiveChallengeSetting}
            >
              <VIcon name="player-settings" size={27} color={colors.black} />
            </TouchableOpacity>
          </View>
        )}
        {withHomeButton && (
          <TouchableOpacity
            style={globalStyle.headerContentContainerLeft}
            onPress={goToHome}
          >
            <Icon name="chevron-left" size={20} color={colors.black} />
          </TouchableOpacity>
        )}
        {withHelpButton && (
          <TouchableOpacity
            style={globalStyle.headerContentContainerLeft}
            onPress={handleHelper}
          >
            <Icon
              name="question-speech-bubble"
              size={30}
              color={colors.black}
            />
          </TouchableOpacity>
        )}
        {withLogoutButton && (
          <TouchableOpacity
            style={globalStyle.headerContentContainerLeft}
            onPress={handleLogout}
          >
            <Text style={globalStyle.logoutButton}>Logout</Text>
          </TouchableOpacity>
        )}
        {!withHomeButton &&
          !withBackButton &&
          !withHelpButton &&
          !withLogoutButton &&
          !activeChallengeSetting && (
            <View style={globalStyle.headerContentContainerLeft} />
          )}
        <View style={globalStyle.headerContentContainer}>
          {headerTitleParams ? (
            <Text style={globalStyle.headerTitleText}>{headerTitleParams}</Text>
          ) : (
            <Image
              source={IMAGE.BRAND_MARK}
              style={globalStyle.fitazfkIcon}
              resizeMode="contain"
            />
          )}
        </View>
        {withRightHelpButton && (
          <TouchableOpacity
            style={globalStyle.headerContentContainerRight}
            onPress={handleHelper}
          >
            <Icon
              name="question-speech-bubble"
              size={30}
              color={colors.black}
            />
          </TouchableOpacity>
        )}
        {withSkipButton && (
          <TouchableOpacity
            style={globalStyle.headerContentContainerRight}
            onPress={handleSkip}
          >
            <Text style={globalStyle.skipButton}>Skip</Text>
          </TouchableOpacity>
        )}
        {withCancelButton && (
          <TouchableOpacity
            style={globalStyle.headerContentContainerRight}
            onPress={handleCancel}
          >
            <Text style={globalStyle.skipButton}>Cancel</Text>
          </TouchableOpacity>
        )}
        {withStartButton && navigation.state.params.handleStart && (
          <TouchableOpacity
            style={globalStyle.headerContentContainerRight}
            onPress={handleStart}
          >
            <Text style={globalStyle.skipButton}>Start</Text>
            <Icon name="chevron-right" size={20} color={colors.black} />
          </TouchableOpacity>
        )}
        {withStartButton && !navigation.state.params.handleStart && (
          <View style={globalStyle.headerContentContainerRightLoading}>
            <ActivityIndicator
              color={colors.themeColor.color}
              style={globalStyle.activityIndicator}
            />
          </View>
        )}
        {withProfileButton && (
          <TouchableOpacity
            style={globalStyle.headerContentContainerRight}
            onPress={handleProfileButton}
          >
            <ProfileButton />
          </TouchableOpacity>
        )}
        {!withStartButton &&
          !withSkipButton &&
          !withCancelButton &&
          !withProfileButton &&
          !withRightHelpButton && (
            <View style={globalStyle.headerContentContainerRight} />
          )}
      </View>
    </SafeAreaView>
  );
};

export default Header;

Header.propTypes = {
  withBackButton: PropTypes.bool,
  withHomeButton: PropTypes.bool,
  withLogoutButton: PropTypes.bool,
  withHelpButton: PropTypes.bool,
  withSkipButton: PropTypes.bool,
  withCancelButton: PropTypes.bool,
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
  withStartButton: false,
  withProfileButton: false,
  stack: null,
  headerTitleParams: null,
};

const styles = StyleSheet.create({
  defaultHeader: {
    ...headerContainer,
    backgroundColor: colors.themeColor.headerBackgroundColor,
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight + 1 : 0,
  },
});
