import React from 'react';
import { StyleSheet, SafeAreaView, View, Text, AsyncStorage, ScrollView, Dimensions, Alert } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { auth, db } from '../../../../config/firebase';
import Loader from '../../../components/Shared/Loader';
import Icon from '../../../components/Shared/Icon';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

const list = [
  { title: 'Help & Support', route: 'HelpAndSupport' },
  { title: 'Privacy Policy', route: 'PrivacyPolicy' },
  { title: 'Terms of Service', route: 'TermsOfService' },
  { title: 'Billing Terms', route: 'BillingTerms' },
];

export default class ProfileHomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      loading: false,
    };
  }
  componentDidMount() {
    this.fetchProfile();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchProfile = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    this.unsubscribe = await db.collection('users').doc(uid)
      .onSnapshot(async (doc) => {
        if (doc.exists) {
          this.setState({ profile: await doc.data(), loading: false });
        } else {
          this.setState({ loading: false });
        }
      });
  }
  logOutAlert = () => {
    Alert.alert(
      'Are you sure you want to log out?',
      '',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => this.logOut() },
      ],
      { cancelable: false },
    );
  }
  logOut = () => {
    try {
      this.setState({ loading: true });
      AsyncStorage.removeItem('uid');
      auth.signOut();
      this.setState({ loading: false });
      this.props.navigation.navigate('Auth');
    } catch (err) {
      this.setState({ loading: false });
      console.log(err);
    }
  }
  render() {
    const { profile, loading } = this.state;
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Icon
              name="profile-outline"
              size={100}
              color={colors.charcoal.standard}
            />
            <View style={styles.nameTextContainer}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.nameText}
              >
                {profile && profile.firstName} {profile && profile.lastName}
              </Text>
            </View>
            <List containerStyle={styles.listContainer}>
              <ListItem
                activeOpacity={0.5}
                key="Profile"
                title="Profile"
                containerStyle={styles.listItemContainer}
                titleStyle={styles.listItemTitleStyle}
                onPress={() => this.props.navigation.navigate('Profile')}
              />
              <ListItem
                activeOpacity={0.5}
                key="Settings"
                title="Settings"
                containerStyle={styles.listItemContainer}
                titleStyle={styles.listItemTitleStyle}
                onPress={() => this.props.navigation.navigate('Settings')}
              />
            </List>
            <List containerStyle={styles.listContainer}>
              {
                list.map((l) => (
                  <ListItem
                    activeOpacity={0.5}
                    key={l.title}
                    title={l.title}
                    containerStyle={styles.listItemContainer}
                    titleStyle={styles.listItemTitleStyle}
                    onPress={() => this.props.navigation.navigate(l.route)}
                  />
                ))
              }
              <ListItem
                activeOpacity={0.5}
                title="Log Out"
                containerStyle={styles.listItemContainer}
                titleStyle={styles.listItemTitleStyle}
                onPress={() => this.logOutAlert()}
              />
            </List>
          </ScrollView>
          <Loader
            loading={loading}
            color={colors.charcoal.standard}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
  },
  scrollView: {
    paddingTop: 15,
    alignItems: 'center',
  },
  nameTextContainer: {
    width,
    alignItems: 'center',
  },
  nameText: {
    marginTop: 15,
    fontFamily: fonts.bold,
    fontSize: 24,
  },
  listContainer: {
    width,
    marginBottom: 20,
    borderColor: colors.grey.light,
  },
  listItemContainer: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomColor: colors.grey.light,
    backgroundColor: colors.white,
  },
  listItemTitleStyle: {
    fontFamily: fonts.bold,
    color: colors.charcoal.standard,
    marginTop: 5,
    fontSize: 14,
  },
});
