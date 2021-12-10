import React, { Component } from "react";
import { View, Text, ScrollView, FlatList, Alert, Linking } from "react-native";
import { ListItem, Button } from "react-native-elements";
import colors from "../../styles/colors";
import globalStyle, { containerPadding } from "../../styles/globalStyles";
import { db } from "../../../config/firebase";
import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment";
import momentTimezone from "moment-timezone";
import { any } from "prop-types";
import Loader from "../../components/Shared/Loader";
import ChallengeStyle from "./chellengeStyle";
import createUserChallengeData from "../../components/Challenges/UserChallengeData";
import ChallengeCard from "../../components/Challenges/ChallengeCard";
import * as Haptics from "expo-haptics";
import {
  getCurrentPhase,
  getCurrentChallengeDay,
  getTodayRecommendedWorkout,
  isActiveChallenge,
  short_months,
  full_months,
} from "../../utils/challenges";
import ChallengeBlogCard from "../../components/Home/ChallengeBlogCard";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import CalendarModal from "../../components/Shared/CalendarModal";

class ChallengeSubscriptionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: any,
      challengesList: [],
      restartChallengesList: [],
      userChallengesList: [],
      loading: false,
      activeChallengeUserData: undefined,
      activeChallengeData: undefined,
      blogs: undefined,
      totalChallengeCount: 0,
      calendarModalVisible: false,
      chosenDate: new Date(),
      selectedChallengeIndex: null,
      addingToCalendar: false,
    };
  }

  onFocusFunction() {
    isActiveChallenge().then((res) => {
      if (res) {
        // if(this.state.blogs === undefined){
        //   this.setState({loading:true})
        //   this.fetchActiveChallengeData(res);
        // }
        this.props.navigation.navigate("Calendar");
      }
    });
  }

  componentDidMount = () => {
    this.fetchProfile();
    this.focusListener = this.props.navigation.addListener("willFocus", () => {
      this.onFocusFunction();
    });
  };

  componentWillUnmount = () => {
    if (this.unsubscribeUserChallenges) this.unsubscribeUserChallenges();
    if (this.unsubscribeUserData) this.unsubscribeUserData();
    if (this.unsubscribeChallenges) this.unsubscribeChallenges();
    this.focusListener.remove();
  };

  fetchProfile = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem("uid");
    try {
      this.unsubscribeUserData = db
        .collection("users")
        .doc(uid)
        .onSnapshot(async (doc) => {
          this.setState({ userData: doc.data() });
        });

      this.unsubscribeUserChallenges = db
        .collection("users")
        .doc(uid)
        .collection("challenges")
        .onSnapshot(async (querySnapshot) => {
          const userChallengesList = [];
          await querySnapshot.forEach(async (doc) => {
            await userChallengesList.push(await doc.data());
          });
          this.setState({ userChallengesList });
          this.fetchChallenges();
        });
    } catch (err) {
      Alert.alert("Something went wrong");
    }
  };

  fetchChallenges = async () => {
    let { userChallengesList } = this.state;
    this.unsubscribeChallenges = await db
      .collection("challenges")
      .onSnapshot(async (querySnapshot) => {
        const challengesList = [];
        const restartChallengesList = [];
        await querySnapshot.forEach(async (doc) => {
          const check = userChallengesList.findIndex((challenge) => {
            if (doc.id === challenge.id) {
              restartChallengesList.push(doc.data());
              this.setState({ restartChallengesList });
            }
            //TODO:Hide challenge if it present in users challenge list
            return doc.id === challenge.id;
          });
          if (check === -1) await challengesList.push(await doc.data());
        });
        this.setState({ challengesList, loading: false });
      });
  };

  addChallengeToUser(index) {
    let { userData, challengesList } = this.state;
    const userRef = db
      .collection("users")
      .doc(userData.id)
      .collection("challenges");
    // console.log("challengesList[index]",challengesList);
    const data = createUserChallengeData(challengesList[index], new Date());
    // console.log( data.id)
    userRef
      .doc(data.id)
      .set(data)
      .then((res) => {
        this.props.navigation.navigate("ChallengeOnBoarding1", {
          data: {
            challengeData: data,
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  restartChallengeToUser(index) {
    let { userData, restartChallengesList } = this.state;
    const userRef = db
      .collection("users")
      .doc(userData.id)
      .collection("challenges");
    // console.log("challengesList[index]",restartChallengesList);
    const data = createUserChallengeData(
      restartChallengesList[index],
      new Date()
    );
    // console.log( "???",restartChallengesList.length,index)
    userRef
      .doc(data.id)
      .set(data)
      .then((res) => {
        this.setState({ blogs: undefined, loading: false });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  openLink = (url) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(url);
  };

  renderItem = ({ item, index }) => {
    const TODAY = moment();
    if (moment(item.availabilityDate).isSameOrBefore(TODAY))
      return (
        <ChallengeCard
          outline={false}
          imageUrl={item.imageUrl}
          numberOfDays={item.numberOfDays}
          numberOfWeeks={item.numberOfWeeks}
          title={item.displayName}
          subTitle={item.subTitle}
          key={index}
          btnTitle="Buy"
          // onPress={()=>this.addChallengeToUser(index)}
          onPress={() => item.shopifyUrl && this.openLink(item.shopifyUrl)}
          disabled={false}
          challengeData={item}
        />
      );
  };
  renderItem1 = ({ item, index }) => {
    let btnTitle = "";
    let btnDisabled = false;
    let isRestartBtn = false;
    const findIndex = this.state.userChallengesList.findIndex(
      (res) => res.status === "Active"
    );
    if (findIndex === -1 && item.status === "Completed") {
      btnTitle = "Restart";
      isRestartBtn = true;
    } else if (findIndex !== -1 && item.status === "Completed") {
      btnTitle = "Completed";
      btnDisabled = true;
      isRestartBtn = false;
    } else if (item.status === "Active") {
      btnTitle = "Active";
      btnDisabled = true;
      isRestartBtn = true;
    } else if (findIndex !== -1 && item.status === "InActive") {
      btnTitle = "Start";
      btnDisabled = true;
      isRestartBtn = false;
    } else if (
      findIndex === -1 &&
      item.status === "InActive" &&
      item.isSchedule
    ) {
      const startDate = new Date(item.startDate);
      btnTitle =
        "from " + startDate.getUTCDate() + " " + short_months(startDate);
      btnDisabled = true;
      isRestartBtn = true;
    } else if (findIndex === -1 && item.status === "InActive") {
      btnTitle = "Start";
      btnDisabled = false;
      isRestartBtn = false;
    }

    return (
      <ChallengeCard
        outline={false}
        imageUrl={item.imageUrl}
        title={item.displayName}
        numberOfDays={item.numberOfDays}
        numberOfWeeks={item.numberOfWeeks}
        key={index}
        btnTitle={btnTitle}
        startDate={item.isSchedule ? item.startDate : null}
        onPress={() => this.onBoarding(item, btnTitle, btnDisabled)}
        restartButton={isRestartBtn}
        onPressRestart={() => {
          Alert.alert(
            "",
            "Are you sure you want to reset your challenge?",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Reset start date",
                onPress: () =>
                  this.setState({
                    calendarModalVisible: true,
                    selectedChallengeIndex: index,
                  }),
              },
              {
                text: "Reset challenge",
                onPress: () => this.restartChallengeToUser(index),
              },
            ],
            { cancelable: false }
          );
        }}
      />
    );
  };

  onBoarding(challengeData, btnTitle, btnDisabled) {
    if (btnDisabled) {
      if (btnTitle === "Active") this.props.navigation.navigate("Calendar");
      else if (challengeData.isSchedule) {
        const startDate = new Date(challengeData.startDate);
        Alert.alert(
          "Your challenge will start on \n " +
            startDate.getUTCDate() +
            " " +
            full_months(startDate) +
            " " +
            startDate.getUTCFullYear()
        );
      } else {
        Alert.alert(
          "Sorry,you cant start new challenge",
          "you have already one active challenge"
        );
      }
    } else {
      this.props.navigation.navigate("ChallengeOnBoardingReverse", {
        data: {
          challengeData,
        },
        challengeOnboard: true,
      });
    }
  }

  getCurrentPhaseInfo() {
    const { activeChallengeUserData, activeChallengeData } = this.state;
    if (activeChallengeUserData && activeChallengeData) {
      //TODO :getCurrent phase data
      this.stringDate = new Date().toISOString();
      this.phase = getCurrentPhase(
        activeChallengeUserData.phases,
        this.stringDate
      );

      //TODO :fetch the current phase data from Challenges collection
      this.phaseData = activeChallengeData.phases.filter(
        (res) => res.name === this.phase.name
      )[0];

      //TODO calculate current challenge day
      this.currentChallengeDay = getCurrentChallengeDay(
        activeChallengeUserData.startDate,
        this.stringDate
      );
      // console.log("?.",this.currentChallengeDay)
      this.fetchBlogs(activeChallengeUserData.tag, this.currentChallengeDay);
      //TODO get recommended workout here
      this.todayRcWorkout = getTodayRecommendedWorkout(
        activeChallengeData.workouts,
        activeChallengeUserData,
        this.stringDate
      );
    } else {
      Alert.alert("Something went wrong please try again");
    }
  }

  fetchBlogs = async (tag, currentDay) => {
    // console.log(">>>>>>>",tag,currentDay)
    const snapshot = await db
      .collection("blogs")
      .where("tags", "array-contains", tag)
      .get();
    let blogs = [];
    // const cDay = currentDay === 1?2:currentDay
    const cDay = currentDay === 1 ? 2 : currentDay;
    snapshot.forEach((doc) => {
      // console.log(doc.data())
      if (doc.data().startDay <= cDay && doc.data().endDay >= cDay)
        blogs.unshift(doc.data());
    });
    this.setState({ blogs, loading: false });
  };

  fetchActiveChallengeData = async (activeChallengeUserData) => {
    try {
      this.unsubscribeFACD = await db
        .collection("challenges")
        .doc(activeChallengeUserData.id)
        .onSnapshot(async (doc) => {
          if (doc.exists) {
            this.setState({
              activeChallengeUserData,
              activeChallengeData: doc.data(),
              // loading:false
            });
            this.getCurrentPhaseInfo();
          }
        });
    } catch (err) {
      this.setState({ loading: false });
      console.log(err);
      Alert.alert("Fetch active challenge data error!");
    }
  };

  hideCalendarModal = (status) => {
    this.setState({
      calendarModalVisible: false,
      blogs: undefined,
      loading: false,
      addingToCalendar: false,
    });
    // console.log(status)
    if (status === "Active") this.props.navigation.navigate("Calendar");
  };

  setDate = async (event, selectedDate) => {
    // console.log("setDate call")
    if (selectedDate && Platform.OS === "android") {
      this.setState({ loading: true });
      this.setShedular(selectedDate);
    }
    if (selectedDate && Platform.OS === "ios") {
      const currentDate = selectedDate;
      this.setState({ chosenDate: currentDate });
    }
  };

  setShedular(selectedDate) {
    const TODAY = moment();
    this.setState({ addingToCalendar: true });
    let { userData, userChallengesList, selectedChallengeIndex } = this.state;
    const userRef = db
      .collection("users")
      .doc(userData.id)
      .collection("challenges");
    const ChallengeData = userChallengesList[selectedChallengeIndex];
    const data = createUserChallengeData(ChallengeData, new Date(selectedDate));
    // console.log(data.startDate , selectedDate);
    if (moment(selectedDate).isSame(TODAY, "d")) {
      Object.assign(data, { isSchedule: true, status: "Active" });
    } else {
      Object.assign(data, { isSchedule: true, status: "InActive" });
    }
    userRef
      .doc(ChallengeData.id)
      .set(data, { merge: true })
      .then((res) => {
        Alert.alert(
          "",
          `Your start date has been added to your challenge. Go to ${moment(
            selectedDate
          ).format(
            "DD-MM-YY"
          )} on the challenge dashboard to see what Day 1 looks like`,
          [
            {
              text: "OK",
              onPress: () => this.hideCalendarModal(data.status),
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const {
      challengesList,
      userChallengesList,
      loading,
      blogs,
      chosenDate,
      calendarModalVisible,
      addingToCalendar,
    } = this.state;
    // console.log("Challenge List",challengesList)
    return (
      <ScrollView
        contentContainerStyle={{
          // flex:1,
          paddingHorizontal: containerPadding,
          paddingBottom: 20,
        }}
        // bounces={false}
      >
        {!loading && (
          <View>
            {userChallengesList.map((item, index) =>
              this.renderItem1({ item, index })
            )}

            {challengesList.length > 0 && (
              <Text style={ChallengeStyle.Title}>Take a new challenge</Text>
            )}
            {challengesList.map((item, index) =>
              this.renderItem({ item, index })
            )}
          </View>
        )}
        {/* {
            blogs &&  blogs.length > 0 && <Text style={[ChallengeStyle.Title,{marginBottom:hp('1%')}]}>Blogs</Text>
        }
        {
          blogs && blogs.length > 0&&
          blogs.map((res,index)=>
              <ChallengeBlogCard
              key={index}
              data={res}
              onPress={() => this.openLink(res.urlLink)}
              index = {index}
            />
          )
        } */}
        <Loader loading={loading} color={colors.themeColor.color} />
        <CalendarModal
          isVisible={calendarModalVisible}
          onBackdropPress={this.hideCalendarModal}
          value={chosenDate}
          onChange={this.setDate}
          onPress={() => this.setShedular(chosenDate)}
          addingToCalendar={addingToCalendar}
          loading={loading}
        />
      </ScrollView>
    );
  }
}

export default ChallengeSubscriptionScreen;
