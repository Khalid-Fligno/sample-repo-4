import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { containerPadding } from "../../styles/globalStyles";
import ChallengeProgressBar from "./ChallengeProgressBar";
import PhaseCard from "./PhaseCard";

const ChallengeProgressCard2 = (props) => {
  const {
    phase,
    phaseData,
    activeChallengeData,
    activeChallengeUserData,
    openLink,
    currentDay,
  } = props;

  return (
    <View>
      <View style={styles.ChallengeProgressCardContainer}>
        <View style={{ width: "55%" }}>
          <Text style={styles.challengeLabel}>
            {activeChallengeUserData.displayName}
            {"  "}
          </Text>
          <Text
            style={{
              fontFamily: fonts.SimplonMonoMedium,
              color: colors.grey.dark,
              fontSize: wp("3%"),
            }}
          >
            Day {currentDay} of {activeChallengeData.numberOfDays} - keep it
            going!
          </Text>
        </View>

        <View style={{ marginStart: wp("8%") }}>
          <ChallengeProgressBar
            completed={currentDay}
            total={activeChallengeData.numberOfDays}
            size={wp("26%")}
          />
        </View>
      </View>
      <PhaseCard
        onPress={() => {
          return null;
        }}
        image={phaseData.thumbnail}
        phase={phase}
        phaseData={phaseData}
        openLink={openLink}
      />
    </View>
  );
};

export default ChallengeProgressCard2;

const styles = StyleSheet.create({
  ChallengeProgressCardContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: wp("100") - containerPadding * 2,
    paddingVertical: wp("2%"),
  },
  challengeLabel: {
    fontSize: wp("4.7%"),
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: wp("2%"),
    textTransform: "capitalize",
  },
});
