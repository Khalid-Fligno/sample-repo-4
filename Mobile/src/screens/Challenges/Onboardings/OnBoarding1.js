import React, { Component } from "react";
import { View, Text, ScrollView, SafeAreaView, Alert } from "react-native";
import ChallengeStyle from "../chellengeStyle";
import globalStyle from "../../../styles/globalStyles";
import SliderComponent from "../../../components/Challenges/slider";
import CustomBtn from "../../../components/Shared/CustomBtn";
import fonts from "../../../styles/fonts";
import * as FileSystem from "expo-file-system";
import CheckboxComponent from "../../../components/Challenges/CheckboxComponent";
import colors from "../../../styles/colors";

export default class OnBoarding1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      challengeData: [],
      weightLoss: 1,
      increaseEnergy: 1,
      toneUp: 1,
      mentalHealth: 1,
      increaseFitness: 1,
      btnDisabled: true,
    };
  }

  onFocusFunction = () => {
    const challengeData = this.props.navigation.getParam("data", {})[
      "challengeData"
    ];
    const toAchieve = challengeData["onBoardingInfo"]
      ? challengeData["onBoardingInfo"]["toAchieve"]
      : [];
    this.setState({
      challengeData: challengeData,
      weightLoss: toAchieve ? toAchieve.weightLoss : 1,
      increaseEnergy: toAchieve ? toAchieve.increaseEnergy : 1,
      toneUp: toAchieve ? toAchieve.toneUp : 1,
      mentalHealth: toAchieve ? toAchieve.mentalHealth : 1,
      increaseFitness: toAchieve ? toAchieve.increaseFitness : 1,
      btnDisabled: true,
    });
  };

  // add a focus listener onDidMount
  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      this.onFocusFunction();
    });
    await FileSystem.downloadAsync(
      "https://firebasestorage.googleapis.com/v0/b/staging-fitazfk-app.appspot.com/o/videos%2FBURPEE.mp4?alt=media&token=ff7a5afd-58d2-4508-9cd0-49af7672e333",
      `${FileSystem.cacheDirectory}exercise-burpees.mp4`
    );
  }

  // and don't forget to remove the listener
  componentWillUnmount = async () => {
    this.focusListener.remove();
  };
  goToNextScreen(type) {
    let {
      challengeData,
      weightLoss,
      increaseEnergy,
      toneUp,
      mentalHealth,
      increaseFitness,
    } = this.state;
    const onBoardingInfo = Object.assign({}, challengeData.onBoardingInfo, {
      toAchieve: {
        weightLoss,
        increaseEnergy,
        toneUp,
        mentalHealth,
        increaseFitness,
      },
    });

    let updatedChallengedata = Object.assign({}, challengeData, {
      onBoardingInfo,
    });

    let toAchieve = "";

    for (var key in onBoardingInfo.toAchieve) {
      if (
        onBoardingInfo.toAchieve[key] !== undefined &&
        onBoardingInfo.toAchieve[key] !== 1
      ) {
        toAchieve += key.toString() + ", ";
      }
    }

    if (type === "previous") {
      this.props.navigation.navigate("ChallengeOnBoarding6");
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
        challengeOnboard:
          this.props.navigation.getParam("challengeOnboard") !== undefined
            ? this.props.navigation.getParam("challengeOnboard")
            : false,
      });
      // Alert.alert('',
      //   `Transform ${toAchieve.length === 0 ? 'Nothing' : toAchieve.substring(0, toAchieve.length - 2)}`,
      //   [
      //     {
      //       text: 'OK', onPress:()=>{
      //         this.props.navigation.navigate('ChallengeOnBoarding3',{
      //           data:{
      //             challengeData:updatedChallengedata
      //           },
      //           onboardingProcessComplete: this.props.navigation.getParam('onboardingProcessComplete') !== undefined ? this.props.navigation.getParam('onboardingProcessComplete') : false,
      //           challengeOnboard: this.props.navigation.getParam('challengeOnboard') !== undefined ? this.props.navigation.getParam('challengeOnboard') : false
      //         });
      //       }
      //     },
      //   ],
      //   { cancelable: false }
      // );
    }
  }

  render() {
    let {
      challengeData,
      weightLoss,
      increaseEnergy,
      increaseFitness,
      toneUp,
      mentalHealth,
      btnDisabled,
    } = this.state;
    return (
      <SafeAreaView style={ChallengeStyle.container}>
        <View style={globalStyle.container}>
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
            <View>
              <Text style={ChallengeStyle.onBoardingTitle}>
                What do you want to achieve?
              </Text>
              <Text
                style={[
                  ChallengeStyle.onBoardingTitle,
                  {
                    fontSize: 15,
                    fontFamily: fonts.GothamMedium,
                    marginTop: 20,
                    marginBottom: 20,
                    textTransform: "lowercase",
                  },
                ]}
              >
                {challengeData.displayName}
              </Text>
            </View>

            {/* <SliderComponent
              title="Weight loss"
              value={weightLoss}
              minimumValue={1}
              maximumValue={10}
              onValueChange={(value) =>
                this.setState({ weightLoss: Math.round(value) })
              }
            />
            <SliderComponent
              title="Increase energy"
              value={increaseEnergy}
              minimumValue={1}
              maximumValue={10}
              onValueChange={(value) =>
                this.setState({ increaseEnergy: Math.round(value) })
              }
            />
            <SliderComponent
              title="Tone up"
              value={toneUp}
              minimumValue={1}
              maximumValue={10}
              onValueChange={(value) =>
                this.setState({ toneUp: Math.round(value) })
              }
            />
            <SliderComponent
              title="Mental health"
              value={mentalHealth}
              minimumValue={1}
              maximumValue={10}
              onValueChange={(value) =>
                this.setState({ mentalHealth: Math.round(value) })
              }
            />
            <SliderComponent
              title="Increase fitness"
              value={increaseFitness}
              minimumValue={1}
              maximumValue={10}
              onValueChange={(value) =>
                this.setState({ increaseFitness: Math.round(value) })
              }
            /> */}
            <CheckboxComponent
              title="Weight loss"
              isChecked={weightLoss > 1}
              onPress={(isChecked) => {
                this.setState({ btnDisabled: false });
                if (isChecked) {
                  this.setState({ weightLoss: 10 });
                } else this.setState({ weightLoss: 1 });
              }}
            />

            <CheckboxComponent
              title="Increase energy"
              isChecked={increaseEnergy > 1}
              onPress={(isChecked) => {
                this.setState({ btnDisabled: false });
                if (isChecked) {
                  this.setState({ increaseEnergy: 10 });
                } else this.setState({ increaseEnergy: 1 });
              }}
            />

            <CheckboxComponent
              title="Tone up"
              isChecked={toneUp > 1}
              onPress={(isChecked) => {
                this.setState({ btnDisabled: false });
                if (isChecked) {
                  this.setState({ toneUp: 10 });
                } else this.setState({ toneUp: 1 });
              }}
            />

            <CheckboxComponent
              title="Mental health"
              isChecked={mentalHealth > 1}
              onPress={(isChecked) => {
                this.setState({ btnDisabled: false });
                if (isChecked) {
                  this.setState({ mentalHealth: 10 });
                } else this.setState({ mentalHealth: 1 });
              }}
            />

            <CheckboxComponent
              title="Increase fitness"
              isChecked={increaseFitness > 1}
              onPress={(isChecked) => {
                this.setState({ btnDisabled: false });
                if (isChecked) {
                  this.setState({ increaseFitness: 10 });
                } else this.setState({ increaseFitness: 1 });
              }}
            />

            <View
              style={{ flex: 1, justifyContent: "flex-end", marginTop: 20 }}
            >
              <CustomBtn
                Title="Next"
                customBtnStyle={{
                  borderRadius: 50,
                  padding: 15,
                  width: "100%",
                }}
                isRightIcon={true}
                rightIconName="chevron-right"
                rightIconColor={colors.black}
                rightIconSize={13}
                onPress={() => this.goToNextScreen("")}
                disabled={btnDisabled}
              />
            </View>
            {this.props.navigation.getParam("challengeOnboard", {}) && (
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
                onPress={() => this.goToNextScreen("previous")}
                disabled={false}
                customBtnTitleStyle={{ color: colors.black, marginRight: 40 }}
                isLeftIcon={true}
                leftIconName="chevron-left"
                leftIconColor={colors.black}
                leftIconSize={13}
              />
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
