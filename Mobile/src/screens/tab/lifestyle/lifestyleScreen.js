import React from 'react';
import {
  View,
  ScrollView,
  Text,
  ImageBackground,
} from "react-native";
import { useEffect } from "react";
import globalStyle from "../../../styles/globalStyles";
import { lifestyleStyle } from "../../../styles/tab/lifestyle/lifestyleStyle";
import { isActiveChallenge } from "../../../utils/challenges";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import BigHeadingWithBackButton from '../../../components/Shared/BigHeadingWithBackButton';
import Loader from "../../../components/Shared/Loader";
import colors from "../../../styles/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import fonts from "../../../styles/fonts";
import CustomBtn from "../../../components/Shared/CustomBtn";
import { HOMESCREENTILESIMG } from '../../../library/images/homeScreenTiles/homeScreenTiles';
import { useCounter } from '../../../library/useCustomHook/tab/lifestyle/lifestyleHook';

export const LifestyleScreen = ({ navigation }) => {

  const {
    loading,
    firstName,
    getProfile
  } = useCounter()

  useEffect(() => {
    getProfile()
  }, [])

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={lifestyleStyle.scrollView}
      style={[globalStyle.container]}
    >
      <View>
        <BigHeadingWithBackButton
          bigTitleText={firstName ? firstName : ""}
          lineText={'what do you need help with?'}
          isBackButton={false}
          isBigTitle={true}
          customContainerStyle={{ height: hp('15%') }}
        />
        <View>
          <View style={lifestyleStyle.cardContainer}>
            <TouchableOpacity style={lifestyleStyle.cardContainer} onPress={() => navigation.navigate("Nutrition")}>
              <ImageBackground
                source={HOMESCREENTILESIMG.LIFESTYLENUTRITION}
                style={lifestyleStyle.image}
              >
                <View style={lifestyleStyle.opacityLayer}>
                  <View style={lifestyleStyle.titleContainer}>
                    <Text style={lifestyleStyle.title}>Nutrition</Text>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </View>
          <View style={lifestyleStyle.cardContainer}>
            <TouchableOpacity style={lifestyleStyle.cardContainer} onPress={() => navigation.navigate("Workouts")}>
              <ImageBackground
                source={HOMESCREENTILESIMG.LIFESTYLEWORKOUT}
                style={lifestyleStyle.image}
                resizeMode="cover"
              >
                <View style={lifestyleStyle.opacityLayer}>
                  <View style={lifestyleStyle.titleContainer}>
                    <Text style={lifestyleStyle.title}>Workout</Text>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </View>
        <View style={lifestyleStyle.lookContainer}>
          <Text style={lifestyleStyle.title1}>Looking for more?</Text>
          <Text style={{ fontFamily: fonts.StyreneAWebRegular }}>Start a challenge</Text>
        </View>
        <View>
          <CustomBtn
            titleCapitalise={true}
            Title='Explore a challenge'
            customBtnStyle={lifestyleStyle.oblongBtnStyle}
            onPress={() => {
              isActiveChallenge().then((res) => {
                if (res) {
                  navigation.navigate("Calendar");
                } else {
                  navigation.navigate("ChallengeSubscription");
                }
              });
            }
            }
          />
        </View>
        <Loader loading={loading} color={colors.charcoal.standard} />
      </View>
    </ScrollView>
  );
}