import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Dimensions,
  Alert,
  ActionSheetIOS,
  TouchableOpacity,
  Linking,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { ListItem } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import { auth, db } from '../../../../config/firebase';
import Loader from '../../../components/Shared/Loader';
import Icon from '../../../components/Shared/Icon';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';
import ActionSheet from 'react-native-actionsheet';

const { width } = Dimensions.get('window');

const uriToBlob = (url) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onerror = reject;
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        resolve(xhr.response);
      }
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob'; // convert type
    xhr.send();
  });
};

const list = [
  { title: 'Help & Support', route: 'HelpAndSupport' },
  { title: 'Privacy Policy', route: 'PrivacyPolicy' },
  { title: 'Terms and Conditions', route: 'TermsOfService' },
];

const actionSheetOptions = ['Cancel', 'Take photo', 'Upload from Camera Roll'];

export default class ProfileHomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      profile: undefined,
      loading: false,
      hasCameraPermission: undefined,
      hasCameraRollPermission: undefined,
      hasExternalStorageDevicePermission: undefined,
      avatar: undefined,
    };
  }
  componentDidMount() {
    this.fetchProfile();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  getCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }
    getCameraRollPermission = async () => {
        try {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            this.setState({ hasCameraRollPermission: status === 'granted' });
        }
        catch (ex) {

        }
  }
  fetchProfile = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    this.unsubscribe = await db.collection('users').doc(uid)
      .onSnapshot(async (doc) => {
        if (doc.exists) {
          this.setState({ profile: await doc.data(), avatar: await doc.data().avatar, loading: false });
        } else {
          this.setState({ loading: false });
        }
      });
  }
  saveImage = async (uri) => {
    try {
      const uid = await AsyncStorage.getItem('uid');
      const firebase = require('firebase');
      const blob = await uriToBlob(uri);
      const storageRef = firebase.storage().ref();
      const userPhotosStorageRef = storageRef.child('user-photos');
      const userStorageRef = userPhotosStorageRef.child(uid);
      const avatarStorageRef = userStorageRef.child('avatar.jpeg');
      const metadata = {
        contentType: 'image/jpeg',
        cacheControl: 'public, max-age=31536000',
      };
      const snapshot = await avatarStorageRef.put(blob, metadata);
      const url = await snapshot.ref.getDownloadURL();
      await FastImage.preload([{ uri: url }]);
      this.setState({ avatar: url });
      await db.collection('users').doc(uid).set({
        avatar: url,
      }, { merge: true });
    } catch (err) {
      Alert.alert('Image save error');
    }
  };
  chooseUploadType = () => {
      if (Platform.OS === 'android') {
          //this.getCameraPermission();
          //this.getCameraRollPermission();
          this.requestAndroidPermissions();
          this.showActionSheet();
          
      }
      else {

          this.getCameraPermission();
          this.getCameraRollPermission();
          ActionSheetIOS.showActionSheetWithOptions(
              {
                  options: actionSheetOptions,
                  cancelButtonIndex: 0,
              },
              async (buttonIndex) => {
                  this.uploadTypeAction(buttonIndex);
              },
          );
      }
    }
    async requestAndroidPermissions() {
        try {
            await this.getCameraPermission();
            await this.getCameraRollPermission();
        }
        catch (err) {
            //Handle this error
            return false;
        }
    }
    showActionSheet = () => {
        this.ActionSheet.show()
    }
    uploadTypeAction = (buttonIndex) => {
        if (buttonIndex === 1) {
            if (!this.state.hasCameraPermission || !this.state.hasCameraRollPermission) {
                this.appSettingsPrompt();
                return;
            }
            this.takePhoto();
        } else if (buttonIndex === 2) {
            if (!this.state.hasCameraRollPermission) {
                this.appSettingsPrompt();
                return;
            }
            this.pickImage();
        }
    }
  pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: Platform.OS === 'ios',
    });
    if (!result.cancelled) {
      try {
        const manipResult = await ImageManipulator.manipulateAsync(
          result.uri,
          [{ resize: { height: 160, width: 160 } }],
          { format: 'jpeg' },
        );
        this.setState({ loading: true });
        await this.saveImage(manipResult.uri);
        this.setState({ loading: false });
      } catch (err) {
        this.setState({ loading: false });
        Alert.alert('Could not upload this image');
      }
    }
  };
  takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync();
    if (!result.cancelled) {
      const manipResult = await ImageManipulator.manipulateAsync(
        result.uri,
        [{ resize: { width: 160, height: 160 } }],
        { format: 'jpeg' },
      );
      this.setState({ loading: true });
      await this.saveImage(manipResult.uri);
      this.setState({ loading: false });
    }
  };
  appSettingsPrompt = () => {
    Alert.alert(
      'FitazFK needs permissions to do this',
      'Go to app settings and enable camera and camera roll permissions',
      [
        {
          text: 'Cancel', style: 'cancel',
        },
        {
          text: 'Go to Settings', onPress: () => Linking.openURL('app-settings:'),
        },
      ],
      { cancelable: false },
    );
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
  logOut = async () => {
    try {
      this.setState({ loading: true });
      AsyncStorage.removeItem('uid');
      await this.unsubscribe();
      auth.signOut();
      this.setState({ loading: false });
      this.props.navigation.navigate('Auth');
    } catch (err) {
      this.setState({ loading: false });
      Alert.alert('Error logging out');
    }
  }
  render() {
    const { profile, loading, avatar } = this.state;
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.avatarOutline}>
              <View style={styles.avatarBackdrop}>
                <TouchableOpacity
                  onPress={() => this.chooseUploadType()}
                >
                  <FastImage
                    style={styles.avatar}
                    source={avatar ? { uri: avatar } : require('../../../../assets/images/profile-add.png')}
                  />
                </TouchableOpacity>
              </View>
              <ActionSheet
                ref={o => this.ActionSheet = o}
                options={actionSheetOptions}
                cancelButtonIndex={0}
                onPress={(index) => this.uploadTypeAction(index)}
              />
            </View>
            <View style={styles.nameTextContainer}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.nameText}
              >
                {profile && profile.firstName} {profile && profile.lastName}
              </Text>
            </View>
            <View style={styles.listContainer}>
              <ListItem
                key="Profile"
                title="Profile"
                containerStyle={styles.listItemContainer}
                titleStyle={styles.listItemTitleStyle}
                rightIcon={{ name: 'chevron-right', color: colors.grey.standard }}
                onPress={() => this.props.navigation.navigate('Profile')}
              />
              <ListItem
                key="Settings"
                title="Settings"
                containerStyle={styles.listItemContainerBottom}
                titleStyle={styles.listItemTitleStyle}
                rightIcon={{ name: 'chevron-right', color: colors.grey.standard }}
                onPress={() => this.props.navigation.navigate('Settings')}
              />
            </View>
            <View style={styles.listContainer}>
              <ListItem
                key="InviteFriends"
                title="Free Gifts!"
                containerStyle={styles.listItemContainerGreen}
                titleStyle={styles.listItemTitleStyleGreen}
                onPress={() => this.props.navigation.navigate('InviteFriends')}
                leftIcon={
                  <Icon
                    name="present"
                    size={20}
                    color={colors.green.forest}
                  />
                }
                rightIcon={{ name: 'chevron-right', color: colors.grey.standard }}
              />
            </View>
            <View style={styles.listContainer}>
              {
                list.map((l) => (
                  <ListItem
                    key={l.title}
                    title={l.title}
                    containerStyle={styles.listItemContainer}
                    titleStyle={styles.listItemTitleStyle}
                    rightIcon={{ name: 'chevron-right', color: colors.grey.standard }}
                    onPress={() => this.props.navigation.navigate(l.route)}
                  />
                ))
              }
              <ListItem
                title="Log Out"
                containerStyle={styles.listItemContainerBottom}
                titleStyle={styles.listItemTitleStyle}
                rightIcon={{ name: 'chevron-right', color: colors.grey.standard }}
                onPress={() => this.logOutAlert()}
              />
            </View>
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
    paddingTop: 20,
    alignItems: 'center',
  },
  avatarOutline: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBackdrop: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.grey.standard,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    borderTopWidth: 0,
    borderColor: colors.grey.light,
    shadowColor: colors.grey.standard,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: colors.white,
  },
  listItemContainer: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomColor: colors.grey.light,
    borderBottomWidth: 1,
    backgroundColor: colors.white,
  },
  listItemContainerGreen: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 0,
    backgroundColor: colors.green.superLight,
  },
  listItemContainerBottom: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 0,
    backgroundColor: colors.white,
  },
  listItemTitleStyle: {
    fontFamily: fonts.bold,
    color: colors.charcoal.standard,
    marginTop: 5,
    fontSize: 14,
  },
  listItemTitleStyleGreen: {
    fontFamily: fonts.bold,
    color: colors.green.forest,
    marginTop: 5,
    fontSize: 14,
  },
});
