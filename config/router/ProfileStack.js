import React from 'react';
import { createStackNavigator } from 'react-navigation';
import ProfileHomeScreen from '../../src/screens/AppStack/Profile/ProfileHomeScreen';
import ProfileScreen from '../../src/screens/AppStack/Profile/ProfileScreen';
import HelpAndSupportScreen from '../../src/screens/AppStack/Profile/HelpAndSupportScreen';
import PrivacyPolicyScreen from '../../src/screens/AppStack/Profile/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../../src/screens/AppStack/Profile/TermsOfServiceScreen';
import BillingTermsScreen from '../../src/screens/AppStack/Profile/BillingTermsScreen';
import EditProfileScreen from '../../src/screens/AppStack/Profile/EditProfileScreen';
import SettingsScreen from '../../src/screens/AppStack/Profile/SettingsScreen';
import Header from '../../src/components/Shared/Header';

const findProfileHeaderTitle = {
  ProfileHome: 'ACCOUNT',
  Profile: 'PROFILE',
  Settings: 'SETTINGS',
};

const ProfileStack = createStackNavigator(
  {
    ProfileHome: ProfileHomeScreen,
    Profile: ProfileScreen,
    HelpAndSupport: HelpAndSupportScreen,
    PrivacyPolicy: PrivacyPolicyScreen,
    TermsOfService: TermsOfServiceScreen,
    BillingTerms: BillingTermsScreen,
    EditProfile: EditProfileScreen,
    Settings: SettingsScreen,
  },
  {
    initialRouteName: 'ProfileHome',
    navigationOptions: ({ navigation }) => ({
      header: () => {
        const { routeName } = navigation.state;
        return (
          <Header
            navigation={navigation}
            stack="profile"
            withBackButton
            headerTitleParams={findProfileHeaderTitle[routeName]}
          />
        );
      },
    }),
  },
);

export default ProfileStack;
