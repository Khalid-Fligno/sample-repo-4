import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native"
import FastImage from "react-native-fast-image";
import fonts from '../../../../styles/fonts';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import ProgressBar from "../../../../components/Progress/ProgressBar";
import AsyncStorage from "@react-native-community/async-storage";
import { db } from "../../../../../config/firebase";
import { diff } from "../../../../utils/index";
import moment from "moment";
import Icon from "../../../../components/Shared/Icon";
import colors from '../../../../styles/colors';
import Loader from '../../../../components/Shared/Loader';
import Modal from "react-native-modal";
import CustomBtn from '../../../../components/Shared/CustomBtn';

export const YouScreen = ({ navigation }) => {

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(undefined);
  const [initialProgressInfo, setInitialProgressInfo] = useState(undefined);
  const [currentProgressInfo, setCurrentProgressInfo] = useState(undefined);
  const [unitsOfMeasurement, setUnitsOfMeasurement] = useState(undefined);
  const [activeChallengeData, setActiveChallengeData] = useState(undefined);
  const [modal, setModal] = useState(false);
  const [totalI, setTotalI] = useState(0);
  const [totalS, setTotalS] = useState(0);
  const [totalC, setTotalC] = useState(0);
  const [countI, setCountI] = useState(0);
  const [countS, setCountS] = useState(0);
  const [countC, setCountC] = useState(0);

  const weightDifference =
    initialProgressInfo &&
    currentProgressInfo &&
    diff(initialProgressInfo.weight, currentProgressInfo.weight);
  const weightToDecimal =
    Number(weightDifference).toFixed(2);
  const hipDifference =
    initialProgressInfo &&
    currentProgressInfo &&
    diff(initialProgressInfo.hip, currentProgressInfo.hip);
  const waistDifference =
    initialProgressInfo &&
    currentProgressInfo &&
    diff(initialProgressInfo.waist, currentProgressInfo.waist);
  const burpeesDifference =
    initialProgressInfo &&
    currentProgressInfo &&
    diff(initialProgressInfo.burpeeCount, currentProgressInfo.burpeeCount);
  const { width } = Dimensions.get("window");

  const fetchProgressInfo = async () => {
    setLoading(true)
    const uid = await AsyncStorage.getItem("uid");
    const userDataFromFirebase = await await db
      .collection("users")
      .doc(uid)
      .get();

    const userData = userDataFromFirebase.data()

    if (userData) {
      const currentProgressInfo = userData.currentProgressInfo ?
        userData.currentProgressInfo :
        null

      setProfile(userData)
      setInitialProgressInfo(userData.initialProgressInfo)
      setCurrentProgressInfo(currentProgressInfo)
      setUnitsOfMeasurement(userData.unitsOfMeasurement)
      setLoading(false)

      if (
        userData.weeklyTargets.currentWeekStartDate !==
        moment().startOf("week").format("YYYY-MM-DD")
      ) {
        const data = {
          weeklyTargets: {
            currentWeekStartDate: moment().startOf("week").format("YYYY-MM-DD"),
          },
        };

        await db
          .collection("users")
          .doc(userData.id)
          .set(data, { merge: true })
          .catch((err) => console.log(err));
      }
    }
  };

  const fetchActiveChallengeUserData = async () => {
    try {
      setLoading(true)
      const uid = await AsyncStorage.getItem("uid");
      const userActiveChallengeRef = await db
        .collection("users")
        .doc(uid)
        .collection("challenges")
        .where("status", "==", "Active")
        .get()

      userActiveChallengeRef.docs.forEach(userActiveChallenge => {
        if (userActiveChallenge) {
          fetchActiveChallengeData(userActiveChallenge.data())
        } else {
          setTotalS(0)
          setTotalI(0)
          setTotalC(0)
          setCountC(0)
          setCountI(0)
          setCountS(0)
        }
      })
    } catch (err) {
      setLoading(false)
      console.log("Fetch active challenge user data error!", err);
    }
  };

  const fetchActiveChallengeData = async (activeChallengeUserData) => {
    try {
      const activeChallengeDataFromFirebase = await db
        .collection("challenges")
        .doc(activeChallengeUserData.id)
        .get();

      const activeChallengeData = activeChallengeDataFromFirebase.data()

      if (activeChallengeData) {
        const totalIntervalCompleted =
          activeChallengeUserData.workouts
            .filter(res => res.target === "interval");
        const totalCircuitCompleted =
          activeChallengeUserData.workouts
            .filter(res => res.target === "circuit");
        const totalStrengthCompleted =
          activeChallengeUserData.workouts
            .filter(res => res.target === "strength");

        setTotalS(5)
        setTotalI(5)
        setTotalC(5)
        setCountC(totalCircuitCompleted.length)
        setCountI(totalIntervalCompleted.length)
        setCountS(totalStrengthCompleted.length)
        setActiveChallengeData(activeChallengeData)
        setLoading(false)
      }
    } catch (err) {
      setLoading(false)
      console.log("Fetch active challenge data error: ", err);
    }
  };

  const updateProgressBtn = (
    initialProgressInfo,
    currentProgressInfo
  ) => {

    navigation.navigate("ProgressEdit", {
      isInitial: false,
      initialProgressInfo: initialProgressInfo,
      currentProgressInfo: currentProgressInfo
    })
  }

  const editBeforeBtn = (
    initialProgressInfo,
    currentProgressInfo
  ) => (

    navigation.navigate("ProgressEdit", {
      isInitial: true,
      initialProgressInfo: initialProgressInfo,
      currentProgressInfo: currentProgressInfo
    })
  );

  const toggleModal = () => {
    setModal(!modal)
  };

  useEffect(() => {
    fetchProgressInfo();
    fetchActiveChallengeUserData();
  }, [])

  return (
    <ScrollView>
      <View style={{
        flexDirection: "column",
        paddingHorizontal: 20,
        paddingTop: 10,
      }}
      >
        <View
          style={{
            backgroundColor: "#F0F0F0",
            paddingVertical: 30,
            borderRadius: 10,
            alignItems: "center"
          }}
        >
          <Text style={{ fontSize: 40 }}>9</Text>
          <Text style={{
            fontFamily: fonts.StyreneAWebRegular
          }}>
            Total workouts complete 🎉
          </Text>
        </View>
        <View
          style={{
            paddingTop: 10
          }}
        >
          <View style={{ paddingVertical: 10 }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: fonts.StyreneAWebRegular,
                paddingVertical: 5
              }}
            >
              Body Measurements
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.StyreneAWebRegular,
                }}
              >
                Updated 2 days ago
              </Text>
              <TouchableOpacity onPress={() => setModal(true)}>
                <Text
                  style={{
                    fontFamily: fonts.StyreneAWebRegular,
                    textDecorationLine: 'underline'
                  }}
                >
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              paddingTop: 10
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <View
                style={{
                  backgroundColor: "#F0F0F0",
                  width: width / 2.3,
                  height: hp("14%"),
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >
                  <View>
                    <Text style={{
                      fontFamily: fonts.StyreneAWebRegular,
                      fontSize: 13,
                      textAlign: "center"
                    }}>
                      Weight
                    </Text>
                    <Text style={{ fontSize: 25 }}>
                      {initialProgressInfo ? initialProgressInfo.weight : "-"}{" "}
                      {initialProgressInfo && unitsOfMeasurement === "metric" && "kg"}
                      {initialProgressInfo && unitsOfMeasurement === "imperial" && "lbs"}
                    </Text>
                  </View>
                  <Icon
                    name="chevron-down"
                    color="green"
                    size={17}
                    style={{ paddingLeft: 10 }}
                  />
                </View>
              </View>
              <View
                style={{
                  backgroundColor: "#F0F0F0",
                  width: width / 2.3,
                  height: hp("14%"),
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >
                  <View>
                    <Text style={{
                      fontFamily: fonts.StyreneAWebRegular,
                      fontSize: 13,
                      textAlign: "center"
                    }}>
                      Waist
                    </Text>
                    <Text style={{ fontSize: 25 }}>
                      {initialProgressInfo ? initialProgressInfo.waist : "-"}{" "}
                      {initialProgressInfo && unitsOfMeasurement === "metric" && "cm"}
                      {initialProgressInfo &&
                        unitsOfMeasurement === "imperial" &&
                        "inches"}
                    </Text>
                  </View>
                  <Icon
                    name="chevron-up"
                    color="red"
                    size={17}
                    style={{ paddingLeft: 10 }}
                  />
                </View>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                paddingTop: 10,
              }}
            >
              <View
                style={{
                  backgroundColor: "#F0F0F0",
                  width: width / 2.3,
                  height: hp("14%"),
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >
                  <View>
                    <Text style={{
                      fontFamily: fonts.StyreneAWebRegular,
                      fontSize: 13,
                      textAlign: "center"
                    }}>
                      Hip
                    </Text>
                    <Text style={{ fontSize: 25 }}>
                      {initialProgressInfo ? initialProgressInfo.hip : "-"}{" "}
                      {initialProgressInfo && unitsOfMeasurement === "metric" && "cm"}
                      {initialProgressInfo &&
                        unitsOfMeasurement === "imperial" &&
                        "inches"}
                    </Text>
                  </View>
                  <Icon
                    name="chevron-down"
                    color="green"
                    size={17}
                    style={{ paddingLeft: 10 }}
                  />
                </View>
              </View>
              <View
                style={{
                  backgroundColor: "#F0F0F0",
                  width: width / 2.3,
                  height: hp("14%"),
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text style={{
                  fontFamily: fonts.StyreneAWebRegular,
                  fontSize: 13,
                  textAlign: "center"
                }}>
                  Burpees
                </Text>
                <Text style={{ fontSize: 25 }}>
                  {burpeesDifference || "-"}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ paddingTop: 10 }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly"
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.StyreneAWebRegular,
                  }}
                >
                  {initialProgressInfo
                    ? moment(initialProgressInfo.date).format("DD/MM/YYYY")
                    : "-"}
                </Text>
                {initialProgressInfo && initialProgressInfo.photoURL ?
                  <View>
                    <FastImage
                      style={{
                        backgroundColor: "#F0F0F0",
                        width: width / 2.6,
                        height: hp("30%"),
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: "center",
                        margin: 10
                      }}
                      source={{
                        uri: initialProgressInfo.photoURL,
                        cache: "immutable",
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  </View>
                  :
                  <View
                    style={{
                      backgroundColor: "#F0F0F0",
                      width: width / 2.6,
                      height: hp("30%"),
                      borderRadius: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      margin: 10
                    }}
                  >
                    <Text>Pic 1</Text>
                  </View>
                }
                <TouchableOpacity
                  disabled={initialProgressInfo === undefined}
                  onPress={() =>
                    navigation.navigate("Progress2", {
                      isInitial: true,
                    })
                  }
                >
                  <Text
                    style={{
                      fontFamily: fonts.StyreneAWebRegular,
                      textDecorationLine: 'underline'
                    }}
                  >
                    Edit Before
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.StyreneAWebRegular,
                  }}
                >
                  {currentProgressInfo
                    ? moment(currentProgressInfo.date).format("DD/MM/YYYY")
                    : "-"}
                </Text>
                {currentProgressInfo ?
                  <View>
                    <FastImage
                      style={{
                        backgroundColor: "#F0F0F0",
                        width: width / 2.6,
                        height: hp("30%"),
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: "center",
                        margin: 10
                      }}
                      source={{
                        uri: currentProgressInfo.photoURL,
                        cache: "immutable",
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  </View>
                  :
                  <View
                    style={{
                      backgroundColor: "#F0F0F0",
                      width: width / 2.6,
                      height: hp("30%"),
                      borderRadius: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      margin: 10
                    }}
                  >
                    <Text>Pic 2</Text>
                  </View>
                }
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Progress2", {
                      isInitial: false,
                    })
                  }
                  disabled={initialProgressInfo === undefined}
                >
                  <Text
                    style={{
                      fontFamily: fonts.StyreneAWebRegular,
                      textDecorationLine: 'underline'
                    }}
                  >
                    Edit After
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View style={{ paddingVertical: 10 }}>
          <View style={{ alignItems: "center" }}>
            <View style={{ padding: 8 }}>
              <Text style={{
                fontFamily: fonts.StyreneAWebRegular,
                fontSize: 13,
                paddingVertical: 20,
              }}>
                {activeChallengeData
                  ? "Active challenge progress"
                  : "Weekly workout progress"}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              {profile && (
                <View>
                  <ProgressBar
                    title="Strength"
                    completed={countS}
                    total={totalS}
                    size={wp("38%")}
                  />
                </View>
              )}
              {profile && (
                <View>
                  <ProgressBar
                    title="Circuit"
                    completed={countC}
                    total={totalC}
                    size={wp("38%")}
                  />
                </View>
              )}
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
                marginTop: -30,
              }}
            >
              {profile && (
                <View>
                  <ProgressBar
                    title="Interval"
                    completed={countI}
                    total={totalI}
                    size={wp("38%")}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
        <Modal
          isVisible={modal}
          animationIn="fadeIn"
          animationInTiming={400}
          animationOut="fadeOut"
          animationOutTiming={600}
          onBackdropPress={() => toggleModal()}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              backgroundColor: "white",
              height: hp("30%"),
              flexDirection: "column"
            }}
          >
            <Text style={{
              fontFamily: fonts.StyreneAWebRegular,
              fontSize: 20
            }}>
              Edit Measurements
            </Text>
            <CustomBtn
              Title="View/Edit before"
              titleCapitalise={true}
              customBtnStyle={{
                width: wp("80%"),
                borderRadius: 5,
                marginVertical: 10,
                backgroundColor: "#DEDBDB"
              }}
              customBtnTitleStyle={{ fontSize: 14 }}
            />
            <CustomBtn
              Title="View/Edit progress"
              titleCapitalise={true}
              customBtnStyle={{
                width: wp("80%"),
                borderRadius: 5,
                backgroundColor: "#DEDBDB"
              }}
              customBtnTitleStyle={{ fontSize: 14 }}
            />
          </View>
        </Modal>
        <Loader loading={loading} color={colors.red.standard} />
      </View>
    </ScrollView>
  )
}