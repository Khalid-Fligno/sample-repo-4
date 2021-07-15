import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  InputBox,
  Dimensions,
  Platform,
  Picker,
  Alert,
} from "react-native";
import { number } from "prop-types";
import ChallengeStyle from "../chellengeStyle";
import globalStyle, { containerPadding } from "../../../styles/globalStyles";
import CustomBtn from "../../../components/Shared/CustomBtn";
import { ScrollView, TextInput, TouchableOpacity } from "react-native";
import fonts from "../../../styles/fonts";
import Video from "react-native-video";
import WorkoutTimer from "../../../components/Workouts/WorkoutTimer";
import colors from "../../../styles/colors";
import { timerSound } from "../../../../config/audio";
import InputBox2 from "../../../components/Challenges/InputBox2";
import Modal from "react-native-modal";
import { burpeeOptions, findFitnessLevel } from "../../../utils";
import PickerModal from "../../../components/Challenges/PickerModal";
import { db } from "../../../../config/firebase";
import AsyncStorage from "@react-native-community/async-storage";
import createUserChallengeData from "../../../components/Challenges/UserChallengeData";
import Loader from "../../../components/Shared/Loader";
import storeProgressInfo from "../../../components/Challenges/storeProgressInfo";
import * as FileSystem from "expo-file-system";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DotIndicator } from "react-native-indicators";
import moment from "moment";
import momentTimezone from "moment-timezone";
import CalendarModal from "../../../components/Shared/CalendarModal";
import { add } from "react-native-reanimated";
import { NavigationActions, StackActions } from "react-navigation";

const { width } = Dimensions.get("window");

