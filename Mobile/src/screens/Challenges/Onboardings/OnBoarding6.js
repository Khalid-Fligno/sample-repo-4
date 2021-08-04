import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { number } from "prop-types";
import ChallengeStyle from "../chellengeStyle";
import globalStyle from "../../../styles/globalStyles";
import CustomBtn from "../../../components/Shared/CustomBtn";
import fonts from "../../../styles/fonts";
import createUserChallengeData from "../../../components/Challenges/UserChallengeData";
import colors from "../../../styles/colors";
import Loader from "../../../components/Shared/Loader";
import { db } from "../../../../config/firebase";
import AsyncStorage from "@react-native-community/async-storage";
import FitnessLevelCard from "../../../components/Onboarding/FitnessLevelCard";
import BigHeadingWithBackButton from "../../../components/Shared/BigHeadingWithBackButton";
import storeProgressInfo from "../../../components/Challenges/storeProgressInfo";
import Modal from "react-native-modal";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DotIndicator } from "react-native-indicators";
import moment from "moment";
import momentTimezone from "moment-timezone";
import CalendarModal from "../../../components/Shared/CalendarModal";
import { NavigationActions, StackActions } from "react-navigation";
const levelOfFiness = ["Begineer", "Intermediate", "Advanced"];
export default class OnBoarding6 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fitnessLevel: 2,
      loading: false,
      challengeData: null,
      btnDisabled: true,
      loading: false,
      calendarModalVisible: false,
      addingToCalendar: false,
      chosenDate: new Date(),
    };
  }

  fetchFitnessLevel = async () => {
    const uid = await AsyncStorage.getItem("uid");
    db.collection("users")
      .doc(uid)
      .get()
      .then((snapshot) => {
        const fitnessLevel = snapshot.data().fitnessLevel ?? 2;
        this.setState({
          fitnessLevel: fitnessLevel,
        });
      });
  };

  onFocusFunction = () => {
    const data = this.props.navigation.getParam("data", {});
    const fitnessLevel =
      data["challengeData"]["onBoardingInfo"]["fitnessLevel"];
    this.setState({
      challengeData: data["challengeData"],
      btnDisabled: false,
      fitnessLevel: fitnessLevel ? fitnessLevel : 2,
    });
  };

  // add a focus listener onDidMount
  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      this.onFocusFunction();
      this.fetchFitnessLevel();
    });
  }

  // and don't forget to remove the listener
  componentWillUnmount() {
    this.focusListener.remove();
  }

  goToScreen(type) {
    let { challengeData, fitnessLevel } = this.state;
    let burpeeCount = 0;
    if (fitnessLevel === 1) burpeeCount = 10;
    else if (fitnessLevel === 2) burpeeCount = 15;
    else if (fitnessLevel === 3) burpeeCount = 20;

    const onBoardingInfo = Object.assign({}, challengeData.onBoardingInfo, {
      fitnessLevel,
      burpeeCount,
    });
    let updatedChallengedata = Object.assign({}, challengeData, {
      onBoardingInfo,
      status: "Active",
    });
    if (type === "next") {
      if (this.props.navigation.getParam("challengeOnboard", {})) {
        // this.props.navigation.navigate("ChallengeOnBoarding1", {
        //   data: {
        //     challengeData: this.props.navigation.getParam("data", {})[
        //       "challengeData"
        //     ],
        //   },
        //   onboardingProcessComplete: false,
        //   challengeOnboard: true,
        // });
        this.props.navigation.navigate("ChallengeOnBoarding1", {
          data: {
            challengeData: updatedChallengedata,
          },
          onboardingProcessComplete: false,
          challengeOnboard: true,
        });
      } else {
        this.setState({ challengeData: updatedChallengedata });
        // calendarModalVisible true calendar popup
        // this.setState({ calendarModalVisible: true });
        this.addChallengeToCalendar(moment().set("date", 26));
      }
    } else {
      if (this.props.navigation.getParam("challengeOnboard", {})) {
        this.props.navigation.navigate("ChallengeSubscription", {});
      } else {
        this.props.navigation.navigate("ChallengeOnBoarding5", {
          data: { challengeData: updatedChallengedata },
          onboardingProcessComplete:
            this.props.navigation.getParam("onboardingProcessComplete") !==
            undefined
              ? this.props.navigation.getParam("onboardingProcessComplete")
              : false,
        });
      }
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
      height: updatedChallengedata.onBoardingInfo.measurements.height,
      goalWeight: updatedChallengedata.onBoardingInfo.measurements.goalWeight,
      weight: updatedChallengedata.onBoardingInfo.measurements.weight,
      waist: updatedChallengedata.onBoardingInfo.measurements.waist,
      hip: updatedChallengedata.onBoardingInfo.measurements.hip,
      burpeeCount: updatedChallengedata.onBoardingInfo.burpeeCount,
      fitnessLevel: updatedChallengedata.onBoardingInfo.fitnessLevel,
    };
    const stringDate = moment(date).format("YYYY-MM-DD").toString();
    const stringDate2 = moment(date).format("DD-MM-YY").toString();

    if (
      new Date(updatedChallengedata.startDate).getTime() <
      new Date(stringDate).getTime()
    ) {
      data.isSchedule = true;
      data.status = "InActive";
    }
    storeProgressInfo(progressData);
    this.saveOnBoardingInfo(data, stringDate2);

    if (
      new Date(updatedChallengedata.startDate).getTime() <
      new Date(stringDate).getTime()
    ) {
      data.isSchedule = true;
      data.status = "InActive";
    }
    storeProgressInfo(progressData);
    this.saveOnBoardingInfo(data, stringDate2);
  };

  async saveOnBoardingInfo(data, stringDate2) {
    // this.setState({ loading: true });
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
      `Your start date has been added to your challenge. Go to ${stringDate2} on the challenge dashboard to see what Day 1 looks like.`,
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

  render() {
    let {
      fitnessLevel,
      loading,
      challengeData,
      btnDisabled,
      calendarModalVisible,
      addingToCalendar,
      chosenDate,
    } = this.state;

    // console.log(challengeData)
    return (
      <SafeAreaView style={ChallengeStyle.container}>
        <View style={globalStyle.container}>
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
            contentContainerStyle={{
              flexGrow: 1,
              flexDirection: "column",
              justifyContent: "space-between",
              paddingVertical: 15,
            }}
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            <BigHeadingWithBackButton
              bigTitleText="Intensity"
              isBackButton={false}
              isBigTitle={true}
              customContainerStyle={{ marginTop: 0, marginBottom: 0 }}
            />
            <Text style={{ fontFamily: fonts.standard, fontSize: 15 }}>
              {/* Select your intensity level below. */}
              How often do you currently train.
            </Text>
            {/* <Text style={{ fontFamily: fonts.standard, fontSize: 15 }}>
                Beginner: train once a week,
            </Text>
            <Text style={{ fontFamily: fonts.standard, fontSize: 15 }}>
                Intermediate: train 2 to 3 times a week,
            </Text>
            <Text style={{ fontFamily: fonts.standard, fontSize: 15 }}>
                Expert: train 4+ times a week
            </Text> */}

            <FitnessLevelCard
              source={require("../../../../assets/images/OnBoardindImg/FL_1.png")}
              onPress={() => this.setState({ fitnessLevel: 1 })}
              title="0-2 times a week"
              // title="Beginner"
              helpText="Train once a week"
              showTick={fitnessLevel === 1}
              isCardColored={true}
              cardColor={colors.coolIce}
            />
            <FitnessLevelCard
              source={require("../../../../assets/images/OnBoardindImg/FL_2.png")}
              onPress={() => this.setState({ fitnessLevel: 2 })}
              title="2-3 times a week"
              // title="Intermediate"
              helpText="Train 2 to 3 times a week"
              showTick={fitnessLevel === 2}
              isCardColored={true}
              cardColor={colors.coolIce}
            />
            <FitnessLevelCard
              source={require("../../../../assets/images/OnBoardindImg/FL_3.png")}
              onPress={() => this.setState({ fitnessLevel: 3 })}
              title="4+ times a week"
              // title="Expert"
              helpText="Train 4+ times a week"
              showTick={fitnessLevel === 3}
              isCardColored={true}
              cardColor={colors.coolIce}
            />
            <View
              style={[{ flex: 0.5, justifyContent: "flex-end", marginTop: 20 }]}
            >
              <CustomBtn
                // Title="Choose Start Date"
                Title={
                  this.props.navigation.getParam("challengeOnboard", {})
                    ? "Next"
                    : "Start Challenge"
                }
                customBtnStyle={{
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
                leftIconSize={13}
              />
            </View>
          </ScrollView>
          <Loader loading={loading} color={colors.themeColor.color} />
        </View>
      </SafeAreaView>
    );
  }
}
