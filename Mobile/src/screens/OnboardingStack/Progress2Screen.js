import React from "react";
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
  Platform,
} from "react-native";
import { Linking } from "expo";
import * as Haptics from "expo-haptics";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-community/async-storage";
import Loader from "../../components/Shared/Loader";
import Icon from "../../components/Shared/Icon";

import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import ActionSheet from "react-native-actionsheet";
import CustomBtn from "../../components/Shared/CustomBtn";
import { containerPadding } from "../../styles/globalStyles";
import * as MediaLibrary from "expo-media-library";
import { db } from "../../../config/firebase";

import moment from "moment";

const { width } = Dimensions.get("window");
const actionSheetOptions = ["Cancel", "Take photo", "Upload from Camera Roll"];

const uriToBlob = (url) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onerror = reject;
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        resolve(xhr.response);
      }
    };
    xhr.open("GET", url);
    xhr.responseType = "blob"; // convert type
    xhr.send();
  });
};

const storeProgressInfo = async (
  image,
  isInitial,
  weight,
  waist,
  hip,
  burpeeCount
) => {
  const uid = await AsyncStorage.getItem("uid");
  const firebase = require("firebase");

  let blob = "";
  if (Platform.OS === "ios") {
    const base64Response = await fetch(
      `data:image/jpeg;base64,${image.base64}`
    );
    blob = base64Response.blob()._W;
    if (!blob) {
      const base64Response = await fetch(
        `data:image/jpeg;base64,${image.base64}`
      );

      blob = await base64Response.blob();
    }
  }
  if (Platform.OS === "android") blob = await uriToBlob(image.uri);

  const storageRef = firebase.storage().ref();
  const userPhotosStorageRef = storageRef.child("user-photos");
  const userStorageRef = userPhotosStorageRef.child(uid);
  const progressDataFieldName = isInitial
    ? "initialProgressInfo"
    : "currentProgressInfo";
  const progressPhotoFilename = isInitial
    ? "initial-progress-photo.jpeg"
    : "current-progress-photo.jpeg";
  const progressPhotoStorageRef = userStorageRef.child(progressPhotoFilename);
  const metadata = {
    contentType: "image/jpeg",
    cacheControl: "public",
  };
  const snapshot = await progressPhotoStorageRef.put(blob, metadata);
  const url = await snapshot.ref.getDownloadURL();
  await db
    .collection("users")
    .doc(uid)
    .set(
      {
        [progressDataFieldName]: {
          photoURL: url,
          // weight: parseInt(weight, 10),
          // waist: parseInt(waist, 10),
          // hip: parseInt(hip, 10),
          // burpeeCount,
          date: moment().format("YYYY-MM-DD"),
        },
      },
      { merge: true }
    );
};

