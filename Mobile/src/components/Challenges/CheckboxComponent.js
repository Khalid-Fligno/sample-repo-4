import React, { createRef, useState } from "react";
import PropTypes from "prop-types";
import { View, Text } from "react-native";
// import BouncyCheckbox from "react-native-bouncy-checkbox";
import BouncyCheckbox from "./../../../node_modules/react-native-bouncy-checkbox/lib/BouncyCheckbox";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";
import { TouchableWithoutFeedback } from "react-native";

const CheckboxComponent = ({ title, isChecked, onPress }) => {
  let checkboxRef = createRef();
  const [checked, setChecked] = useState(isChecked);
  return (
    <View style={{ marginTop: 20 }}>
      <TouchableWithoutFeedback
        onPress={() => {
          onPress(!checked);
          checkboxRef?.onPress();
        }}
      >
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
              ref={(ref) => {
                checkboxRef = ref;
              }}
              size={35}
              disableText={true}
              isChecked={checked}
              fillColor={colors.themeColor.color}
              iconStyle={{ borderColor: colors.coolIce }}
              style={{ marginRight: 10 }}
              onPress={() => setChecked(!checked)}
              disableBuiltInState
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

CheckboxComponent.propTypes = {
  title: PropTypes.string.isRequired,
  isChecked: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default CheckboxComponent;
