import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
  TouchableOpacity,
  Picker,
  TextInput,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import * as Haptics from "expo-haptics";
import Modal from "react-native-modal";
import HelperModal from "../../components/Shared/HelperModal";
import CustomButton from "../../components/Shared/CustomButton";
import CustomBtn from "../../components/Shared/CustomBtn";
import Loader from "../../components/Shared/Loader";
import {
  weightOptionsMetric,
  waistOptionsMetric,
  hipOptionsMetric,
  weightOptionsImperial,
  waistOptionsImperial,
  hipOptionsImperial,
} from "../../utils/index";
import { db } from "../../../config/firebase";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import globalStyle, { containerPadding } from "../../styles/globalStyles";
import { BackHandler } from "react-native";
import { findFitnessLevel } from "../../utils";
import moment from "moment";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import _ from "lodash";

const { width } = Dimensions.get("window");

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
  // const firebase = require("firebase");

  // let blob = "";
  // if (Platform.OS === "ios") {
  //   const base64Response = await fetch(
  //     `data:image/jpeg;base64,${image.base64}`
  //   );
  //   console.log("image: ", image);
  //   blob = base64Response.blob()._W;
  // }
  // if (Platform.OS === "android") blob = await uriToBlob(image.uri);

  // const storageRef = firebase.storage().ref();

  // const userPhotosStorageRef = storageRef.child("user-photos");
  // const userStorageRef = userPhotosStorageRef.child(uid);
  const progressDataFieldName = isInitial
    ? "initialProgressInfo"
    : "currentProgressInfo";
  // const progressPhotoFilename = isInitial
  //   ? "initial-progress-photo.jpeg"
  //   : "current-progress-photo.jpeg";

  // const progressPhotoStorageRef = userStorageRef.child(progressPhotoFilename);
  // const metadata = {
  //   contentType: "image/jpeg",
  //   cacheControl: "public",
  // };
  // const snapshot = await progressPhotoStorageRef.put(blob, metadata);
  console.log("Uid: ", uid);
  try {
    await db
      .collection("users")
      .doc(uid)
      .set(
        {
          [progressDataFieldName]: {
            // photoURL: url,
            weight: parseFloat(weight, 10),
            waist: parseInt(waist, 10),
            hip: parseInt(hip, 10),
            // burpeeCount,
            date: moment().format("YYYY-MM-DD"),
          },
        },
        { merge: true }
      );
  } catch (err) {
    console.log("Data set error: ", err);
  }
  console.log("Success");
};

