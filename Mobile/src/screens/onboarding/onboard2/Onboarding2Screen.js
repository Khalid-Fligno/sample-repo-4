import React, { useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
} from "react-native";
import globalStyle from "../../../styles/globalStyles";
import colors from "../../../styles/colors";
import Loader from "../../../components/Shared/Loader";
import FitnessLevelCard from "../../../components/Onboarding/FitnessLevelCard";
import BigHeadingWithBackButton from "../../../components/Shared/BigHeadingWithBackButton";
import fonts from "../../../styles/fonts";
import { styles } from "./style";
import { useCounter } from "../../../library/useCustomHook/onboarding/onboard2";

export const Onboarding2Screen = ({ navigation }) => {
  const name = navigation.getParam("name", null)
  const specialOffer = navigation.getParam("specialOffer", undefined)
  const {
    loading,
    handleSubmit,
    setSpeciaOffer,
    setName
  } = useCounter()

  useEffect(() => {
    setSpeciaOffer(specialOffer)
    setName(name)
  }, [specialOffer, name])

  return (
    <SafeAreaView style={styles.container}>
      <View style={[globalStyle.container]}>
        <ScrollView
          contentContainerStyle={styles.contentContainerStyle}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <BigHeadingWithBackButton
            bigTitleText="Intensity"
            isBackButton={false}
            isBigTitle={true}
            customContainerStyle={styles.customContainerStyle}
          />
          <Text style={{ fontFamily: fonts.standard, fontSize: 15 }}>
            How often do you currently train.
          </Text>

          <FitnessLevelCard
            onPress={() => handleSubmit(1)}
            title="0-2 times a week"
            helpText="Train once a week"
            isCardColored={true}
            cardColor={colors.coolIce}
          />
          <FitnessLevelCard
            onPress={() => handleSubmit(2)}
            title="2-3 times a week"
            helpText="Train 2 to 3 times a week"
            isCardColored={true}
            cardColor={colors.coolIce}
          />
          <FitnessLevelCard
            onPress={() => handleSubmit(3)}
            title="4+ times a week"
            helpText="Train 4+ times a week"
            isCardColored={true}
            cardColor={colors.coolIce}
          />
        </ScrollView>
        <Loader loading={loading} color={colors.coral.standard} />
      </View>
    </SafeAreaView>
  );
}