import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Button, Image, ActionSheetIOS, AsyncStorage, Alert } from 'react-native';
import { ImagePicker, Permissions, Linking } from 'expo';
// import { db } from '../../../config/firebase';
import Loader from '../../components/Loader';
import CustomButton from '../../components/CustomButton';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const uploadImageAsync = async (uri) => {
  const uid = await AsyncStorage.getItem('uid');
  const firebase = require('firebase');
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = firebase.storage().ref();
  const usersStorageRef = storageRef.child('user-photos');
  const userStorageRef = usersStorageRef.child(uid);
  const beforePhotoStorageRef = userStorageRef.child('before-photo');
  const snapshot = await beforePhotoStorageRef.put(blob);
  return snapshot.downloadURL;
};

export default class OnboardingScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      hasCameraRollPermission: null,
      image: null,
      uploading: false,
    };
  }
  componentWillMount = () => {
    this.getCameraPermission();
    this.getCameraRollPermission();
  }
  getCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }
  getCameraRollPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ hasCameraRollPermission: status === 'granted' });
  }
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
  chooseUploadType = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Take photo', 'Upload from Camera Roll'],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          if (this.state.hasCameraPermission) {
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
      },
    );
  }
  takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync();
    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
    this.handleImagePicked(result);
  };
  pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
    this.handleImagePicked(result);
  };
  handleImagePicked = async (pickerResult) => {
    try {
      this.setState({ uploading: true });
      if (!pickerResult.cancelled) {
        const uploadUrl = await uploadImageAsync(pickerResult.uri);
        this.setState({ image: uploadUrl });
      }
    } catch (e) {
      console.log(e);
      console.log('Upload failed, sorry :(');
    } finally {
      this.setState({ uploading: false });
    }
  };
  render() {
    const { image, uploading } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.headerText}>
            Header Text
          </Text>
          <Text style={styles.bodyText}>
            Body Text
          </Text>
        </View>
        <View>
          <Button
            title="Upload"
            onPress={this.chooseUploadType}
          />
          {
            image &&
              <Image
                resizeMode="contain"
                source={{ uri: image }}
                style={{ width: 250, height: 250 }}
              />
          }
        </View>
        <View>
          <CustomButton
            title="Next Step"
            onPress={() => this.props.navigation.navigate('Onboarding3')}
            primary
          />
        </View>
        {
          uploading && <Loader loading={uploading} />
        }
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: 24,
  },
  bodyText: {
    textAlign: 'center',
    fontFamily: fonts.standard,
    fontSize: 14,
  },
});
