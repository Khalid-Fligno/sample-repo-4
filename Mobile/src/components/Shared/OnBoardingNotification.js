import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { db } from "../../../config/firebase";
import AsyncStorage from "@react-native-community/async-storage";

export default function OnBoardingNotification({ navigation, data }) {
  return (
    <View style={{ backgroundColor: colors.white }}>
      <View
        style={{
          borderColor: colors.themeColor.color,
          borderWidth: 1,
          borderRadius: 2,
          paddingRight: 10,
          margin: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: colors.themeColor.color,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            borderBottomColor: colors.themeColor.color,
            borderBottomWidth: 1,
            backgroundColor: colors.themeColor.color,
          }}
        >
          <Text
            style={{
              flexShrink: 1,
              padding: 10,
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