export default class Progress1Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      weight: 60,
      waist: 60,
      hip: 60,
      weightModalVisible: false,
      waistModalVisible: false,
      hipModalVisible: false,
      helperModalVisible: false,
      unitOfMeasurement: null,
      measurements: null,
      image: null,
    };
  }
  componentDidMount = () => {
    this.subscribed = BackHandler.addEventListener("hardwareBackPress", () => true);
    this.props.navigation.setParams({
      handleSkip: this.handleSkip,
      toggleHelperModal: this.showHelperModal,
    });
    this.fetchDataMeasurement();
    if (this.props.navigation.getParam("isInitial")) {
      this.fetchInitialDataMeasurements();
    } else {
      this.fetchCurrentDataMeasurements();
    }
  };
  componentWillUnmount() {
    if(this.subscribed) this.subscribed.remove();
    //BackHandler.removeEventListener("hardwareBackPress", () => true);
  }

  toggleHelperModal = () => {
    this.setState((prevState) => ({
      helperModalVisible: !prevState.helperModalVisible,
    }));
  };
  fetchDataMeasurement = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem("uid");
    this.unsubscribe = await db.collection("users")
      .doc(uid)
      .onSnapshot(async (doc) => {
        var data = await doc.data();

        this.setState({
          unitOfMeasurement: data.unitsOfMeasurement
        })
      })
  }

  fetchInitialDataMeasurements = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem("uid");
    db.collection("users")
      .doc(uid)
      .get()
      .then((snapshot) => {
        const data = snapshot.data();
        const initialProgressInfo = data.initialProgressInfo;
        this.setState({
          weight: initialProgressInfo.weight ?? 0,
          waist: initialProgressInfo.waist ?? 0,
          hip: initialProgressInfo.hip ?? 0,
          loading: false,
        });
      });
  };

  fetchCurrentDataMeasurements = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem("uid");
    db.collection("users")
      .doc(uid)
      .get()
      .then((snapshot) => {
        const data = snapshot.data();
        const progressInfo = data.currentProgressInfo;
        this.setState({
          weight: progressInfo.weight ?? 0,
          waist: progressInfo.waist ?? 0,
          hip: progressInfo.hip ?? 0,
          loading: false,
        });
      });
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
  showModal = (modalNameVisible) => {
    this.setState({ [modalNameVisible]: true });
  };
  hideModal = (modalNameVisible) => {
    this.setState({ [modalNameVisible]: false });
  };
  showHelperModal = () => {
    this.setState({ helperModalVisible: true });
  };
  hideHelperModal = () => {
    this.setState({ helperModalVisible: false });
  };
  handleSubmit = async (weight, waist, hip) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    this.setState({ loading: true });
    const isInitial = this.props.navigation.getParam("isInitial", false);
    const navigateTo = this.props.navigation.getParam("navigateTo", false);
    await FileSystem.downloadAsync(
      "https://firebasestorage.googleapis.com/v0/b/staging-fitazfk-app.appspot.com/o/videos%2FBURPEE%20(2).mp4?alt=media&token=9ae1ae37-6aea-4858-a2e2-1c917007803f",
      `${FileSystem.cacheDirectory}exercise-burpees.mp4`
    );
    // this.setState({ loading: false });
    // this.props.navigation.navigate("Progress2", {
    //   isInitial,
    //   weight,
    //   waist,
    //   hip,
    //   navigateTo,
    // });
    // this.setState({ loading: false });
    const uid = await AsyncStorage.getItem("uid");
    db.collection("users")
      .doc(uid)
      .get()
      .then(async (snapshot) => {
        const isInitial = this.props.navigation.getParam("isInitial", false);
        const data = snapshot.data();
        const progressInfo = isInitial
          ? data.initialProgressInfo
          : data.currentProgressInfo;
        if (progressInfo) {
          const imageURL = progressInfo.photoURL ?? null;
          console.log("ImageURL: ", imageURL);
          if (true) {
            // await FileSystem.downloadAsync(
            //   imageURL,
            //   `${FileSystem.cacheDirectory}progressImage.jpeg`
            // );
            // const image = await ImageManipulator.manipulateAsync(
            //   `${FileSystem.cacheDirectory}progressImage.jpeg`,
            //   [],
            //   { base64: true }
            // );
            const userRef = db.collection("users").doc(uid);

            await storeProgressInfo(
              null,
              this.props.navigation.getParam("isInitial"),
              weight,
              waist,
              hip,
              0
              // this.props.navigation.getParam("isInitial")
              //   ? this.props.navigation.getParam("initialProgressInfo")
              //       .burpeeCount ?? 0
              //   : this.props.navigation.getParam("currentProgressInfo")
              //       .burpeeCount ?? 0
            );
            // const fitnessLevel = findFitnessLevel(
            //   this.props.navigation.getParam("isInitial")
            //     ? this.props.navigation.getParam("initialProgressInfo")
            //         .burpeeCount ?? 0
            //     : this.props.navigation.getParam("currentProgressInfo")
            //         .burpeeCount ?? 0
            // );
            // AsyncStorage.setItem("fitnessLevel", fitnessLevel.toString());
            // try {
            //   await userRef.set(
            //     {
            //       fitnessLevel,
            //       initialBurpeeTestCompleted: true,
            //     },
            //     { merge: true }
            //   );
            //   this.setState({ loading: false });
            //   this.props.navigation.navigate("ProgressEdit");
            // } catch (err) {
            //   this.setState({ loading: false });
            //   Alert.alert("Database write error", `${err}`);
            // }
            this.props.navigation.navigate("ProgressEdit");
          }
        } else {
          const userRef = db.collection("users").doc(uid);
          await storeProgressInfo(
            null,
            this.props.navigation.getParam("isInitial"),
            weight,
            waist,
            hip,
            0
          );

            console.log(weight)
          // const fitnessLevel = findFitnessLevel(0);
          // AsyncStorage.setItem("fitnessLevel", fitnessLevel.toString());
          // try {
          //   await userRef.set(
          //     {
          //       fitnessLevel,
          //       initialBurpeeTestCompleted: true,
          //     },
          //     { merge: true }
          //   );
          //   this.setState({ loading: false });

          // } catch (err) {
          //   this.setState({ loading: false });
          //   Alert.alert("Database write error", `${err}`);
          // }
          this.props.navigation.navigate("ProgressEdit");
        }
      })
      .catch((reason) => {
        console.log("[Progress2Screen.js fetchImage()] error: ", reason);
        Alert.alert("Error", `Error: ${reason}.`, [
          { text: "OK", onPress: () => this.setState({ loading: false }) },
        ]);
      });
  };

  handleCancel = () => {
    const { navigation } = this.props;
    // navigation.pop();
    navigation.state.params.progressEdit !== undefined
      ? navigation.navigate("ProgressEdit")
      : navigation.pop();
  };

  render() {
    const {
      loading,
      weight,
      waist,
      hip,
      weightModalVisible,
      waistModalVisible,
      hipModalVisible,
      unitOfMeasurement,
      measurements,
      helperModalVisible,
      uom,
    } = this.state;
    // console.log("weight:",this.state.weight);
       console.log(uom);
    if(unitOfMeasurement =='metric'){
      this.setState({
        uom: 'kg'
      })
    }else{
      this.setState({
        uom: 'lbs'
      })
    }
    let weightData = weight.toString()
    return (
      <SafeAreaView style={styles.safeAreaContainer}>

        <KeyboardAvoidingView keyboardVerticalOffset={90} behavior="padding">
          <View style={styles.container}>
            <View style={styles.textContainer}>
              <Text style={styles.headerText}>{this.props.navigation.getParam("isInitial") ? "Measurements" : "Progress Measurements"}</Text>
              <Text style={styles.bodyText}>
                To help you track your progress, let’s find out where you are
                now.
              </Text>
            </View>
            <View style={styles.contentContainer}>
              <View style={styles.inputFieldContainer}>
                <Text style={styles.inputFieldTitle}>Weight({uom})</Text>

                {unitOfMeasurement ==="metric"
                ?
                  <TextInput style={styles.inputButton} 
                    placeholder="kg" 
                    keyboardType='numeric'
                    onChangeText={(value)=>
                      this.setState({weight: value})}
                    value={weightData}
                />

                :
                  <TextInput style={styles.inputButton} 
                    placeholder="lbs" 
                    keyboardType='numeric'
                    onChangeText={(value)=>
                      this.setState({weight: value})}
                    value={weightData}
                />
              }
               
                {/* <TouchableOpacity
                  onPress={() => this.showModal("weightModalVisible")}
                  style={styles.inputButton}
                >
                  <Text style={styles.inputSelectionText}>
                    {weight} {unitOfMeasurement === "metric" && "kg"}
                    {unitOfMeasurement === "imperial" && "lbs"}
                  </Text>
                </TouchableOpacity> */}
                <Modal
                  isVisible={weightModalVisible}
                  onBackdropPress={() => this.hideModal("weightModalVisible")}
                  animationIn="fadeIn"
                  animationInTiming={600}
                  animationOut="fadeOut"
                  animationOutTiming={600}
                >
                  <View style={globalStyle.modalContainer}>
                    <Picker
                      selectedValue={weight}
                      onValueChange={(value) =>
                        this.setState({ weight: value })
                      }
                    >
                      {unitOfMeasurement === "metric"
                        ? weightOptionsMetric.map((i) => (
                          <Picker.Item
                            key={i.value}
                            label={`${i.label} kg`}
                            value={i.value}
                          />
                        ))
                        : weightOptionsImperial.map((i) => (
                          <Picker.Item
                            key={i.value}
                            label={`${i.label} lbs`}
                            value={i.value}
                          />
                        ))}
                    </Picker>
                    <TouchableOpacity
                      title="DONE"
                      onPress={() => this.hideModal("weightModalVisible")}
                      style={globalStyle.modalButton}
                    >
                      <Text style={globalStyle.modalButtonText}>DONE</Text>
                    </TouchableOpacity>
                  </View>
                </Modal>
              </View>
              <View style={styles.inputFieldContainer}>
                <Text style={styles.inputFieldTitle}>Waist</Text>
                <TouchableOpacity
                  onPress={() => this.showModal("waistModalVisible")}
                  style={styles.inputButton}
                >
                  <Text style={styles.inputSelectionText}>
                    {waist} {unitOfMeasurement === "metric" && "cm"}
                    {unitOfMeasurement === "imperial" && "inches"}
                  </Text>
                </TouchableOpacity>
                <Modal
                  isVisible={waistModalVisible}
                  onBackdropPress={() => this.hideModal("waistModalVisible")}
                  animationIn="fadeIn"
                  animationInTiming={600}
                  animationOut="fadeOut"
                  animationOutTiming={600}
                >
                  <View style={globalStyle.modalContainer}>
                    <Picker
                      selectedValue={waist}
                      onValueChange={(value) => this.setState({ waist: value })}
                    >
                      {unitOfMeasurement === "metric"
                        ? waistOptionsMetric.map((i) => (
                          <Picker.Item
                            key={i.value}
                            label={`${i.label} cm`}
                            value={i.value}
                          />
                        ))
                        : waistOptionsImperial.map((i) => (
                          <Picker.Item
                            key={i.value}
                            label={`${i.label} inches`}
                            value={i.value}
                          />
                        ))}
                    </Picker>
                    <TouchableOpacity
                      title="DONE"
                      onPress={() => this.hideModal("waistModalVisible")}
                      style={globalStyle.modalButton}
                    >
                      <Text style={globalStyle.modalButtonText}>DONE</Text>
                    </TouchableOpacity>
                  </View>
                </Modal>
              </View>
              <View style={styles.inputFieldContainer}>
                <Text style={styles.inputFieldTitle}>Hip</Text>
                <TouchableOpacity
                  onPress={() => this.showModal("hipModalVisible")}
                  style={styles.inputButton}
                >
                  <Text style={styles.inputSelectionText}>
                    {hip} {unitOfMeasurement === "metric" && "cm"}
                    {unitOfMeasurement === "imperial" && "inches"}
                  </Text>
                </TouchableOpacity>
                <Modal
                  isVisible={hipModalVisible}
                  onBackdropPress={() => this.hideModal("hipModalVisible")}
                  animationIn="fadeIn"
                  animationInTiming={600}
                  animationOut="fadeOut"
                  animationOutTiming={600}
                >
                  <View style={globalStyle.modalContainer}>
                    <Picker
                      selectedValue={hip}
                      onValueChange={(value) => this.setState({ hip: value })}
                    >
                      {unitOfMeasurement === "metric"
                        ? hipOptionsMetric.map((i) => (
                          <Picker.Item
                            key={i.value}
                            label={`${i.label} cm`}
                            value={i.value}
                          />
                        ))
                        : hipOptionsImperial.map((i) => (
                          <Picker.Item
                            key={i.value}
                            label={`${i.label} inches`}
                            value={i.value}
                          />
                        ))}
                    </Picker>
                    <TouchableOpacity
                      title="DONE"
                      onPress={() => this.hideModal("hipModalVisible")}
                      style={globalStyle.modalButton}
                    >
                      <Text style={globalStyle.modalButtonText}>DONE</Text>
                    </TouchableOpacity>
                  </View>
                </Modal>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <CustomBtn
                // Title="NEXT"
                Title="Update"
                titleCapitalise={true}
                onPress={() => this.handleSubmit(weight, waist, hip)}
              />
              {/* <CustomButton
                title="NEXT"
                onPress={() => this.handleSubmit(weight, waist, hip)}
                primary
              /> */}
            </View>
            <Loader loading={loading} color={colors.themeColor.color} />
          </View>
        </KeyboardAvoidingView>

        <HelperModal
          helperModalVisible={helperModalVisible}
          hideHelperModal={this.hideHelperModal}
          headingText="Progress"
          bodyText="Adding a progress entry involves 3 steps - your measurements, a progress photo and a 1 minute burpee test."
          bodyText2="You will need to complete all three to successfully add an entry."
          bodyText3="If you can't do all of this right now, press skip in the top right corner to complete it later."
          color="coral"
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "space-between",
  },
  container: {
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
    justifyContent: "center",
  },
  inputFieldContainer: {
    marginBottom: 20,
  },
  inputFieldTitle: {
    marginLeft: 2,
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.charcoal.light,
    marginBottom: 5,
  },
  inputButton: {
    width: width - containerPadding * 2,
    padding: 15,
    paddingBottom: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.grey.light,
    borderRadius: 2,
  },
  inputSelectionText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.charcoal.dark,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 10,
    paddingHorizontal: containerPadding,
    width: "100%",
  },
});
