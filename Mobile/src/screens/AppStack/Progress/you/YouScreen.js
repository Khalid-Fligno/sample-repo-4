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
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
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
  const [weightDiff, setWeightDiff] = useState(null);
  const [waistDiff, setWaistDiff] = useState(null);
  const [hipDiff, setHipDiff] = useState(null);
  const [modal, setModal] = useState(false);
  const [totalI, setTotalI] = useState(0);
  const [totalS, setTotalS] = useState(0);
  const [totalC, setTotalC] = useState(0);
  const [countI, setCountI] = useState(0);
  const [countS, setCountS] = useState(0);
  const [countC, setCountC] = useState(0);

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

  const progressDifference = (
    initialProgressInfo,
    currentProgressInfo
  ) => {
    if (initialProgressInfo && currentProgressInfo) {
      const weight = diff(initialProgressInfo?.weight, currentProgressInfo?.weight);
      const waist = diff(initialProgressInfo?.waist, currentProgressInfo?.waist);
      const hip = diff(initialProgressInfo?.hip, currentProgressInfo?.hip)

      setWeightDiff(weight)
      setWaistDiff(waist)
      setHipDiff(hip)
    }
  }

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

  const latestBurpee = (
    initialProgressInfo,
    currentProgressInfo
  ) => {
    let result = "-";

    if (
      initialProgressInfo &&
      currentProgressInfo &&
      initialProgressInfo?.burpeeCount &&
      currentProgressInfo?.burpeeCount
    ) {
      result = currentProgressInfo.burpeeCount
    } else if (
      currentProgressInfo?.burpeeCount
    ) {
      result = currentProgressInfo.burpeeCount
    } else if (initialProgressInfo?.burpeeCount) {
      result = initialProgressInfo.burpeeCount
    }
    return result;
  }

  const diffMeasurement = (measurement) => {
    let result = "-";

    if (measurement) {
      result = measurement
    } else if (
      currentProgressInfo?.weight
    ) {
      result = currentProgressInfo.weight
    } else if (
      initialProgressInfo?.weight
    ) {
      result = initialProgressInfo.weight
    }
    return result;
  }

  const toggleModal = () => {
    setModal(!modal)
  };

  useEffect(() => {
    fetchProgressInfo();
    fetchActiveChallengeUserData();
  }, [])

  useEffect(() => {
    progressDifference(
      initialProgressInfo,
      currentProgressInfo
    )
  }, [initialProgressInfo, currentProgressInfo])

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
            Total workouts completed 🎉
          </Text>
        </View>
        <View
          style={{
            paddingVertical: 20
          }}
        >
          <View style={{
            paddingVertical: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: fonts.StyreneAWebRegular,
              }}
            >
              Body Measurements
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
                  justifyContent: "space-evenly",
                  flexDirection: "row"
                }}
              >
                <View style={{
                  marginLeft: weightDiff?.data ? 20 : null
                }}>
                </View>
                <View>
                  <Text style={{
                    fontFamily: fonts.StyreneAWebRegular,
                    fontSize: 13,
                    textAlign: "center",
                    marginBottom: 5
                  }}>
                    Weight
                  </Text>
                  <Text style={{ fontSize: 25, textAlign: "center" }}>
                    {Number(diffMeasurement(weightDiff?.data)).toFixed(1)}
                    {diffMeasurement() ? Number(diffMeasurement(weightDiff?.data)).toFixed(1) && unitsOfMeasurement === "metric" && "kg" : null}
                    {diffMeasurement() ? Number(diffMeasurement(weightDiff?.data)).toFixed(1) && unitsOfMeasurement === "imperial" && "lbs" : null}
                  </Text>
                </View>
                <View style={{
                  left: 2,
                }}>
                  {
                    weightDiff ?
                      <Icon
                        name={weightDiff?.bol ? "arrow-up" : "arrow-down"}
                        color={weightDiff?.bol ? "red" : "green"}
                        size={27}
                      />
                      :
                      null
                  }
                </View>
              </View>
              <View
                style={{
                  backgroundColor: "#F0F0F0",
                  width: width / 2.3,
                  height: hp("14%"),
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  flexDirection: "row"
                }}
              >
                <View style={{
                  marginLeft: waistDiff?.data ? 20 : null
                }}>
                </View>
                <View>
                  <Text style={{
                    fontFamily: fonts.StyreneAWebRegular,
                    fontSize: 13,
                    textAlign: "center",
                    marginBottom: 5
                  }}>
                    Waist
                  </Text>
                  <Text style={{ fontSize: 25, textAlign: "center" }}>
                    {diffMeasurement(waistDiff?.data)}
                    {diffMeasurement() ? diffMeasurement(waistDiff?.data) && unitsOfMeasurement === "metric" && "cm" : null}
                    {diffMeasurement() ?
                      diffMeasurement(waistDiff?.data) &&
                      unitsOfMeasurement === "imperial" &&
                      "inches" :
                      null}
                  </Text>
                </View>
                <View style={{
                  left: 7,
                }}>
                  {
                    waistDiff ?
                      <Icon
                        name={waistDiff?.bol ? "arrow-up" : "arrow-down"}
                        color={waistDiff?.bol ? "red" : "green"}
                        size={27}
                      />
                      :
                      null
                  }
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
                  justifyContent: "space-evenly",
                  flexDirection: "row"
                }}
              >
                <View style={{
                  marginLeft: hipDiff?.data ? 20 : null
                }}>
                </View>
                <View>
                  <Text style={{
                    fontFamily: fonts.StyreneAWebRegular,
                    fontSize: 13,
                    textAlign: "center",
                    marginBottom: 5
                  }}>
                    Hip
                  </Text>
                  <Text style={{ fontSize: 25, textAlign: "center" }}>
                    {diffMeasurement()}
                    {diffMeasurement() ? diffMeasurement(hipDiff?.data) && unitsOfMeasurement === "metric" && "cm" : null}
                    {diffMeasurement() ? diffMeasurement(hipDiff?.data) && unitsOfMeasurement === "imperial" && "inches" : null}
                  </Text>
                </View>
                <View style={{
                  left: 7,
                }}>
                  {
                    hipDiff ?
                      <Icon
                        name={hipDiff?.bol ? "arrow-up" : "arrow-down"}
                        color={hipDiff?.bol ? "red" : "green"}
                        size={27}
                      />
                      :
                      null
                  }
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
                  textAlign: "center",
                  marginBottom: 5
                }}>
                  Burpees
                </Text>
                <Text style={{ fontSize: 25, textAlign: "center" }}>
                  {latestBurpee(
                    initialProgressInfo,
                    currentProgressInfo
                  )}
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
                      // resizeMode={FastImage.resizeMode.cover}
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
                {currentProgressInfo && currentProgressInfo.photoURL ?
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
                      // resizeMode={FastImage.resizeMode.cover}
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
              onPress={() => editBeforeBtn(initialProgressInfo, currentProgressInfo)}
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
              onPress={() => updateProgressBtn(initialProgressInfo, currentProgressInfo)}
            />
          </View>
        </Modal>
        <Loader loading={loading} color={colors.red.standard} />
      </View>
    </ScrollView>
  )
}