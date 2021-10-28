import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  ActionSheetIOS,
  PermissionsAndroid,
} from "react-native";
import ActionSheet from "react-native-actionsheet";
import { Linking } from "expo";
import * as Haptics from "expo-haptics";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import * as ImageManipulator from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import Icon from "../../../components/Shared/Icon";
import Loader from "../../../components/Shared/Loader";
import { number } from "prop-types";
import ChallengeStyle from "../chellengeStyle";
import globalStyle, { containerPadding } from "../../../styles/globalStyles";
import CustomBtn from "../../../components/Shared/CustomBtn";
import fonts from "../../../styles/fonts";
import colors from "../../../styles/colors";
import AsyncStorage from "@react-native-community/async-storage";
const { width } = Dimensions.get("window");
const actionSheetOptions = ["Cancel", "Take photo", "Upload from Camera Roll"];
import storeProgressInfo from "../../../components/Challenges/storeProgressInfo";
import { NavigationActions, StackActions } from "react-navigation";
import createUserChallengeData from "../../../components/Challenges/UserChallengeData";
import { db } from "../../../../config/firebase";
import moment from "moment";
import CalendarModal from "../../../components/Shared/CalendarModal";

const uriToBlob = (url) => {
  return new Promise((resolve, reject) => {
    try {
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
    } catch (err) {
      console.log(err);
    }
  });
};

