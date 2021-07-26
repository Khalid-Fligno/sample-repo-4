import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Dimensions,
} from "react-native";
import CustomButton from "../../components/Shared/CustomButton";
import globalStyle, { containerPadding } from "../../styles/globalStyles";
import ChallengeStyle from "../Challenges/chellengeStyle";
import colors from "../../styles/colors";
import CustomBtn from "../../components/Shared/CustomBtn";
import onboardingStyle from "./OnBoardingStyle";
import Loader from "../../components/Shared/Loader";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-community/async-storage";
import { db } from "../../../config/firebase";
import RoundTick from "../../../assets/icons/RoundTick";
import FitnessLevelCard from "../../components/Onboarding/FitnessLevelCard";
import BigHeadingWithBackButton from "../../components/Shared/BigHeadingWithBackButton";
import fonts from "../../styles/fonts";
import {
  getChallengeDetails,
  getLatestChallenge,
  hasChallenges,
} from "../../utils/challenges";
import moment from "moment";
import momentTimezone from "moment-timezone";
const { width } = Dimensions.get("window");

class Onboarding2Screen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fitnessLevel: 2,
      loading: false,
      name: props.navigation.getParam("name", null),
      specialOffer: props.navigation.getParam("specialOffer", undefined),
    };
  }

  handleSubmit = async () => {
    const { name, specialOffer } = this.state;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    this.setState({ loading: true });
    try {
      const uid = await AsyncStorage.getItem("uid");
      const userRef = db.collection("users").doc(uid);
      const userData = (await userRef.get()).data();
      const data = {
        fitnessLevel: this.state.fitnessLevel,
        onboarded: false,
      };
      await userRef.set(data, { merge: true });
      this.setState({ loading: false });
      // this.props.navigation.navigate('App', { isInitial: true });
      // console.log("check user has challenge",uid,userRef);
      if (
        userData.subscriptionInfo &&
        userData.subscriptionInfo.expiry > Date.now()
      ) {
        this.props.navigation.navigate("App");
      } else if (await hasChallenges(uid)) {
        this.props.navigation.navigate("App");
      } else {
        this.props.navigation.navigate("Subscription", {
          name,
          specialOffer,
        });
      }
    } catch (err) {
      Alert.alert("Database write error", `${err}`);
      this.setState({ loading: false });
    }
  };
  render() {
    let { fitnessLevel, loading } = this.state;
    return (
      <SafeAreaView style={onboardingStyle.container}>
        <View style={[globalStyle.container]}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              flexDirection: "column",
              justifyContent: "space-between",
              paddingTop: 0,
              paddingBottom: 15,
            }}
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            <BigHeadingWithBackButton
              bigTitleText="Intensity"
              isBackButton={false}
              isBigTitle={true}
              customContainerStyle={{ marginTop: 15, marginBottom: 0 }}
            />
            <Text
              style={[
                onboardingStyle.IntensityTitleText,
                { color: colors.grey.dark, width: "100%" },
              ]}
            >
              Select your intensity level below.
            </Text>
            <Text
              style={[
                onboardingStyle.IntensityTitleText,
                { color: colors.grey.dark, width: "100%" },
              ]}
            >
              Beginner: train once a week,
            </Text>
            <Text
              style={[
                onboardingStyle.IntensityTitleText,
                { color: colors.grey.dark, width: "100%" },
              ]}
            >
              Intermediate: train 2 to 3 times a week,
            </Text>
            <Text
              style={[
                onboardingStyle.IntensityTitleText,
                { color: colors.grey.dark, width: "100%" },
              ]}
            >
              Expert: train 4+ times a week
            </Text>

            <FitnessLevelCard
              source={require("../../../assets/images/OnBoardindImg/FL_1.png")}
              onPress={() => this.setState({ fitnessLevel: 1 })}
              title="Beginner"
              helpText="Train once a week"
              showTick={fitnessLevel === 1}
            />
            <FitnessLevelCard
              source={require("../../../assets/images/OnBoardindImg/FL_2.png")}
              onPress={() => this.setState({ fitnessLevel: 2 })}
              title="Intermediate"
              helpText="Train 2 to 3 times a week"
              showTick={fitnessLevel === 2}
            />
            <FitnessLevelCard
              source={require("../../../assets/images/OnBoardindImg/FL_3.png")}
              onPress={() => this.setState({ fitnessLevel: 3 })}
              title="Expert"
              helpText="Train 4+ times a week"
              showTick={fitnessLevel === 3}
            />

            <View
              style={{ flex: 0.5, justifyContent: "flex-end", marginTop: 20 }}
            >
              <CustomBtn
                Title="Continue"
                customBtnStyle={{ borderRadius: 50, padding: 15 }}
                onPress={() => this.handleSubmit()}
                customBtnTitleStyle={{ letterSpacing: fonts.letterSpacing }}
              />
            </View>
          </ScrollView>
          <Loader loading={loading} color={colors.coral.standard} />
        </View>
      </SafeAreaView>
    );
  }
}

export default Onboarding2Screen;
