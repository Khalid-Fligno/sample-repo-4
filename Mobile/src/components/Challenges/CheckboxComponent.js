import React from "react";
import PropTypes from "prop-types";
import { View, Text } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";

const CheckboxComponent = ({ title, isChecked, onPress }) => {
  return (
    <View style={{ marginTop: 20 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              marginVertical: 5,
              fontFamily: fonts.StyreneAWebRegular,
              fontSize: 20,
              color: colors.black,
              marginRight: 40,
            }}
          >
            {title}
          </Text>
        </View>
        <View>
          <BouncyCheckbox
            size={35}
            disableText={true}
            isChecked={isChecked}
            fillColor={colors.coolIce}
            iconStyle={{ borderColor: colors.coolIce }}
            onPress={onPress}
            style={{ marginRight: 10 }}
          />
        </View>
      </View>
    </View>
  );
};

CheckboxComponent.propTypes = {
  title: PropTypes.string.isRequired,
  isChecked: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default CheckboxComponent;
