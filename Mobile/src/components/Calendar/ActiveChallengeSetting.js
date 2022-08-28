import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { View, Text } from "react-native";
import colors from "../../styles/colors";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import DoubleRightArrow from "../../../assets/icons/DoubleRightArrow";
import { Alert } from "react-native";
import fonts from "../../styles/fonts";

const ActiveChallengeSetting = ({
  quitChallenge,
  showCalendarModal,
  restartChallenge,
  activeChallengeUserData,
}) => {
  return (
    <View
      style={{
        marginHorizontal: wp("4%"),
      }}
    >
      <View
        style={{
          marginTop: wp("5%"),
          borderTopWidth: 1,
          borderTopColor: colors.grey.light,
        }}
      >
        <TouchableOpacity
          style={styles.btnContainer}
          onPress={() => {
            Alert.alert(
              "",
              "Are you sure you want to quit your challenge?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Quit",
                  onPress: () => quitChallenge(activeChallengeUserData),
                },
              ],
              { cancelable: false }
            );
          }}
        >
          <Text style={styles.title}>Quit challenge</Text>
          <DoubleRightArrow height={wp("3.5%")} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnContainer}
          onPress={() => {
            Alert.alert(
              "Are you sure!",
              "You want to change your challenge start date?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Change",
                  onPress: () => showCalendarModal(),
                },
              ],
              { cancelable: false }
            );
          }}
        >
          <Text style={styles.title}>Change challenge start date</Text>
          <DoubleRightArrow height={wp("3.5%")} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnContainer}
          onPress={() => {
            Alert.alert(
              "",
              "Are you sure you want to restart your challenge?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Restart",
                  onPress: () => restartChallenge(activeChallengeUserData),
                },
              ],
              { cancelable: false }
            );
          }}
        >
          <Text style={styles.title}>Restart challenge</Text>
          <DoubleRightArrow height={wp("3.5%")} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ActiveChallengeSetting;

const styles = StyleSheet.create({
  btnContainer: {
    paddingVertical: wp("3%"),
    borderBottomWidth: 1,
    borderBottomColor: colors.grey.light,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: fonts.GothamMedium,
    fontSize: wp("2.8%"),
    color: colors.black,
    textTransform: "uppercase",
    marginLeft: wp("2%"),
    width: "80%",
  },
});
