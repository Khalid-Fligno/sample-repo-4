import React from 'react';
import { StyleSheet, View, AsyncStorage, ScrollView, Dimensions, Alert } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { db, auth } from '../../../../config/firebase';
import Loader from '../../../components/Loader';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');


export default class SettingsScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      loading: false,
      isPasswordAccount: false,
    };
  }
  componentDidMount = async () => {
    this.fetchProfile();
    const { providerData } = auth.currentUser;
    providerData.forEach((profile) => {
      if (profile.providerId === 'password') {
        this.setState({ isPasswordAccount: true });
      }
    });
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
          this.setState({
            profile: await doc.data(),
            loading: false,
          });
        } else {
          this.setState({ loading: false });
        }
      });
  }
  changePasswordAlert = () => {
    Alert.alert(
      'Change Password',
      'A password reset link will be emailed to your nominated email address',
      [
        {
          text: 'Cancel', style: 'cancel',
        },
        {
          text: 'Continue', onPress: () => this.sendPasswordResetEmail(),
        },
      ],
      { cancelable: false },
    );
  }
  sendPasswordResetEmail = () => {
    const { email } = this.state.profile;
    auth.sendPasswordResetEmail(email).then(() => {
      Alert.alert('Your password reset email has been sent');
    }).catch((error) => {
      Alert.alert(error);
    });
  }
  render() {
    const { isPasswordAccount, loading } = this.state;
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
          <List containerStyle={styles.listContainer}>
            {
              // Only show password change if an email/password account is present
              isPasswordAccount && (
                <ListItem
                  title="Change Password"
                  titleStyle={styles.listItemTitle}
                  containerStyle={styles.listItemContainer}
                  onPress={() => this.changePasswordAlert()}
                />
              )
            }
          </List>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
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
    marginTop: 5,
  },
});
