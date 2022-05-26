import React from "react";
import { 
  View, 
  Text, 
  TouchableOpacity 
} from "react-native";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";

export default function OnBoardingNotification({ navigation, data }) {
  
  return (
    <View style={{ backgroundColor: colors.white }}>
      <View
        style={{
          borderColor: colors.black,
          borderWidth: 1,
          borderRadius: 2,
          padding: 10,
          margin: 20,
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            paddingBottom: 3,
            justifyContent: "flex-start",
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
