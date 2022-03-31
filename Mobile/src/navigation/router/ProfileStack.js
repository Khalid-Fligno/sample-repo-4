import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import ProfileHomeScreen from '../../../src/screens/AppStack/Profile/ProfileHomeScreen';
import ProfileScreen from '../../../src/screens/AppStack/Profile/ProfileScreen';
import InviteFriendsScreen from '../../../src/screens/AppStack/Profile/InviteFriendsScreen';
import HelpAndSupportScreen from '../../../src/screens/AppStack/Profile/HelpAndSupportScreen';
import PrivacyPolicyScreen from '../../../src/screens/AppStack/Profile/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../../../src/screens/AppStack/Profile/TermsOfServiceScreen';
import SettingsScreen from '../../../src/screens/AppStack/Profile/SettingsScreen';
import Burpee1Screen from '../../../src/screens/AppStack/Profile/Burpee1Screen';
import Burpee2Screen from '../../../src/screens/AppStack/Profile/Burpee2Screen';
import Burpee3Screen from '../../../src/screens/AppStack/Profile/Burpee3Screen';
import Burpee4Screen from '../../../src/screens/AppStack/Profile/Burpee4Screen';
import ChangeUnitScreen from '../../../src/screens/AppStack/Profile/ChangeUnit';
import Header from '../../../src/components/Shared/Header';

const findProfileHeaderTitle = {
  ProfileHome: 'ACCOUNT',
  Profile: 'PROFILE',
  InviteFriends: 'INVITE',
  Settings: 'SETTINGS',
};

const backButtonMap = {
  ProfileHome: true,
  Profile: true,
  InviteFriends: true,
  HelpAndSupport: true,
  PrivacyPolicy: true,
  TermsOfService: true,
  Settings: true,
  ChangeUnit: true,
};

const cancelButtonMap = {
  Burpee1: true,
  Burpee3: true,
  Burpee4: true,
};

const ProfileStack = createStackNavigator(
  {
    ProfileHome: ProfileHomeScreen,
    Profile: ProfileScreen,
    InviteFriends: InviteFriendsScreen,
    HelpAndSupport: HelpAndSupportScreen,
    PrivacyPolicy: PrivacyPolicyScreen,
    TermsOfService: TermsOfServiceScreen,
    Settings: SettingsScreen,
    Burpee1: Burpee1Screen,
    Burpee2: Burpee2Screen,
    Burpee3: Burpee3Screen,
    Burpee4: Burpee4Screen,
    ChangeUnit: ChangeUnitScreen,
  },
  {
    initialRouteName: 'ProfileHome',
    defaultNavigationOptions: ({ navigation }) => ({
      header: () => {
        const { routeName } = navigation.state;
        
        return (
          <Header
            navigation={navigation}
            stack="profile"
            withBackButton={backButtonMap[routeName]}
            withCancelButton={cancelButtonMap[routeName]}
            headerTitleParams={findProfileHeaderTitle[routeName]}
          />
        );
      },
    }),
  },
);

export default ProfileStack;
