import React, { useEffect } from "react";
import {
  SafeAreaView,
  View,
  StatusBar,
  ImageBackground,
  Platform,
  Text
} from "react-native";
import fonts from "../../../styles/fonts";
import colors from "../../../styles/colors";
import CustomBtn from "../../../components/Shared/CustomBtn";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import { styles } from "./style";
import { getVersion } from "react-native-device-info";
import { checkVersion } from "react-native-check-version";
import { db } from "../../../config/firebase";
import { useStorage } from "../../../hook/storage";

export const LandingScreen = ({ navigation }) => {

  const specialOffer = navigation.getParam("specialOffer", undefined)

  const checkAppVersion = async () => {
    const uid = await useStorage.getItem('uid');
    if (uid) {
      const version = await checkVersion();
      console.log('version: ', version)
      await db
        .collection("users")
        .doc(uid)
        .set({
          AppVersionUse:
            Platform.OS === "ios"
              ? String(version.version)
              : String(getVersion()),
        },
          { merge: true }
        );
    }
  }

  useEffect(() => {
    checkAppVersion();
  }, [])

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        <View style={styles.carouselCardContainer}>

          <View style={styles.padding}>
            <ImageBackground
              source={require("../../../assets/icons/FITAZ_BrandMark.png")}
              style={styles.carouselImageBackground}
            >
            </ImageBackground>
            <View style={styles.textPadding}>
              <Text style={styles.fontText}>em
                <Text style={styles.underline}>powered</Text>
              </Text>
              <Text style={styles.fontText}>by you.</Text>
            </View>
          </View>

          <View style={{ paddingBottom: hp("2%") }}>
            <TouchableOpacity onPress={() =>
              navigation.navigate("FindAccount")}
            >
              <View style={styles.transformProgram}>
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.Text}>I have just purchased my {"\n"}1st Transform Program</Text>
                </View>
                <View style={{ marginRight: 10 }}>
                  <Icon name="angle-right" size={45} />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity onPress={() =>
              navigation.navigate("Signup", { specialOffer })}
            >
              <View style={styles.transformProgram}>
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.Text}>I want to do a 7 day free {"\n"}trial of the Fitaz App </Text>
                </View>
                <View style={{ marginRight: 10 }}>
                  <Icon name="angle-right" size={45} />
                </View>
              </View>
            </TouchableOpacity>
          </View>

        </View>
        <View style={styles.absoluteButtonContainer}>
          <View style={styles.buttonContainer}>
            <View style={{
              paddingTop: hp("2%"),
              paddingBottom: hp("2%"),
              alignItems: 'center'
            }}>
              <Text
                style={{ fontSize: hp("1.9%"), fontFamily: fonts.SimplonMonoMedium, }}
              >Already have an account?</Text>
            </View>
            <CustomBtn
              customBtnStyle={{
                padding: 12,
                margin: 5,
                borderColor: colors.themeColor.color,
              }}
              outline={false}
              Title="SIGN IN"
              customBtnTitleStyle={{ color: colors.black }}
              onPress={() =>
                navigation.navigate("Login", { specialOffer })
              }
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}