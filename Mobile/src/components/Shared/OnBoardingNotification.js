import React from "react";
import { View, Text, TouchableOpacity,Dimensions } from "react-native";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";

export default function OnBoardingNotification({ navigation, data }) {
  const screenWidth = Dimensions.get('window').width;
  console.log(screenWidth);
  return (
    <View style={{ backgroundColor: colors.white }}>
      <View
        style={{
          borderColor: colors.themeColor.color,
          borderWidth: 1,
          borderRadius: 2,
          padding: 10,
          margin: 20,
          flexDirection: screenWidth<=395?"column":"row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: colors.themeColor.color,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            paddingBottom: 3,
            justifyContent: "flex-start",
            borderBottomColor: colors.themeColor.color,
            borderBottomWidth: 1,
            backgroundColor: colors.themeColor.color,
          }}
        >
          <Text
            style={{
              flexShrink: 1,
              color: colors.black,
              fontFamily: fonts.StyreneAWebRegular,
            }}
          >
            Complete your onboarding process
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ChallengeOnBoarding", {
              data: { challengeData: data },
              onboardingProcessComplete: true,
              challengeOnboard: false,
            });
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              borderColor: colors.black,
              borderWidth: 1,
            }}
          >
            <Text
              style={{
                color: colors.black,
                fontFamily: fonts.SimplonMonoLight,
              }}
            >
              Click Here
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
