import React, { Component } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import globalStyle from "../../styles/globalStyles";
import RoundTick from "../../../assets/icons/RoundTick";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";
import CustomBtn from "../Shared/CustomBtn";
import PropTypes from "prop-types";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
class ChallengeCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      numberOfDays,
      outline,
      btnTitle,
      onPress,
      imageUrl,
      disabled,
      numberOfWeeks,
      restartButton,
      onPressRestart,
      title,
      subTitle,
    } = this.props;
    return (
      <ImageBackground
        source={{ uri: imageUrl }}
        style={[
          globalStyle.FT_ImageContainer,
          { height: 130, display: "flex" },
        ]}
        imageStyle={{ borderRadius: 5, backgroundColor: colors.grey.medium }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            if (!disabled) {
              onPress();
            }
          }}
        >
          <View style={styles.overlay}>
            <View style={styles.ViewContainer}>
              <View style={styles.titleContainer}>
                <Text
                  style={[
                    styles.numberTextLabel,
                    { fontSize: wp("6%"), flexWrap: "nowrap" },
                  ]}
                >
                  {title}
                </Text>
              </View>
              {disabled && (
                <View style={[styles.titleContainer, { marginTop: wp("2%") }]}>
                  <Text
                    style={[styles.numberTextLabel, { fontSize: wp("4%") }]}
                  >
                    {subTitle}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.customButtonContainer}>
              {!disabled && (
                <CustomBtn
                  outline={outline}
                  Title={btnTitle}
                  customBtnStyle={{
                    padding: 8,
                    backgroundColor: !outline
                      ? colors.themeColor.color
                      : "transparent",

                    width: wp("40%"),
                    marginTop: hp("1.8%"),
                  }}
                  customBtnTitleStyle={{ color: colors.black, fontSize: 14 }}
                  onPress={onPress}
                  disabled={disabled}
                />
              )}

              {restartButton && (
                <CustomBtn
                  outline={outline}
                  Title="Reset"
                  customBtnStyle={{
                    padding: 8,
                    marginTop: 10,
                    backgroundColor: !outline
                      ? colors.themeColor.color
                      : "transparent",
                    borderRadius: 50,
                    width: wp("40%"),
                    marginTop: hp("1.8%"),
                  }}
                  customBtnTitleStyle={{ color: colors.offWhite, fontSize: 14 }}
                  onPress={onPressRestart}
                  disabled={disabled}
                />
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ImageBackground>
    );
  }
}

ChallengeCard.propTypes = {
  numberOfDays: PropTypes.number,
  outline: PropTypes.bool,
  btnTitle: PropTypes.any,
  onPress: PropTypes.func,
  imageUrl: PropTypes.any,
  disabled: PropTypes.bool,
};

export default ChallengeCard;

const styles = StyleSheet.create({
  ViewContainer: {
    width: "100%",
    height: "100%",
    padding: 10,
    paddingLeft: 20,
    flexBasis: "50%",
    justifyContent: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    flexWrap: "wrap",
  },
  numberTextLabel: {
    fontSize: 50,
    fontFamily: fonts.GothamLight,
    marginBottom: -6,
    color: colors.offWhite,
    textTransform: "capitalize",
  },
  textLabel: {
    fontSize: 15,
    fontFamily: fonts.GothamMedium,
    color: colors.offWhite,
  },
  customButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: wp("85%"),
    marginHorizontal: 10,
  },
  overlay: {
    backgroundColor: colors.transparentBlackLightest,
    flex: 1,
  },
});
