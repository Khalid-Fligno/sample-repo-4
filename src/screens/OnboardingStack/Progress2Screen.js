import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ActionSheetIOS,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { ImagePicker, ImageManipulator, Permissions, Linking, FileSystem } from 'expo';
import Loader from '../../components/Shared/Loader';
import Icon from '../../components/Shared/Icon';
import CustomButton from '../../components/Shared/CustomButton';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const { width } = Dimensions.get('window');

export default class Progress2Screen extends React.PureComponent {
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
  componentDidMount = () => {
    this.props.navigation.setParams({ handleSkip: this.handleSkip });
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
  handleSkip = () => {
    if (this.props.navigation.getParam('isInitial', false)) {
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
    } else {
      Alert.alert(
        'Warning',
        'Skipping means that you will lose any information that you have already entered.',
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
      const manipResult = await ImageManipulator.manipulateAsync(
        result.uri,
        [{ resize: { width: 600, height: 800 } }],
        { format: 'jpeg', compress: 0.7 },
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
        const manipResult = await ImageManipulator.manipulateAsync(
          result.uri,
          [{ resize: { height: 800 } }, {
            crop: {
              originX: originXValue, originY: 0, width: 600, height: 800,
            },
          }],
          { format: 'jpeg', compress: 0.7 },
        );
        this.setState({ image: manipResult });
      } catch (err) {
        this.setState({ error: 'There was a problem with that image, please try a different one' });
      }
    }
  };
  handleImagePicked = async (pickerResult) => {
    this.setState({ uploading: true });
    try {
      if (this.state.image !== null) {
        const {
          weight,
          waist,
          hip,
          isInitial,
        } = this.props.navigation.state.params;
        await FileSystem.downloadAsync(
          'https://firebasestorage.googleapis.com/v0/b/fitazfk-app.appspot.com/o/videos%2FBURPEES.mp4?alt=media&token=688885cb-2d70-4fc6-82a9-abc4e95daf89',
          `${FileSystem.cacheDirectory}exercise-burpees.mp4`,
        );
        this.setState({ uploading: false });
        this.props.navigation.navigate('Progress3', {
          image: pickerResult,
          weight,
          waist,
          hip,
          isInitial,
        });
      } else {
        this.setState({ error: 'Please select an image to continue', uploading: false });
      }
    } catch (err) {
      this.setState({ error: 'Problem uploading image, please try again', uploading: false });
    }
  };
  render() {
    const { image, uploading, error } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.flexContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>
              Progress photo
            </Text>
            <Text style={styles.bodyText}>
              It’s time to get serious. Taking a progress photo is a great way to stay accountable.
            </Text>
            <Text style={styles.bodyText}>
              Tip: Take a front-on, portrait photo.  Try to take your photo in natural light.
            </Text>
          </View>
          <View style={styles.contentContainer}>
            {
              image ? (
                <TouchableOpacity
                  onPress={this.chooseUploadType}
                  style={styles.imageContainer}
                >
                  <Image
                    resizeMode="contain"
                    source={{ uri: image.uri }}
                    style={styles.image}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={this.chooseUploadType}
                  style={styles.imagePlaceholder}
                >
                  <Icon
                    name="add-circle"
                    size={40}
                    color={colors.charcoal.light}
                  />
                  <Text style={styles.imagePlaceholderText}>
                    Add a photo
                  </Text>
                </TouchableOpacity>
              )
            }
          </View>
          <View style={styles.buttonContainer}>
            {
              error && <Text style={styles.errorText}>{error}</Text>
            }
            <CustomButton
              title="NEXT"
              onPress={() => this.handleImagePicked(image)}
              primary
            />
          </View>
          <Loader
            loading={uploading}
            color={colors.coral.standard}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  flexContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.offWhite,
  },
  textContainer: {
    flex: 1,
    width,
    padding: 10,
    paddingTop: 15,
  },
  headerText: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.charcoal.light,
    marginBottom: 10,
  },
  bodyText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.light,
    marginLeft: 3,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    shadowColor: colors.grey.standard,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  image: {
    height: 240,
    width: 180,
    backgroundColor: colors.grey.standard,
    borderRadius: 4,
    shadowColor: colors.grey.standard,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 240,
    width: 180,
    backgroundColor: colors.grey.standard,
    borderRadius: 4,
    shadowColor: colors.grey.standard,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  imagePlaceholderText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.charcoal.light,
    margin: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
  errorText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.coral.standard,
    textAlign: 'center',
    margin: 10,
  },
});
