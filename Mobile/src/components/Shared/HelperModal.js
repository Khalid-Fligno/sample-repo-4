import React from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, Text } from "react-native";
import Modal from "react-native-modal";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";
import CustomBtn from "./CustomBtn";

const HelperModal = (props) => {
  const {
    helperModalVisible,
    hideHelperModal,
    headingText,
    bodyText,
    bodyText2,
    bodyText3,
    color,
  } = props;

  return (
    <Modal
      isVisible={helperModalVisible}
      animationIn="fadeIn"
      animationInTiming={400}
      animationOut="fadeOut"
      animationOutTiming={400}
    >
      <View style={styles.helperModalContainer}>
        <View style={styles.helperModalTextContainer}>
          <Text style={styles.modalHeaderText}>{headingText}</Text>
          <Text style={styles.modalBodyText}>{bodyText}</Text>
          {bodyText2 && <Text style={styles.modalBodyText}>{bodyText2}</Text>}
          {bodyText3 && <Text style={styles.modalBodyText}>{bodyText3}</Text>}
        </View>
        <View style={styles.helperModalButtonContainer}>
          <CustomBtn
            onPress={hideHelperModal}
            outline={true}
            titleCapitalise={true}
            Title="OK, GOT IT!"
            customBtnStyle={{ borderRadius: 50, margin: 10 }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default HelperModal;

HelperModal.propTypes = {
  helperModalVisible: PropTypes.bool.isRequired,
  hideHelperModal: PropTypes.func.isRequired,
  headingText: PropTypes.string.isRequired,
  bodyText: PropTypes.string.isRequired,
  bodyText2: PropTypes.string,
  bodyText3: PropTypes.string,
  color: PropTypes.string,
};

HelperModal.defaultProps = {
  bodyText2: undefined,
  bodyText3: undefined,
  color: undefined,
};

const styles = StyleSheet.create({
  helperModalContainer: {
    flexShrink: 1,
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 4,
    overflow: "hidden",
  },
  helperModalTextContainer: {
    width: "100%",
    backgroundColor: colors.white,
    justifyContent: "space-between",
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 10,
  },
  modalHeaderText: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.charcoal.light,
    marginBottom: 10,
  },
  modalBodyText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.light,
    marginRight: 5,
    marginBottom: 15,
  },
  helperModalButtonContainer: {
    backgroundColor: colors.white,
    width: "100%",
  },
  modalButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.charcoal.standard,
    height: 50,
    width: "100%",
  },
  modalButtonCoral: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.themeColor.color,
    height: 50,
    width: "100%",
  },

  modalThemeButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.themeColor.color,
    height: 50,
    width: "100%",
  },
  modalButtonText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    marginTop: 3,
  },
});