export default class OnBoarding4 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      challengeData: {},
      hasCameraPermission: null,
      hasCameraRollPermission: null,
      hasExternalStorageDevicePermission: null,
      image: null,
      uploading: false,
      error: null,
      imgUrl: null,
      btnDisabled: true,
      addingToCalendar: false,
      chosenDate: new Date(),
      loading: false,
      calendarModalVisible: false,
      chosenDate: new Date(),
    };
  }

  fetchUserImageUrl = async () => {
    try {
      const uid = await AsyncStorage.getItem("uid");
      const userSnapshot = await db.collection("users").doc(uid).get();
      const user = userSnapshot.data();
      return user.initialProgressInfo.photoURL ?? null;
    } catch (error) {
      return null;
    }
  };

  showCalendarModal = () => {
    this.setState({ calendarModalVisible: true });
  };

  hideCalendarModal = () => {
    this.setState({ calendarModalVisible: false, loading: false });
  };

  setDate = async (event, selectedDate) => {
    // console.log("setDate call")
    if (selectedDate && Platform.OS === "android") {
      this.hideCalendarModal();
      this.setState({ loading: true });
      this.addChallengeToCalendar(selectedDate);
    }
    if (selectedDate && Platform.OS === "ios") {
      const currentDate = selectedDate;
      this.setState({ chosenDate: currentDate });
    }
  };

  onFocusFunction = async () => {
    const data = this.props.navigation.getParam("data", {});
    console.log("OnBoarding4 data:", data);
    const image = data["challengeData"].image
      ? data["challengeData"].image
      : null;
    const imgUrl = await this.fetchUserImageUrl();
    console.log("Challenge: ", data["challengeData"]);
    this.setState({
      challengeData: data["challengeData"],
      image,
      imgUrl,
      btnDisabled: false,
    });
  };

  // add a focus listener onDidMount
  async componentDidMount() {
    this.props.navigation.setParams({
      handleSkip: () => {
        this.goToScreen("next");
      },
    });
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      this.onFocusFunction();
    });
    // if (Platform.OS === 'android') {
    //   await this.requestAndroidPermissions();

    // }else{
    // this.getCameraPermission();
    // this.getCameraRollPermission();
    // }
  }

  getCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
    console.log("getCameraPermission");
  };

  getCameraRollPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ hasCameraRollPermission: status === "granted" });
    console.log("getCameraRollPermission");
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
      this.uploading(manipResult);
      MediaLibrary.saveToLibraryAsync(result.uri);
    }
  };

  pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    // console.log(result);
    const originXValue = result.width > result.height ? 130 : 0;
    if (!result.cancelled) {
      try {
        const manipResult = await ImageManipulator.manipulateAsync(
          result.uri,
          [
            { resize: { height: 800, width: 600, } },
            // {
            //   crop: {
            //     originX: originXValue,
            //     originY: 0,
            //     width: 600,
            //     height: 800,
            //   },
            // },
          ],
          { format: "jpeg", compress: 0.7, base64: true }
        );
        this.uploading(manipResult);
      } catch (err) {
        this.setState({
          error:
            "There was a problem with that image, please try a different one",
        });
      }
    }
  };

  // and don't forget to remove the listener
  componentWillUnmount() {
    this.focusListener.remove();
  }

  saveImage = async (uri, blob) => {
    try {
      const uid = await AsyncStorage.getItem("uid");
      const firebase = require("firebase");
      // const blob = await uriToBlob(uri);
      const storageRef = firebase.storage().ref();
      const userPhotosStorageRef = storageRef.child("user-photos");
      const userStorageRef = userPhotosStorageRef.child(uid);
      const avatarStorageRef = userStorageRef.child(
        "beforeChallengePhoto.jpeg"
      );
      const metadata = {
        contentType: "image/jpeg",
        cacheControl: "public",
      };
      // console.log(blob)
      const snapshot = await avatarStorageRef.put(blob, metadata);
      const url = await snapshot.ref.getDownloadURL();
      // console.log(url)
      this.setState({ imgUrl: url });
    } catch (err) {
      console.log(err);
      Alert.alert("Image save error");
    }
  };

  addedToCalendarPopup(stringDate2) {
    const onPressAlert = () => {
      // this.hideCalendarModal();
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: "Tabs",
            action: NavigationActions.navigate({
              routeName: "Calendar",
            }),
          }),
        ],
      });
      this.props.navigation.dispatch(resetAction);
    };
    this.setState({ addingToCalendar: false });
    Alert.alert(
      "",
      `Your start date has been added to your challenge. Go to ${stringDate2} on the challenge dashboard to see what Day 1 looks like.`,
      [{ text: "OK", onPress: onPressAlert, style: "cancel" }],
      { cancelable: false }
    );
    // }
  }

  async updateOnBoardingInfo(data) {
    this.setState({ loading: true });
    {
      this.props.navigation.getParam("challengeOnboard")
        ? this.setState({ loading: false })
        : this.setState({ loading: true });
    }
    const uid = await AsyncStorage.getItem("uid");
    const userRef = db
      .collection("users")
      .doc(uid)
      .collection("challenges")
      .doc(data.id);
    userRef
      .set(data, { merge: true })
      .then(async (res) => {
        if (data.onBoardingInfo.fitnessLevel)
          await AsyncStorage.setItem(
            "fitnessLevel",
            data.onBoardingInfo.fitnessLevel.toString()
          );
        this.setState({ loading: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
      });
  }

  async saveOnBoardingInfo(data, stringDate2) {
    this.setState({ loading: true });
    {
      this.props.navigation.getParam("challengeOnboard")
        ? this.setState({ loading: false })
        : this.setState({ loading: true });
    }
    const uid = await AsyncStorage.getItem("uid");
    const userRef = db
      .collection("users")
      .doc(uid)
      .collection("challenges")
      .doc(data.id);
    userRef
      .set(data, { merge: true })
      .then(async (res) => {
        if (data.onBoardingInfo.fitnessLevel)
          await AsyncStorage.setItem(
            "fitnessLevel",
            data.onBoardingInfo.fitnessLevel.toString()
          );
        this.setState({ loading: false });
        this.addedToCalendarPopup(stringDate2);
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
      });
  }

  addChallengeToCalendar = async (date) => {
    if (this.state.addingToCalendar) {
      return;
    }
    this.setState({ addingToCalendar: true });
    ////////////////////saving on calendar
    let updatedChallengedata = this.state.challengeData;

    console.log("Challenge data: ", updatedChallengedata);

    let skipped = updatedChallengedata.onBoardingInfo.skipped;

    if (!skipped) {
      skipped = this.state.imgUrl == null ? true : false;
    }

    console.log("Skipped: ", skipped);
    const onBoardingInfo = Object.assign(
      {},
      updatedChallengedata.onBoardingInfo,
      {
        skipped: skipped,
      }
    );

    updatedChallengedata = Object.assign({}, updatedChallengedata, {
      onBoardingInfo,
    });

    const data = createUserChallengeData(updatedChallengedata, new Date(date));

    const progressData = {
      photoURL: this.state.imgUrl,
      height: updatedChallengedata.onBoardingInfo.measurements.height,
      weight: updatedChallengedata.onBoardingInfo.measurements.weight,
      goalWeight: updatedChallengedata.onBoardingInfo.measurements.goalWeight,
      waist: updatedChallengedata.onBoardingInfo.measurements.waist,
      hip: updatedChallengedata.onBoardingInfo.measurements.hip,
      burpeeCount: updatedChallengedata.onBoardingInfo.burpeeCount ?? 0,
      fitnessLevel: updatedChallengedata.onBoardingInfo.fitnessLevel,
    };

    // const stringDate = moment(date).format("YYYY-MM-DD").toString();
    const stringDate2 = moment(date).format("DD-MM-YY").toString();
    const TODAY = moment();

     // if (
    //   new Date(updatedChallengedata.startDate).getTime() <
    //   new Date(stringDate).getTime()
    // ) {
    //   data.isSchedule = true;
    //   data.status = "InActive";
    // }
    
    if (moment(date).isSame(TODAY, "d")) {
      Object.assign(data, { isSchedule: true, status: "Active" });
    } else {
      // Object.assign(data, { isSchedule: true, status: "InActive" });
      Object.assign(data, { isSchedule: true, status: "Active" });
    }

    await storeProgressInfo(progressData);
    await this.saveOnBoardingInfo(data, stringDate2);
  };

  async goToScreen(type) {
    let { challengeData, image, imgUrl } = this.state;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      // if (imgUrl !== null) {
      const onBoardingInfo = Object.assign({}, challengeData.onBoardingInfo, {
        beforePhotoUrl: imgUrl ? imgUrl : null,
      });
      let updatedChallengedata = Object.assign({}, challengeData, {
        onBoardingInfo,
        image: image,
      });
      // console.log(updatedChallengedata)
      if (type === "next") {
        if (this.props.navigation.getParam("onboardingProcessComplete")) {
          let skipped = challengeData.onBoardingInfo.skipped;
          if (!skipped) {
            skipped = this.state.imgUrl == null ? true : false;
          }
          console.log("Skipped: ", skipped);
          const onBoardingInfo = Object.assign(
            {},
            updatedChallengedata.onBoardingInfo,
            {
              skipped: skipped,
            }
          );

          updatedChallengedata = Object.assign({}, updatedChallengedata, {
            onBoardingInfo,
          });

          const data = createUserChallengeData(
            updatedChallengedata,
            new Date(updatedChallengedata.startDate)
          );

          this.updateOnBoardingInfo(data);

          const progressData = {
            photoURL: this.state.imgUrl,
            height: updatedChallengedata.onBoardingInfo.measurements.height,
            weight: updatedChallengedata.onBoardingInfo.measurements.weight,
            goalWeight:
              updatedChallengedata.onBoardingInfo.measurements.goalWeight,
            waist: updatedChallengedata.onBoardingInfo.measurements.waist,
            hip: updatedChallengedata.onBoardingInfo.measurements.hip,
            burpeeCount: updatedChallengedata.onBoardingInfo.burpeeCount ?? 0,
            fitnessLevel: updatedChallengedata.onBoardingInfo.fitnessLevel,
          };
          storeProgressInfo(progressData);
          // this.props.navigation.navigate("WorkoutInfo");
          const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "Tabs",
                action: NavigationActions.navigate({
                  routeName: "Calendar",
                }),
              }),
            ],
          });
          this.props.navigation.dispatch(resetAction);
        } else {
          // this.props.navigation.navigate("ChallengeOnBoarding5", {
          //   data: {
          //     challengeData: updatedChallengedata,
          //   },
          //   onboardingProcessComplete:
          //     this.props.navigation.getParam("onboardingProcessComplete") !==
          //     undefined
          //       ? this.props.navigation.getParam("onboardingProcessComplete")
          //       : false,
          //   challengeOnboard:
          //     this.props.navigation.getParam("challengeOnboard") !== undefined
          //       ? this.props.navigation.getParam("challengeOnboard")
          //       : false,
          // });

          // this.addChallengeToCalendar(moment().set("date", 26));
          this.showCalendarModal();
        }
        // Alert.alert('',
        //   `Before Picture ${onBoardingInfo.beforePhotoUrl === "" ? 'None' : onBoardingInfo.beforePhotoUrl.toString()}`,
        //   [
        //     {
        //       text: 'OK', onPress:()=>{
        //         if (this.props.navigation.getParam('onboardingProcessComplete')) {
        //           const progressData = {
        //             photoURL: updatedChallengedata.onBoardingInfo.beforePhotoUrl,
        //             height: updatedChallengedata.onBoardingInfo.measurements.height,
        //             goalWeight: updatedChallengedata.onBoardingInfo.measurements.goalWeight,
        //             weight: updatedChallengedata.onBoardingInfo.measurements.weight,
        //             waist: updatedChallengedata.onBoardingInfo.measurements.waist,
        //             hip: updatedChallengedata.onBoardingInfo.measurements.hip,
        //             burpeeCount: 1,
        //             fitnessLevel: 1
        //           }
        //           storeProgressInfo(progressData);
        //           this.props.navigation.navigate('WorkoutInfo');
        //         } else {
        //           this.props.navigation.navigate('ChallengeOnBoarding5',{
        //             data:{
        //                    challengeData:updatedChallengedata
        //                  },
        //                  onboardingProcessComplete: this.props.navigation.getParam('onboardingProcessComplete') !== undefined ? this.props.navigation.getParam('onboardingProcessComplete') : false,
        //                  challengeOnboard: this.props.navigation.getParam('challengeOnboard') !== undefined ? this.props.navigation.getParam('challengeOnboard') : false
        //           })
        //         }

        //       }
        //     },
        //   ],
        //   { cancelable: false }
        // );
      } else {
        this.props.navigation.navigate("ChallengeOnBoarding3", {
          data: {
            challengeData: updatedChallengedata,
          },
          onboardingProcessComplete:
            this.props.navigation.getParam("onboardingProcessComplete") !==
            undefined
              ? this.props.navigation.getParam("onboardingProcessComplete")
              : false,
        });
      }
      if (type === "next") {
        // if(type === 'next'){
        //   this.props.navigation.navigate('ChallengeOnBoarding5',{
        //     data:{
        //            challengeData:updatedChallengedata
        //          }
        //   })
        // }
      } else if (type === "previous") {
        this.props.navigation.navigate("ChallengeOnBoarding3", {
          data: {
            challengeData: challengeData,
          },
        });
      } else {
        this.setState({
          error: "Please select an image to continue",
          uploading: false,
        });
      }
    } catch (err) {
      console.log(err);
      this.setState({
        error: "Problem uploading image, please try again",
        uploading: false,
      });
    }
  }

  uploading = async (result) => {
    this.setState({ uploading: true });
    let blob = "";
    if (Platform.OS === "ios") {
      const base64Response = await fetch(
        `data:image/jpeg;base64,${result.base64}`
      );
      blob = base64Response.blob()._W;
    }
    if (Platform.OS === "android") blob = await uriToBlob(result.uri);

    await this.saveImage(result.uri, blob);

    this.setState({ uploading: false });
  };

  render() {
    const {
      image,
      uploading,
      error,
      btnDisabled,
      imgUrl,
      loading,
      calendarModalVisible,
      addingToCalendar,
      chosenDate,
    } = this.state;
    console.log("addingToCalendar: ", addingToCalendar)
    return (
      <SafeAreaView style={ChallengeStyle.container}>
        <View style={[globalStyle.container, { paddingVertical: 15 }]}>
          <CalendarModal
            isVisible={calendarModalVisible}
            onBackdropPress={this.hideCalendarModal}
            value={chosenDate}
            onChange={this.setDate}
            onPress={() => this.addChallengeToCalendar(chosenDate)}
            addingToCalendar={addingToCalendar}
            loading={loading}
          />
          <View>
            <Text style={[ChallengeStyle.onBoardingTitle]}>
              Take your before picture
            </Text>
            <Text
              style={{
                fontFamily: fonts.standard,
                fontSize: 15,
                marginTop: 10,
              }}
            >
              Taking your before picture is an important part of your challenge
              journey. It allows you to reflect back and see how far you have
              progressed
            </Text>
          </View>

          <View style={styles.contentContainer}>
            {imgUrl ? (
              <TouchableOpacity
                onPress={this.chooseUploadType}
                style={styles.imageContainer}
              >
                <Image
                  resizeMode="contain"
                  source={{ uri: imgUrl }}
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

          <View style={[{ flex: 1, justifyContent: "flex-end" }]}>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <CustomBtn
              Title={imgUrl ? "Start Challenge" : "Next"}
              customBtnStyle={{ padding: 15, width: "100%" }}
              onPress={() => this.goToScreen("next")}
              isRightIcon={true}
              rightIconName="chevron-right"
              rightIconColor={colors.black}
              rightIconSize={13}
              customBtnTitleStyle={{ marginRight: 10 }}
            />
            <CustomBtn
              Title="Back"
              customBtnStyle={{
                padding: 15,
                width: "100%",
                marginTop: 5,
                marginBottom: -10,
                backgroundColor: "transparent",
              }}
              onPress={() => this.goToScreen("previous")}
              disabled={btnDisabled}
              customBtnTitleStyle={{ color: colors.black, marginRight: 40 }}
              isLeftIcon={true}
              leftIconName="chevron-left"
              leftIconColor={colors.black}
              leftIconSize={13}
            />
          </View>
          <Loader
            loading={uploading || loading}
            color={colors.themeColor.color}
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
