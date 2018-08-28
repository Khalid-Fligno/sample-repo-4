import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Button, Image, ActionSheetIOS, Alert } from 'react-native';
import { ImagePicker, ImageManipulator, Permissions, Linking } from 'expo';
import Loader from '../../components/Loader';
import CustomButton from '../../components/CustomButton';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

export default class Onboarding3Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      hasCameraRollPermission: null,
      image: null,
      uploading: false,
      error: null,
    };
  }
  componentWillMount = () => {
    this.getCameraPermission();
    this.getCameraRollPermission();
    this.props.navigation.setParams({ handleSkip: this.handleSkip });
  }
  getCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }
  getCameraRollPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ hasCameraRollPermission: status === 'granted' });
  }
  handleSkip = () => {
    Alert.alert(
      'Warning',
      'You will need to do this before your first workout',
      [
        {
          text: 'Cancel', style: 'cancel',
        },
        {
          text: 'Ok, got it!', onPress: () => this.props.navigation.navigate('App'),
        },
      ],
      { cancelable: false },
    );
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
          if (!this.state.hasCameraPermission) {
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
      const manipResult = await ImageManipulator.manipulate(
        result.uri,
        [{ resize: { width: 600, height: 800 } }],
        { format: 'jpeg' },
      );
      this.setState({ image: manipResult });
    }
  };
  pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    const originXValue = result.width > result.height ? 130 : 0;
    if (!result.cancelled) {
      try {
        const manipResult = await ImageManipulator.manipulate(
          result.uri,
          [{ resize: { height: 800 } }, {
            crop: {
              originX: originXValue, originY: 0, width: 600, height: 800,
            },
          }],
          { format: 'jpeg' },
        );
        this.setState({ image: manipResult });
      } catch (err) {
        this.setState({ error: 'There was a problem with that image, please try a different one' });
      }
    }
  };
  handleImagePicked = async (pickerResult) => {
    try {
      this.setState({ uploading: true });
      if (this.state.image !== null) {
        const {
          weight,
          waist,
          hip,
          isInitial,
        } = this.props.navigation.state.params;
        this.props.navigation.navigate('Onboarding4', {
          image: pickerResult,
          weight,
          waist,
          hip,
          isInitial: isInitial || false,
        });
      } else {
        this.setState({ error: 'Please select an image' });
      }
    } catch (err) {
      this.setState({ error: 'Problem uploading image, please try again' });
    } finally {
      this.setState({ uploading: false });
    }
  };
  render() {
    const { image, uploading, error } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.flexContainer}>
          <View>
            <Text style={styles.headerText}>
              Header Text
            </Text>
            <Text style={styles.bodyText}>
              Body Text
            </Text>
          </View>
          <View style={styles.imageContainer}>
            {
              image && (
                <Image
                  resizeMode="contain"
                  source={{ uri: image.uri }}
                  style={styles.image}
                />
              )
            }
            <Button
              title="Choose a photo"
              onPress={this.chooseUploadType}
            />
          </View>
          <View>
            {
              error && <Text>{error}</Text>
            }
            <CustomButton
              title="Next Step"
              onPress={() => this.handleImagePicked(image)}
              primary
            />
          </View>
          {
            uploading && <Loader loading={uploading} color={colors.charcoal.standard} />
          }
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: colors.white,
  },
  flexContainer: {
    flex: 1,
    padding: 15,
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
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 120,
    height: 160,
  },
});
