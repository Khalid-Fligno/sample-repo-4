import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native";
import colors from "../../styles/colors";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Icon from "../Shared/Icon";
import AsyncStorage from "@react-native-community/async-storage";
import { db } from "../../config/firebase";
import Loader from "../Shared/Loader";
import { Alert } from "react-native";
import createUserChallengeData from "../../components/Challenges/UserChallengeData";
import CalendarModal from "../Shared/CalendarModal";
import { Platform } from "react-native";
import moment from "moment";
import { NavigationActions, StackActions } from "react-navigation";
import ScheduleChallengeSetting from "./ScheduleChallengeSetting";
import ActiveChallengeSetting from "./ActiveChallengeSetting";

const ChallengeSetting = (props) => {
  const {
    activeChallengeData,
    activeChallengeUserData,
    currentDay,
    ScheduleData,
    onToggle,
    navigation,
    completeCha,
    isSchedule,
  } = props;
  const [loading, setLoading] = useState(false);
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [chosenDate, setChosenDate] = useState(
    ScheduleData ? new Date(ScheduleData.startDate) : new Date()
  );

  const resetChallenge = async (data, callBack) => {
    setLoading(true);
    const uid = await AsyncStorage.getItem("uid");
    const userRef = db
      .collection("users")
      .doc(uid)
      .collection("challenges")
      .doc(data.id);
    Object.assign(activeChallengeData, {
      isSchedule: true,
      status: "InActive",
    });

    const newData = createUserChallengeData(
      activeChallengeData,
      new Date(),
      activeChallengeUserData,
      currentDay
    );
    userRef
      .set(newData, { merge: true })
      .then((res) => {
        setLoading(false);
        onToggle();
        setTimeout(() => callBack(newData), 100);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const challengeRestart = async (data, callBack) => {
    setLoading(true);
    const uid = await AsyncStorage.getItem("uid");
    const userRef = db
      .collection("users")
      .doc(uid)
      .collection("challenges")
      .doc(data.id);
    const newData = createUserChallengeData(
      activeChallengeData,
      new Date(),
      activeChallengeUserData,
      currentDay
    );
    userRef
      .set(newData, { merge: true })
      .then((res) => {
        setLoading(false);
        onToggle();
        // console.log("res",res)
        setTimeout(() => callBack(newData), 100);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const quitChallenge = async (data) => {
    const callBack = () => {
      navigation.navigate("ChallengeSubscription", { quit: true });
    };
    resetChallenge(data, callBack);
  };

  const restartChallenge = async (data) => {
    const callBack = (newData) => {
      navigation.navigate("ChallengeOnBoarding6", {
        data: {
          challengeData: newData,
        },
      });
    };
    challengeRestart(data, callBack);
  };

  const showCalendarModal = () => {
    setCalendarModalVisible(true);
  };

  const hideCalendarModal = () => {
    setCalendarModalVisible(false);
    setLoading(false);
  };

  const setDate = async (event, selectedDate) => {
    if (selectedDate && Platform.OS === "android") {
      hideCalendarModal();
      setLoading(true);
      resetChallengeDate(selectedDate);
    }
    if (selectedDate && Platform.OS === "ios") {
      const currentDate = selectedDate;
      setChosenDate(currentDate);
    }
  };

  const resetChallengeDate = (date) => {
    setShedular(date);
  };

  const setShedular = async (selectedDate) => {
    setLoading(false);
    Alert.alert(
      "",
      "Do you want to keep your Active Challenge Progress Data?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "YES",
          onPress: async () => {
            const TODAY = moment();
            setLoading(true);
            const uid = await AsyncStorage.getItem("uid");
            const userRef = db
              .collection("users")
              .doc(uid)
              .collection("challenges");
            const data = createUserChallengeData(
              activeChallengeData,
              selectedDate,
              activeChallengeUserData,
              currentDay
            );
            delete data.workouts;
            if (moment(selectedDate).isSame(TODAY, "d")) {
              Object.assign(data, { status: "Active" });
            } else {
              Object.assign(data, { isSchedule: false, status: "Active" });
            }
            userRef
              .doc(activeChallengeData.id)
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
                      onPress: () => {
                        if (completeCha) {
                          const resetAction = StackActions.reset({
                            index: 0,
                            actions: [
                              NavigationActions.navigate({
                                routeName: "Tabs",
                                action: NavigationActions.navigate({
                                  routeName: "ChallengeSubscription",
                                  params: { completedChallenge: true },
                                }),
                              }),
                            ],
                          });
                          navigation.dispatch(resetAction);
                        } else {
                          const resetAction = StackActions.reset({
                            index: 0,
                            actions: [
                              NavigationActions.navigate({
                                routeName: "Tabs",
                                action: NavigationActions.navigate({
                                  routeName: "CalendarHome",
                                }),
                              }),
                            ],
                          });
                          navigation.dispatch(resetAction);
                        }
                      },
                    },
                  ],
                  { cancelable: false }
                );
              })
              .catch((err) => {
                console.log(err);
              });
          },
        },
        {
          text: "NO",
          onPress: async () => {
            const TODAY = moment();
            setLoading(true);
            const uid = await AsyncStorage.getItem("uid");
            const userRef = db
              .collection("users")
              .doc(uid)
              .collection("challenges");
            const data = createUserChallengeData(
              activeChallengeData,
              selectedDate,
              activeChallengeUserData,
              currentDay
            );
            if (moment(selectedDate).isSame(TODAY, "d")) {
              Object.assign(data, { status: "Active" });
            } else {
              // Object.assign(data, { isSchedule: true, status: "InActive" });
              Object.assign(data, { isSchedule: false, status: "Active" });
            }
            userRef
              .doc(activeChallengeData.id)
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
                      onPress: () => {
                        if (completeCha) {
                          const resetAction = StackActions.reset({
                            index: 0,
                            actions: [
                              NavigationActions.navigate({
                                routeName: "Tabs",
                                action: NavigationActions.navigate({
                                  routeName: "ChallengeSubscription",
                                  params: { completedChallenge: true },
                                }),
                              }),
                            ],
                          });
                          navigation.dispatch(resetAction);
                        } else {
                          const resetAction = StackActions.reset({
                            index: 0,
                            actions: [
                              NavigationActions.navigate({
                                routeName: "Tabs",
                                action: NavigationActions.navigate({
                                  routeName: "CalendarHome",
                                }),
                              }),
                            ],
                          });
                          navigation.dispatch(resetAction);
                        }
                      },
                    },
                  ],
                  { cancelable: false }
                );
              })
              .catch((err) => {
                console.log(err);
              });
          },
        },
      ],
      { cancelable: true }
    );
  };
  return (
    <SafeAreaView
      style={{
        backgroundColor: "white",
        height: hp("100%"),
        width: wp("70%"),
      }}
    >
      <TouchableOpacity
        style={{ alignSelf: "flex-end", marginHorizontal: wp("4%") }}
        onPress={onToggle}
      >
        <Icon name="cross" size={hp("2.5%")} color={colors.themeColor.color} />
      </TouchableOpacity>
      {!isSchedule && (
        <ActiveChallengeSetting
          quitChallenge={quitChallenge}
          restartChallenge={restartChallenge}
          showCalendarModal={showCalendarModal}
          activeChallengeUserData={activeChallengeUserData}
        />
      )}
      {isSchedule && (
        <ScheduleChallengeSetting
          quitChallenge={quitChallenge}
          restartChallenge={restartChallenge}
          showCalendarModal={showCalendarModal}
          activeChallengeUserData={activeChallengeUserData}
        />
      )}
      <Loader loading={loading} color={colors.red.standard} />

      <CalendarModal
        isVisible={calendarModalVisible}
        onBackdropPress={hideCalendarModal}
        value={chosenDate}
        onChange={setDate}
        onPress={() => resetChallengeDate(chosenDate)}
        addingToCalendar={loading}
        loading={loading}
      />
    </SafeAreaView>
  );
};

export default ChallengeSetting;
