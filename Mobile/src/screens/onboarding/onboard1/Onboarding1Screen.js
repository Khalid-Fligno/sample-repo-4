import React, { useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Modal from "react-native-modal";
import Loader from "../../../components/Shared/Loader";
import colors from "../../../styles/colors";
import fonts from "../../../styles/fonts";
import CustomBtn from "../../../components/Shared/CustomBtn";
import globalStyle from "../../../styles/globalStyles";
import Icon from "../../../components/Shared/Icon";
import { ONBOARDINGIMG } from "../../../library/images/onBoardingImg/onBoardingImg";
import moment from "moment-timezone"
import { styles } from "./style";
import { useCounter } from "../../../library/useCustomHook/onboarding/onboard1/index";

export const Onboarding1Screen = ({ navigation }) => {
  const { width } = Dimensions.get("window");
  const name = navigation.getParam("name", null)
  const specialOffer = navigation.getParam("specialOffer", undefined)
  const {
    loading,
    chosenDate,
    dobModalVisible,
    chosenUom,
    setChosenUom,
    setDate,
    handleSubmit,
    toggleDobModal,
    closeDobModal,
    setSpeciaOffer,
    setName
  } = useCounter()
  
  useEffect(() => {
		setSpeciaOffer(specialOffer)
    setName(name)
	}, [specialOffer, name])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.flexContainer}>
        <ImageBackground
          source={ONBOARDINGIMG.IZZY1}
          style={{ width: width, height: width / 2 }}
        >
          <View
            style={[
              globalStyle.opacityLayer,
              {
                alignItems: "flex-start",
                paddingStart: 20,
                backgroundColor: "none",
              },
            ]}
          >
            <Text style={styles.headerText}>Welcome</Text>
            <Text style={styles.bodyText}>
              It’s time to start your FitazFK journey! Just a few questions
              before we can start.
            </Text>
          </View>
        </ImageBackground>

        <View style={styles.contentContainer}>
          <View style={styles.inputFieldContainer}>
            <TouchableOpacity
              onPress={toggleDobModal}
              style={styles.inputButton}
            >
              <Text style={styles.inputSelectionText}>
                {chosenDate
                  ? moment(chosenDate).format("LL")
                  : "Enter date of birth"}
              </Text>
              <Icon
                name="chevron-down"
                size={19}
                color={colors.charcoal.light}
                style={{ textAlign: "right" }}
              />
            </TouchableOpacity>
            <Modal
              isVisible={dobModalVisible}
              onBackdropPress={closeDobModal}
              animationIn="fadeIn"
              animationInTiming={600}
              animationOut="fadeOut"
              animationOutTiming={600}
            >
              <View style={globalStyle.modalContainer}>
                <DateTimePicker
                  mode="date"
                  value={chosenDate ? chosenDate : new Date(1990, 0, 1)}
                  onChange={setDate}
                  minimumDate={new Date(1940, 0, 1)}
                  maximumDate={new Date(2008, 0, 1)}
                  itemStyle={{
                    fontFamily: fonts.standard,
                  }}
                />
                {Platform.OS === "ios" && (
                  <TouchableOpacity
                    title="DONE"
                    onPress={closeDobModal}
                    style={globalStyle.modalButton}
                  >
                    <Text style={globalStyle.modalButtonText}>DONE</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Modal>
          </View>
          <View style={styles.inputFieldContainer}>
            <Text style={styles.inputFieldTitle}>Units of measurement</Text>
            <View style={styles.buttonRowContainer}>
              <CustomBtn
                Title="Metric"
                outline={true}
                customBtnStyle={{
                  padding: 5,
                  width: "46%",
                  borderColor:
                    chosenUom === "metric"
                      ? colors.themeColor.color
                      : colors.themeColor.color,
                }}
                onPress={() => setChosenUom("metric")}
                customBtnTitleStyle={{
                  fontSize: 15,
                  marginLeft: 5,
                  color: chosenUom === "metric" ? colors.black : colors.black,
                }}
                leftIconColor={colors.black}
                leftIconSize={15}
                isLeftIcon={chosenUom === "metric" ? true : false}
                leftIconName="tick"
              />
              <CustomBtn
                Title="Imperial"
                outline={true}
                customBtnStyle={{
                  padding: 5,
                  width: "46%",
                  borderColor:
                    chosenUom === "imperial"
                      ? colors.themeColor.color
                      : colors.themeColor.color,
                }}
                onPress={() => setChosenUom("imperial")}
                customBtnTitleStyle={{
                  fontSize: 15,
                  marginLeft: 5,
                  color:
                    chosenUom === "imperial" ? colors.black : colors.black,
                }}
                leftIconColor={colors.black}
                leftIconSize={15}
                isLeftIcon={chosenUom === "imperial" ? true : false}
                leftIconName="tick"
              />
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <CustomBtn
            Title="Continue"
            customBtnStyle={{ padding: 15 }}
            onPress={() => handleSubmit(chosenDate, chosenUom)}
            customBtnTitleStyle={{ letterSpacing: fonts.letterSpacing }}
          />
        </View>
        <Loader loading={loading} color={colors.coral.standard} />
      </View>
    </SafeAreaView>
  );
}