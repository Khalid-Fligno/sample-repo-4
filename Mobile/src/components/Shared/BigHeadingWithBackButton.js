import React from "react";
import globalStyle from "../../styles/globalStyles";
import { View, Text } from "react-native";
import Icon from "../../components/Shared/Icon";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../../styles/colors";
import PropTypes from "prop-types";
import fonts from "../../styles/fonts";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const BigHeadingWithBackButton = (props) => {
  return (
    <View
      style={[globalStyle.bigHeadingTitleContainer, props.customContainerStyle]}
    >
      {props.isBackButton && (
        <TouchableOpacity
          style={[
            { flexDirection: "row", alignItems: "center", marginBottom: 8 },
            props.backButtonStyle,
          ]}
          onPress={props.onPress}
        >
          <Icon name="chevron-left" size={10} color={colors.black} />
          <Text style={globalStyle.bigHeadingWithBackButtonText}>
            {props.backButtonText}
          </Text>
        </TouchableOpacity>
      )}

      <Text
        style={[
          globalStyle.bigHeadingTitleText,
          props.bigTitleStyle ? props.bigTitleStyle : {},
        ]}
      >
        {props.bigTitleText}
      </Text>

      <Text
        style={{
          fontFamily: fonts.SimplonMonoLight,
          color: colors.black,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          fontSize: hp("2.0%"),
        }}
      >
        {props.lineText}
      </Text>
    </View>
  );
};

BigHeadingWithBackButton.propTypes = {
  bigTitleStyle: PropTypes.object,
  customBtnTitleStyle: PropTypes.object,
  bigTitleText: PropTypes.string,
  backButtonText: PropTypes.string,
  isBigTitle: PropTypes.bool.isRequired,
  isBackButton: PropTypes.bool.isRequired,
  customContainerStyle: PropTypes.object,
  backButtonStyle: PropTypes.object,
};
export default BigHeadingWithBackButton;
