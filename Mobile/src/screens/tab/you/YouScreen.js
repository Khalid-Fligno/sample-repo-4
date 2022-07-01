import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native"
import FastImage from "react-native-fast-image";
import fonts from '../../../styles/fonts';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Modal from "react-native-modal";
import CustomBtn from '../../../components/Shared/CustomBtn';
import Loader from "../../../components/Shared/Loader";
import colors from "../../../styles/colors";
import { useCounter } from '../../../library/useCustomHook/tab/you/youScreenHook';

export const YouScreen = ({ navigation }) => {
  const { width } = Dimensions.get("window");
  const {
    profile,
    initialProgressInfo,
    currentProgressInfo,
    unitsOfMeasurement,
    weightDiff,
    waistDiff,
    hipDiff,
    burpeeRes,
    userData,
    loading,
    modal,
    setModal,
    fetchUserData,
    fetchProgressInfo,
    progressDifference,
    updateProgressBtn,
    editBeforeBtn,
    latestBurpee,
    diffMeasurement,
    toggleModal
  } = useCounter()

  useEffect(() => {
    fetchProgressInfo();
  }, [initialProgressInfo, currentProgressInfo, userData])

  useEffect(() => {
    navigation.addListener("didFocus", async () => {
      await fetchUserData();
    })
    fetchUserData();
  }, [])

  useEffect(() => {
    latestBurpee(
      initialProgressInfo,
      currentProgressInfo
    );
  }, [initialProgressInfo, currentProgressInfo])

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
      }}
      >
        <View
          style={{
            paddingVertical: 10
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
                    {diffMeasurement(
                      weightDiff?.data,
                      currentProgressInfo?.weight,
                      initialProgressInfo?.weight
                    ) ? Number(diffMeasurement(
                      weightDiff?.data,
                      currentProgressInfo?.weight,
                      initialProgressInfo?.weight
                    )).toFixed(1) : "-"}
                    {diffMeasurement(
                      weightDiff?.data,
                      currentProgressInfo?.weight,
                      initialProgressInfo?.weight
                    ) ? Number(diffMeasurement(
                      weightDiff?.data,
                      currentProgressInfo?.weight,
                      initialProgressInfo?.weight
                    )).toFixed(1) && unitsOfMeasurement === "metric" && "kg" : null}
                    {diffMeasurement(
                      weightDiff?.data,
                      currentProgressInfo?.weight,
                      initialProgressInfo?.weight
                    ) ? Number(diffMeasurement(
                      weightDiff?.data,
                      currentProgressInfo?.weight,
                      initialProgressInfo?.weight
                    )).toFixed(1) && unitsOfMeasurement === "imperial" && "lbs" : null}
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
                    {diffMeasurement(
                      waistDiff?.data,
                      currentProgressInfo?.waist,
                      initialProgressInfo?.waist
                    ) ? diffMeasurement(
                      waistDiff?.data,
                      currentProgressInfo?.waist,
                      initialProgressInfo?.waist
                    ) : "-"}
                    {diffMeasurement(
                      waistDiff?.data,
                      currentProgressInfo?.waist,
                      initialProgressInfo?.waist
                    ) ? diffMeasurement(
                      waistDiff?.data,
                      currentProgressInfo?.waist,
                      initialProgressInfo?.waist
                    ) && unitsOfMeasurement === "metric" && "cm" : null}
                    {diffMeasurement(
                      waistDiff?.data,
                      currentProgressInfo?.waist,
                      initialProgressInfo?.waist
                    ) ?
                      diffMeasurement(
                        waistDiff?.data,
                        currentProgressInfo?.waist,
                        initialProgressInfo?.waist
                      ) &&
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
                    {diffMeasurement(
                      hipDiff?.data,
                      currentProgressInfo?.hip,
                      initialProgressInfo?.hip
                    ) ? diffMeasurement(
                      hipDiff?.data,
                      currentProgressInfo?.hip,
                      initialProgressInfo?.hip
                    ) : "-"}
                    {diffMeasurement(
                      hipDiff?.data,
                      currentProgressInfo?.hip,
                      initialProgressInfo?.hip
                    ) ? diffMeasurement(
                      hipDiff?.data,
                      currentProgressInfo?.hip,
                      initialProgressInfo?.hip
                    ) && unitsOfMeasurement === "metric" && "cm" : null}
                    {diffMeasurement(
                      hipDiff?.data,
                      currentProgressInfo?.hip,
                      initialProgressInfo?.hip
                    ) ? diffMeasurement(
                      hipDiff?.data,
                      currentProgressInfo?.hip,
                      initialProgressInfo?.hip
                    ) && unitsOfMeasurement === "imperial" && "inches" : null}
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
                  {burpeeRes}
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
                  {initialProgressInfo && initialProgressInfo.photoURL
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
                    <Text>Before</Text>
                  </View>
                }
                <TouchableOpacity
                  disabled={initialProgressInfo === undefined}
                  onPress={() =>
                    navigation.navigate("Progress2", {
                      isInitial: true,
                    })
                  }
                  style={{ padding: 10 }}
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
                  {currentProgressInfo && currentProgressInfo.photoURL
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
                    <Text>After</Text>
                  </View>
                }
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Progress2", {
                      isInitial: false,
                    })
                  }
                  disabled={initialProgressInfo === undefined}
                  style={{ padding: 10 }}
                >
                  <Text
                    style={{
                      fontFamily: fonts.StyreneAWebRegular,
                      textDecorationLine: 'underline',
                    }}
                  >
                    Edit After
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "#F0F0F0",
            paddingVertical: 20,
            borderRadius: 10,
            alignItems: "center",
            marginBottom: 20
          }}
        >
          <Text style={{ fontSize: 40 }}>
            {profile}
          </Text>
          <Text style={{
            fontFamily: fonts.StyreneAWebRegular
          }}>
            Total workouts completed 🎉
          </Text>
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