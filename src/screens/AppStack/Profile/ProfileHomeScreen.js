import React from 'react';
import { StyleSheet, View, Text, AsyncStorage, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { db } from '../../../../config/firebase';
import Loader from '../../../components/Loader';
import Icon from '../../../components/Icon';
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
    this.unsubscribe = db.collection('users').doc(uid)
      .onSnapshot(async (doc) => {
        if (doc.exists) {
          this.setState({ profile: await doc.data(), loading: false });
        } else {
          this.setState({ loading: false });
        }
      });
  }
  render() {
    const { profile, loading } = this.state;
    if (loading) {
      return (
        <Loader
          loading={loading}
          color={colors.charcoal.standard}
        />
      );
    }
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Icon
            name="profile-outline"
            size={100}
            color={colors.charcoal.standard}
          />
          <Text
            style={{
              marginTop: 15,
              fontFamily: fonts.bold,
              fontSize: 24,
            }}
          >
            {profile && profile.firstName} {profile && profile.lastName}
          </Text>
          <List containerStyle={styles.listContainer}>
            <ListItem
              activeOpacity={0.5}
              key="My Profile"
              title="My Profile"
              containerStyle={styles.listItemContainer}
              titleStyle={{
                fontFamily: fonts.bold,
                color: colors.charcoal.standard,
              }}
              onPress={() => this.props.navigation.navigate('Profile')}
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
                  titleStyle={styles.listItemTitle}
                  onPress={() => this.props.navigation.navigate(l.route)}
                />
              ))
            }
            <ListItem
              activeOpacity={0.5}
              title="Log Out"
              containerStyle={styles.listItemContainer}
              titleStyle={styles.listItemTitle}
            />
          </List>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  scrollView: {
    paddingTop: 15,
    alignItems: 'center',
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
  listItemTitle: {
    fontFamily: fonts.bold,
    color: colors.charcoal.standard,
  },
});
