import React from "react";
import { Platform } from "react-native";
import { View, Text } from "react-native";
import { DotIndicator } from "react-native-indicators";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import colors from "../../styles/colors";
import globalStyle from "../../styles/globalStyles";
import PropTypes from "prop-types";
import Modal from "react-native-modal";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TouchableOpacity } from "react-native";

const CalendarModal = (props) => {
  const {
    isVisible,
    onBackdropPress,
    value,
    onChange,
    onPress,
    addingToCalendar,
    loading,
    title
  } = props;

  return (
    <View>
      {Platform.OS === "ios" && (
        <Modal
          isVisible={isVisible}
          animationIn="fadeIn"
          animationInTiming={600}
          animationOut="fadeOut"
          animationOutTiming={600}
          onBackdropPress={onBackdropPress}
        >
          <View style={globalStyle.modalContainer}>
            <DateTimePicker
              mode="date"
              value={value}
              onChange={onChange}
              style={{ marginLeft: wp("6.5%") }}
            />

            <TouchableOpacity onPress={onPress} style={globalStyle.modalButton}>
              {addingToCalendar ? (
                <DotIndicator color={colors.white} count={3} size={6} />
              ) : (
                <Text style={globalStyle.modalButtonText}>{title}</Text>
              )}
            </TouchableOpacity>
          </View>
        </Modal>
      )}
      {Platform.OS === "android" && isVisible && !loading && (
        <DateTimePicker mode="date" value={value} onChange={onChange} />
      )}
    </View>
  );
};

CalendarModal.propTypes = {
  isVisible: PropTypes.bool,
  onBackdropPress: PropTypes.func,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onPress: PropTypes.func,
  addingToCalendar: PropTypes.bool,
  loading: PropTypes.bool,
};
export default CalendarModal;
