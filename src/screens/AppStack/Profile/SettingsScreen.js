import React from 'react';
import { StyleSheet, SafeAreaView, View, AsyncStorage, ScrollView, Dimensions, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { List, ListItem } from 'react-native-elements';
import firebase from 'firebase';
import { db, auth } from '../../../../config/firebase';
import Loader from '../../../components/Shared/Loader';
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
  resetProgressAlert = () => {
    Alert.alert(
      'Are you sure?',
      'This will clear your progress photos and measurements',
      [
        {
          text: 'Cancel', style: 'cancel',
        },
        {
          text: 'Reset', onPress: () => this.resetInitialProgress(),
        },
      ],
      { cancelable: false },
    );
  }
  resetInitialProgress = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    const userRef = db.collection('users').doc(uid);
    await userRef.update({
      initialProgressInfo: firebase.firestore.FieldValue.delete(),
      currentProgressInfo: firebase.firestore.FieldValue.delete(),
    });
    Alert.alert('Your progress info has been reset');
    this.setState({ loading: false });
  }
  retakeBurpeeTest = async () => {
    this.setState({ loading: true });
    await FileSystem.downloadAsync(
      'https://firebasestorage.googleapis.com/v0/b/fitazfk-app.appspot.com/o/videos%2FBURPEES.mp4?alt=media&token=688885cb-2d70-4fc6-82a9-abc4e95daf89',
      `${FileSystem.cacheDirectory}exercise-burpees.mp4`,
    );
    this.setState({ loading: false });
    this.props.navigation.navigate('Burpee1');
  }
  render() {
    const { isPasswordAccount, profile, loading } = this.state;
    return (
      <SafeAreaView style={styles.safeContainer}>
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
              {
                // Only show password change if an email/password account is present
                profile && (
                  <ListItem
                    title="Reset initial progress info"
                    titleStyle={styles.listItemTitle}
                    disabled={profile && !profile.initialProgressInfo}
                    containerStyle={styles.listItemContainer}
                    onPress={() => this.resetProgressAlert()}
                  />
                )
              }
              <ListItem
                title="Re-take burpee test"
                titleStyle={styles.listItemTitle}
                containerStyle={styles.listItemContainer}
                onPress={() => this.retakeBurpeeTest()}
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
    fontSize: 14,
  },
});
