import React, { Component } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { any } from "prop-types";
import ChallengeStyle from "../chellengeStyle";
import globalStyle from "../../../styles/globalStyles";
import CustomBtn from "../../../components/Shared/CustomBtn";

import colors from "../../../styles/colors";

import {
  weightOptionsMetric,
  waistOptionsMetric,
  weightOptionsImperial,
  waistOptionsImperial,
} from "../../../utils/index";
import PickerModal from "../../../components/Challenges/PickerModal";
import InputBox2 from "../../../components/Challenges/InputBox2";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-community/async-storage";
import { db } from "../../../../config/firebase";

export default class OnBoarding3 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      challengeData: {},
      height: 0,
      weight: 0,
      goalWeight: 0,
      waist: 0,
      hip: 0,
      btnDisabled: true,
      ModalVisible: false,
      pickerDataList: [],
      inputType: any,
      chosenUom: "metric",
      unitOfMeasurement: undefined,
      skipped: false,
      quit: false,
      completedChallenge: false,
    };
  }

  onFocusFunction = () => {
    const data = this.props.navigation.getParam("data", {});
    const measurments = data["challengeData"]["onBoardingInfo"]["measurements"];

    if (measurments) {
      this.setState({
        challengeData: data["challengeData"],
        btnDisabled: false,
        height: measurments.height ?? 0,
        weight: measurments.weight,
        goalWeight: measurments.goalWeight,
        waist: measurments.waist,
        hip: measurments.hip,
        unitOfMeasurement: measurments.unit,
        quit: this.props.navigation.getParam("quit"),
        completedChallenge:
          this.props.navigation.getParam("completedChallenge"),
      });
    } else {
      this.setState({
        challengeData: data["challengeData"],
        btnDisabled: false,
        quit: this.props.navigation.getParam("quit"),
        completedChallenge:
          this.props.navigation.getParam("completedChallenge"),
      });
    }
    this.fetchDataMeasurement();
  };

  fetchDataMeasurement = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem("uid");
    this.focusListener = await db
      .collection("users")
      .doc(uid)
      .onSnapshot(async (doc) => {
        var data = await doc.data();

        this.setState({
          unitOfMeasurement: data.unitsOfMeasurement,
        });
      });
  };

  // add a focus listener onDidMount
  componentDidMount() {
    this.props.navigation.setParams({
      handleSkip: () => {
        this.goToScreen("next");
      },
    });
    this.listeners = [
      this.props.navigation.addListener("didFocus", () => {
        this.onFocusFunction();
      }),
    ];
  }

  // and don't forget to remove the listener
  componentWillUnmount() {
    this.listeners.forEach((item) => item.remove());
    if (this.focusListener) {
      this.focusListener();
    }
  }

  goToScreen(type) {
    let { challengeData, quit, completedChallenge } = this.state;
    let { goalWeight, hip, height, waist, weight } = this.state;

    const skipped =
      weight == 0 && height == 0 && goalWeight == 0 && waist == 0 && hip == 0
        ? true
        : false;

    this.setState({ skipped: skipped });

    const onBoardingInfo = Object.assign({}, challengeData.onBoardingInfo, {
      measurements: {
        height: this.state.height,
        weight: this.state.weight,
        goalWeight: this.state.goalWeight,
        waist: this.state.waist,
        hip: this.state.hip,
        unit: this.state.unitOfMeasurement,
      },
      skipped: skipped,
    });

    let updatedChallengedata = Object.assign({}, challengeData, {
      onBoardingInfo,
    });

    let measurements = "";

    for (var key in onBoardingInfo.measurements) {
      if (key === "height") {
        if (
          150 !== onBoardingInfo.measurements[key] &&
          onBoardingInfo.measurements[key] !== 0
        ) {
          measurements += key.toString() + ", ";
        }
      } else if (key === "weight") {
        if (
          60 !== onBoardingInfo.measurements[key] &&
          onBoardingInfo.measurements[key] !== 0
        ) {
          measurements += key.toString() + ", ";
        }
      } else if (key === "goalWeight") {
        if (
          60 !== onBoardingInfo.measurements[key] &&
          onBoardingInfo.measurements[key] !== 0
        ) {
          measurements += key.toString() + ", ";
        }
      } else if (key === "waist") {
        if (
          60 !== onBoardingInfo.measurements[key] &&
          onBoardingInfo.measurements[key] !== 0
        ) {
          measurements += key.toString() + ", ";
        }
      } else if (key === "hip") {
        if (
          60 !== onBoardingInfo.measurements[key] &&
          onBoardingInfo.measurements[key] !== 0
        ) {
          measurements += key.toString() + ", ";
        }
      }
    }

    if (type === "next") {
      this.props.navigation.navigate("ChallengeOnBoarding4", {
        completedChallenge,
        quit,
        data: { challengeData: updatedChallengedata },
        onboardingProcessComplete:
          this.props.navigation.getParam("onboardingProcessComplete") !==
          undefined
            ? this.props.navigation.getParam("onboardingProcessComplete")
            : false,
        challengeOnboard:
          this.props.navigation.getParam("challengeOnboard") !== undefined
            ? this.props.navigation.getParam("challengeOnboard")
            : false,
      });
    } else {
      this.props.navigation.navigate("ChallengeOnBoarding1", {
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
  }
  showModal = (inputType) => {
    let { unitOfMeasurement } = this.state;
    let dataList = [];
    if (inputType === "weight" || inputType === "goalWeight")
      dataList =
        unitOfMeasurement === "metric"
          ? weightOptionsMetric
          : weightOptionsImperial;

    if (inputType === "waist" || inputType === "hip" || inputType === "height")
      dataList =
        unitOfMeasurement === "metric"
          ? waistOptionsMetric
          : waistOptionsImperial;

    this.setState({
      modalVisible: true,
      inputType: inputType,
      pickerDataList: dataList,
    });
  };
  hideModal = () => {
    this.setState({
      modalVisible: false,
      inputType: "",
      pickerDataList: [],
    });
  };

  render() {
    let {
      challengeData,
      btnDisabled,
      weight,
      modalVisible,
      pickerDataList,
      inputType,
      goalWeight,
      hip,
      height,
      waist,
      unitOfMeasurement,
    } = this.state;
    if (!challengeData["onBoardingInfo"]) {
      this.onFocusFunction();
    }
    return (
      <SafeAreaView style={ChallengeStyle.container}>
        <View style={[globalStyle.container]}>
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
              <Text style={[ChallengeStyle.onBoardingTitle]}>Measurements</Text>
            </View>
            <View style={ChallengeStyle.checkBox}></View>
            <InputBox2
              onPress={() => this.showModal("height")}
              title="Height"
              extension={unitOfMeasurement === "metric" ? "cm" : "inches"}
              value={height}
            />

            <InputBox2
              onPress={() => this.showModal("weight")}
              title="Weight"
              extension={unitOfMeasurement === "metric" ? "kg" : "lbs"}
              value={weight}
            />
            <InputBox2
              onPress={() => this.showModal("goalWeight")}
              title="Goal weight"
              extension={unitOfMeasurement === "metric" ? "kg" : "lbs"}
              value={goalWeight}
            />

            <View>
              <Text
                style={[
                  ChallengeStyle.onBoardingTitle,
                  { marginBottom: 20, marginTop: 30 },
                ]}
              >
                Girth Measurements
              </Text>
            </View>

            <InputBox2
              onPress={() => this.showModal("waist")}
              title="Waist (Optional)"
              extension={unitOfMeasurement === "metric" ? "cm" : "inches"}
              value={waist}
            />
            <InputBox2
              onPress={() => this.showModal("hip")}
              title="Hip (Optional)"
              extension={unitOfMeasurement === "metric" ? "cm" : "inches"}
              value={hip}
            />
            <View style={[{ flex: 1, justifyContent: "flex-end" }]}>
              <CustomBtn
                Title={
                  weight == 0 &&
                  height == 0 &&
                  goalWeight == 0 &&
                  waist == 0 &&
                  hip == 0
                    ? "Skip"
                    : "Next"
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
                leftIconColor={colors.black}
                leftIconSize={13}
              />
            </View>
          </ScrollView>
          <PickerModal
            metric={unitOfMeasurement === "metric"}
            imerial={unitOfMeasurement === "imperial"}
            dataMapList={pickerDataList}
            onValueChange={(value) => this.setState({ [inputType]: value })}
            isVisible={modalVisible}
            onBackdropPress={() => this.hideModal()}
            selectedValue={this.state[inputType]}
            onPress={() => this.hideModal()}
            inputType={inputType}
          />
        </View>
      </SafeAreaView>
    );
  }
}