export default class OnBoarding5 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      burpeeCount: 0,
      burpeeModalVisible: false,
      showInputBox: false,
      timerStart: false,
      totalDuration: 60,
      challengeData: {},
      btnDisabled: true,
      counterButtonDisable: false,
      error: "",
      loading: false,
      calendarModalVisible: false,
      addingToCalendar: false,
      chosenDate: new Date(),
    };
  }

  onFocusFunction = () => {
    const data = this.props.navigation.getParam("data", {});
    const burpeeCount = data["challengeData"]["onBoardingInfo"]["burpeeCount"];
    if (burpeeCount > 0) {
      this.setState({
        challengeData: data["challengeData"],
        btnDisabled: false,
        showInputBox: true,
        counterButtonDisable: false,
        burpeeCount,
      });
    } else {
      this.setState({
        challengeData: data["challengeData"],
        btnDisabled: false,
      });
    }

    console.log(data["challengeData"], "<><><><><");
  };

  // add a focus listener onDidMount
  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      this.onFocusFunction();
    });
  }

  // and don't forget to remove the listener
  componentWillUnmount() {
    this.focusListener.remove();
  }

  goToScreen(type) {
    let { challengeData, burpeeCount, timerStart, totalDuration } = this.state;
    if (timerStart && totalDuration == 60) {
      this.setState({
        error: "your timer is in progress! please do burpee test ",
      });
      return;
    }
    //TODO: find fitness level if cmplt burpee test otherwise it will one
    let fitnessLevel = 2;
    if (burpeeCount > 0 && burpeeCount <= 10) fitnessLevel = 1;
    else if (burpeeCount > 10 && burpeeCount <= 15) fitnessLevel = 2;
    else if (burpeeCount > 15) fitnessLevel = 3;

    //TODO: add burpee count and fitness level in on Boarding info
    const onBoardingInfo = Object.assign({}, challengeData.onBoardingInfo, {
      burpeeCount,
      fitnessLevel,
    });
    let updatedChallengedata = Object.assign({}, challengeData, {
      onBoardingInfo,
      status: "Active",
    });

    if(type === 'next'){
      this.props.navigation.navigate('ChallengeOnBoarding6',{
        data:{
               challengeData:updatedChallengedata
             },
             onboardingProcessComplete: this.props.navigation.getParam('onboardingProcessComplete') !== undefined ? this.props.navigation.getParam('onboardingProcessComplete') : false
      })
    }else if(type === 'submit'){
      this.setState({ challengeData: updatedChallengedata });
      // calendarModalVisible true calendar popup
      this.setState({ calendarModalVisible: true });
    } else {
      this.props.navigation.navigate("ChallengeOnBoarding4", {
        data: {
          challengeData: updatedChallengedata,
        },
      });
    }
     
  }

  addChallengeToCalendar = async (date) => {
    if (this.state.addingToCalendar) {
      return;
    }
    this.setState({ addingToCalendar: true });
    ////////////////////saving on calendar
    const updatedChallengedata = this.state.challengeData;
    const data = createUserChallengeData(updatedChallengedata, new Date(date));
    const progressData = {
      photoURL: updatedChallengedata.onBoardingInfo.beforePhotoUrl,
      weight: updatedChallengedata.onBoardingInfo.measurements.weight,
      waist: updatedChallengedata.onBoardingInfo.measurements.waist,
      hip: updatedChallengedata.onBoardingInfo.measurements.hip,
      burpeeCount: updatedChallengedata.onBoardingInfo.burpeeCount,
      fitnessLevel: updatedChallengedata.onBoardingInfo.fitnessLevel,
    };
    const stringDate = moment(date).format("YYYY-MM-DD").toString();
    const stringDate2 = moment(date).format("DD-MM-YY").toString();

    // console.log("date ",stringDate,updatedChallengedata.startDate, new Date(stringDate).getTime(),new Date(updatedChallengedata.startDate).getTime(),new Date(data.startDate).getTime() > new Date(stringDate).getTime())
    if (
      new Date(updatedChallengedata.startDate).getTime() <
      new Date(stringDate).getTime()
    ) {
      data.isSchedule = true;
      data.status = "InActive";
    }
    await storeProgressInfo(progressData);
    await this.saveOnBoardingInfo(data, stringDate2);
    ////////////end saving
  };

  addedToCalendarPopup(stringDate2) {
    const onPressAlert = () => {
      this.hideCalendarModal();
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
      `Your start date has been added to your challenge. Go to ${stringDate2} on the challenge dashboard to see what Day 1 looks like`,
      [{ text: "OK", onPress: onPressAlert, style: "cancel" }],
      { cancelable: false }
    );
    // }
  }

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

  async saveOnBoardingInfo(data, stringDate2) {
    this.setState({ loading: true });
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
      });
  }

  resetTimer = () => {
    this.props.navigation.replace("ChallengeOnBoarding5", {
      data: {
        challengeData: this.state.challengeData,
      },
    });
  };

  startTimer = async () => {
    if (Platform.OS === "ios") {
      await timerSound.setPositionAsync(0);
      await timerSound.playAsync();
    } else {
      try {
        await timerSound.playFromPositionAsync(0);
      } catch (ex) {}
    }
    this.setState({
      // videoPaused: true,
      timerStart: true,
      counterButtonDisable: true,
    });
  };

  handleFinish() {
    this.setState((prevState) => ({
      burpeeModalVisible: !prevState.burpeeModalVisible,
      showInputBox: true,
      timerStart: false,
      error: "",
    }));
  }
  toggleBurpeeModal = () => {
    this.setState((prevState) => ({
      burpeeModalVisible: !prevState.burpeeModalVisible,
    }));
  };
  render() {
    let {
      timerStart,
      totalDuration,
      challengeData,
      burpeeCount,
      burpeeModalVisible,
      showInputBox,
      btnDisabled,
      error,
      counterButtonDisable,
      loading,
      calendarModalVisible,
      addingToCalendar,
      chosenDate,
    } = this.state;
    console.log("addingToCalendar", addingToCalendar);
    if (!challengeData.onBoardingInfo) {
      this.onFocusFunction();
    }
    let fitnessLevel = "";
    if (burpeeCount > 0 && burpeeCount <= 10) fitnessLevel = "Beginner";
    else if (burpeeCount > 10 && burpeeCount <= 15)
      fitnessLevel = "Intermediate";
    else if (burpeeCount > 15) fitnessLevel = "Expert";

    return (
      <SafeAreaView style={ChallengeStyle.container}>
        <View style={[globalStyle.container]}>
          <CalendarModal
            isVisible={calendarModalVisible}
            onBackdropPress={this.hideCalendarModal}
            value={chosenDate}
            onChange={this.setDate}
            onPress={() => this.addChallengeToCalendar(chosenDate)}
            addingToCalendar={addingToCalendar}
            loading={loading}
          />
          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              flexDirection: "column",
              justifyContent: "space-between",
              paddingVertical: 15,
            }}
          >
            <View>
              <Text style={[ChallengeStyle.onBoardingTitle]}>Burpee Test</Text>
            </View>
            <View style={{ marginTop: 8 }}>
              <View style={{ justifyContent: "center" }}>
                <Text
                  style={{
                    marginVertical: 10,
                    fontFamily: fonts.standard,
                    fontSize: 15,
                  }}
                >
                  How many burpees can you do in 60 seconds?
                </Text>
              </View>
            </View>
            <View style={{ backgroundColor: colors.black }}>
              <Video
                source={{
                  uri: `${FileSystem.cacheDirectory}exercise-burpees.mp4`,
                }}
                resizeMode="contain"
                repeat
                muted
                style={{
                  width: width - wp("10%"),
                  height: width - hp("15%"),
                  marginTop: 20,
                }}
              />
              <WorkoutTimer
                totalDuration={totalDuration}
                start={timerStart}
                handleFinish={() => this.handleFinish()}
                customContainerStyle={{
                  width: width - containerPadding * 2,
                }}
              />
              <View
                style={[
                  ChallengeStyle.btnContainer,
                  {
                    paddingHorizontal: 10,
                    marginVertical: 10,
                    flexDirection: "row",
                  },
                ]}
              >
                <CustomBtn
                  Title="Reset"
                  customBtnStyle={{
                    borderRadius: 7,
                    padding: 15,
                    width: "49%",
                    backgroundColor: colors.charcoal.dark,
                  }}
                  onPress={() => this.resetTimer()}
                />
                <CustomBtn
                  Title="Start"
                  customBtnStyle={{
                    borderRadius: 7,
                    padding: 15,
                    width: "49%",
                    backgroundColor: colors.charcoal.dark,
                  }}
                  onPress={() => this.startTimer()}
                  disabled={counterButtonDisable}
                />
              </View>
            </View>
            {showInputBox && (
              <InputBox2
                onPress={this.toggleBurpeeModal}
                title="Total Burpee"
                extension={""}
                value={burpeeCount}
                extension={burpeeCount > 0 ? `(${fitnessLevel})` : ""}
                customContainerStyle={{ marginTop: 20 }}
              />
            )}

            <PickerModal
              dataMapList={burpeeOptions}
              onValueChange={(value) => {
                this.setState({ burpeeCount: value });
              }}
              isVisible={burpeeModalVisible}
              onBackdropPress={() => this.toggleBurpeeModal()}
              selectedValue={burpeeCount}
              onPress={this.toggleBurpeeModal}
              inputType="number"
            />

            <View style={[{ flex: 1, justifyContent: "flex-end" }]}>
              {<Text style={ChallengeStyle.errorText}>{error}</Text>}
              {burpeeCount <= 0 ? (
                <CustomBtn
                  Title="Skip"
                  customBtnStyle={{
                    borderRadius: 50,
                    padding: 15,
                    width: "100%",
                  }}
                  onPress={() => this.goToScreen("next")}
                  disabled={btnDisabled}
                  isRightIcon={true}
                  rightIconName="chevron-right"
                  rightIconColor={colors.black}
                  rightIconSize={13}
                  customBtnTitleStyle={{ marginRight: 10 }}
                />
              ) : (
                <CustomBtn
                  Title="Choose Start Date"
                  customBtnStyle={{
                    borderRadius: 50,
                    padding: 15,
                    width: "100%",
                  }}
                  onPress={() => this.goToScreen("submit")}
                  disabled={btnDisabled}
                  isRightIcon={true}
                  rightIconName="chevron-right"
                  rightIconColor={colors.white}
                  rightIconSize={13}
                  customBtnTitleStyle={{ marginRight: 10 }}
                />
              )}
              <CustomBtn
                Title="Back"
                customBtnStyle={{
                  borderRadius: 50,
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
            <Loader loading={loading} color={colors.themeColor.color} />
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