export default class Progress2Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      hasCameraRollPermission: null,
      hasExternalStorageDevicePermission: null,
      image: null,
      uploading: false,
      error: null,
    };
  }
  componentDidMount = () => {
    this.props.navigation.setParams({ handleSkip: this.handleSkip });
    // if (Platform.OS === 'android') {
    //   this.requestAndroidPermissions();

    // }else{
    // this.getCameraPermission();
    // this.getCameraRollPermission();
    // }
    this.fetchImage();
  };

  fetchImage = async () => {
    const uid = await AsyncStorage.getItem("uid");
    db.collection("users")
      .doc(uid)
      .get()
      .then(async (snapshot) => {
        const isInitial = this.props.navigation.getParam("isInitial");
        const data = snapshot.data();
        const progressInfo = isInitial
          ? data.initialProgressInfo
          : data.currentProgressInfo;
        if (progressInfo) {
          const imageURL = progressInfo.photoURL ?? null;
          if (imageURL) {
            await FileSystem.downloadAsync(
              imageURL,
              `${FileSystem.cacheDirectory}progressImage.jpeg`
            );
            const image = await ImageManipulator.manipulateAsync(
              `${FileSystem.cacheDirectory}progressImage.jpeg`,
              [],
              { base64: true }
            );
            this.setState({ image });
          }
        }
      })
      .catch((reason) => {
        console.log("[Progress2Screen.js fetchImage()] error: ", reason);
        Alert.alert("Error", `Error: ${reason}.`);
      });
  };

  getCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  };

  getCameraRollPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ hasCameraRollPermission: status === "granted" });
  };

  async requestAndroidPermissions() {
    try {
      await this.getCameraPermission();
      await this.getCameraRollPermission();
    } catch (err) {
      //Handle this error
      return false;
    }
  }

  appSettingsPrompt = () => {
    Alert.alert(
      "FitazFK needs permissions to do this",
      "Go to app settings and enable camera and camera roll permissions",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Go to Settings",
          onPress: () => Linking.openURL("app-settings:"),
        },
      ],
      { cancelable: false }
    );
  };

  chooseUploadType = () => {
    if (Platform.OS === "android") {
      this.requestAndroidPermissions();
      this.showActionSheet();
    } else {
      this.getCameraPermission();
      this.getCameraRollPermission();
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: actionSheetOptions,
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          this.uploadTypeAction(buttonIndex);
        }
      );
    }
  };

  async requestAndroidPermissions() {
    try {
      await this.getCameraPermission();
      await this.getCameraRollPermission();
    } catch (err) {
      //Handle this error
      return false;
    }
  }

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  uploadTypeAction = (buttonIndex) => {
    if (buttonIndex === 1) {
      if (
        !this.state.hasCameraPermission ||
        !this.state.hasCameraRollPermission
      ) {
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
  };

  takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync();
    if (!result.cancelled) {
      const manipResult = await ImageManipulator.manipulateAsync(
        result.uri,
        [{ resize: { width: 600, height: 800 } }],
        { format: "jpeg", compress: 0.7, base64: true }
      );
      this.setState({ image: manipResult });
    }
    MediaLibrary.saveToLibraryAsync(result.uri);
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
          [{ resize: { height: 800, width: 600 } }],
          { format: "jpeg", compress: 0.7, base64: true }
        );
        this.setState({ image: manipResult });
      } catch (err) {
        this.setState({
          error:
            "There was a problem with that image, please try a different one",
        });
        console.log(err);
      }
    }
  };

  handleSkip = () => {
    if (this.props.navigation.getParam("isInitial", false)) {
      Alert.alert(
        "Warning",
        "Entering your progress information is a good way to stay accountable. Are you sure you want to skip?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Skip",
            onPress: () => this.props.navigation.navigate("Progress"),
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        "Warning",
        "Skipping means that you will lose any information that you have already entered.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Skip",
            onPress: () => this.props.navigation.navigate("Progress"),
          },
        ],
        { cancelable: false }
      );
    }
  };

  handleImagePicked = async (pickerResult) => {
    const { navigation } = this.props;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    this.setState({ uploading: true });
    try {
      if (this.state.image !== null) {
        await FileSystem.downloadAsync(
          "https://firebasestorage.googleapis.com/v0/b/staging-fitazfk-app.appspot.com/o/videos%2FBURPEE%20(2).mp4?alt=media&token=9ae1ae37-6aea-4858-a2e2-1c917007803f",
          `${FileSystem.cacheDirectory}exercise-burpees.mp4`
        );

        const uid = await AsyncStorage.getItem("uid");
        const userRef = db.collection("users").doc(uid);
        await storeProgressInfo(
          pickerResult,
          this.props.navigation.getParam("isInitial"),
          0,
          0,
          0,
          0
        );

        this.props.navigation.navigate("ProgressHome");
      } else {
        this.setState({
          error: "Please select an image to continue",
          uploading: false,
        });
      }
    } catch (err) {
      console.log("image upload: ", err);
      this.setState({
        error: "Problem uploading image, please try again",
        uploading: false,
      });
    }
  };

  handleCancel = () => {
    const { navigation } = this.props;
    // navigation.pop();
    navigation.state.params.progressEdit !== undefined
      ? navigation.navigate("ProgressEdit")
      : navigation.navigate("ProgressHome");
  };

  render() {
    const { image, uploading, error } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.flexContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>Progress photo</Text>
            <Text style={styles.bodyText}>
              It’s time to get serious. Taking a progress photo is a great way
              to stay accountable.
            </Text>
            <Text style={styles.bodyText}>
              Tip: Take a front-on, portrait photo. Try to take your photo in
              natural light.
            </Text>
          </View>
          <View style={styles.contentContainer}>
            {image ? (
              <View>
                <Image
                  resizeMode="contain"
                  source={{ uri: image.uri }}
                  style={styles.image}
                />
                <CustomBtn
                  style={{ marginTop: 10 }}
                  Title="Update Photo"
                  titleCapitalise={true}
                  onPress={this.chooseUploadType}
                />
              </View>
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
                <Text style={styles.imagePlaceholderText}>Add a photo</Text>
              </TouchableOpacity>
            )}
            <ActionSheet
              ref={(o) => (this.ActionSheet = o)}
              options={actionSheetOptions}
              cancelButtonIndex={0}
              onPress={(index) => this.uploadTypeAction(index)}
            />
          </View>

          <View style={styles.buttonContainer}>
            {error && <Text style={styles.errorText}>{error}</Text>}

            <CustomBtn
              // Title="Update Photo"
              Title="Upload Photo"
              titleCapitalise={true}
              onPress={() => this.handleImagePicked(image)}
            />
            <CustomBtn
              Title="Cancel"
              customBtnStyle={{
                marginTop: 5,
                backgroundColor: colors.coolIce,
              }}
              titleCapitalise={true}
              onPress={() => this.handleCancel()}
            />
          </View>
          <Loader loading={uploading} color={colors.coral.standard} />
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
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.offWhite,
  },
  textContainer: {
    flex: 1,
    width,
    padding: 10,
    paddingHorizontal: containerPadding,
  },
  headerText: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.charcoal.light,
    marginBottom: 5,
  },
  bodyText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.light,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
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
    alignItems: "center",
    justifyContent: "center",
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
    textAlign: "center",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 10,
    paddingHorizontal: containerPadding,
    width: "100%",
  },
  errorText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.coral.standard,
    textAlign: "center",
    margin: 10,
  },
});
