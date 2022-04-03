import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import globalStyle from "../../styles/globalStyles";
import colors from "../../styles/colors";
import onboardingStyle from "./OnBoardingStyle";
import Loader from "../../components/Shared/Loader";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-community/async-storage";
import { db } from "../../config/firebase";
import FitnessLevelCard from "../../components/Onboarding/FitnessLevelCard";
import BigHeadingWithBackButton from "../../components/Shared/BigHeadingWithBackButton";
import fonts from "../../styles/fonts";
import { hasChallenges } from "../../utils/challenges";

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

  handleSubmit = async (fitnessLevel) => {
    const { name, specialOffer } = this.state;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    this.setState({ loading: true });
    try {
      const uid = await AsyncStorage.getItem("uid");
      const userRef = db.collection("users").doc(uid);
      const userData = (await userRef.get()).data();
      const data = {
        fitnessLevel: fitnessLevel,
        onboarded: true,
      };
      await userRef.set(data, { merge: true });
      this.setState({ loading: false });

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
            <Text style={{ fontFamily: fonts.standard, fontSize: 15 }}>
              {/* Select your intensity level below. */}
              How often do you currently train.
            </Text>

            <FitnessLevelCard
              onPress={() => this.handleSubmit(1)}
              title="0-2 times a week"
              // title="Beginner"
              helpText="Train once a week"
              isCardColored={true}
              cardColor={colors.coolIce}
            />
            <FitnessLevelCard
              onPress={() => this.handleSubmit(2)}
              title="2-3 times a week"
              // title="Intermediate"
              helpText="Train 2 to 3 times a week"
              isCardColored={true}
              cardColor={colors.coolIce}
            />
            <FitnessLevelCard
              onPress={() => this.handleSubmit(3)}
              title="4+ times a week"
              // title="Expert"
              helpText="Train 4+ times a week"
              isCardColored={true}
              cardColor={colors.coolIce}
            />
          </ScrollView>
          <Loader loading={loading} color={colors.coral.standard} />
        </View>
      </SafeAreaView>
    );
  }
}

export default Onboarding2Screen;
