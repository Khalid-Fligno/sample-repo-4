import React from "react";
import {
  Alert,
  Dimensions,
  ImageBackground,
  NativeModules,
  StyleSheet,
  View,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { Audio } from "expo-av";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import SplashScreen from "react-native-splash-screen";
import {
  validateReceiptProduction,
  validateReceiptSandbox,
  compare,
  compareInApp,
} from "../../config/apple";
import { restoreAndroidPurchases } from "../../config/android";
import { RestoreSubscriptions } from "../utils/subscription";
import { auth, db } from "../../config/firebase";
import { timerSound } from "../../config/audio";
import { hasChallenges, isActiveChallenge } from "../utils/challenges";
import { getBuildNumber, getVersion } from "react-native-device-info";
import { Platform } from "react-native";
import { Linking } from "react-native";
import { setRestImages } from "../utils/workouts";

const { InAppUtils } = NativeModules;
const { width } = Dimensions.get("window");

const cacheImages = (images) => {
  return images.map((image) => {
    return Asset.fromModule(image).downloadAsync();
  });
};

const cacheFonts = (fonts) => {
  return fonts.map((font) => {
    return Font.loadAsync(font);
  });
};

const cacheSound = async (sounds) => {
  await Audio.setIsEnabledAsync(true);
  return sounds.map(async (sound) => {
    const status = await timerSound.getStatusAsync();
    if (status.isLoaded === false) {
      timerSound.loadAsync(sound);
    }
  });
};

export default class AuthLoadingScreen extends React.PureComponent {
  componentDidMount = async () => {
    this.checkAppVersion();
    await setRestImages();
  };

  async checkAppVersion() {
    const versionCodeRef = db
      .collection("legalDocuments")
      .doc("qiF608JzXVcCpeiWccrC");
    const doc = await versionCodeRef.get();
    if (!doc.exists) {
      await this.loadAssetsAsync();
    } else {
      let appVersion = null;
      let appVersion2 = null;
      if (Platform.OS === "ios") {
        appVersion = String(doc.data().iosBuildVersion);
        appVersion2 = String(getVersion());
      } else {
        appVersion = Number(doc.data().androidBuildVersion);
        appVersion2 = Number(getBuildNumber());
      }
      if (appVersion === appVersion2) {
        // console.log("app up to date");
        await this.loadAssetsAsync();
      } else {
        SplashScreen.hide();

        const updateApp = () => {
          if (Platform.OS === "ios") {
            Linking.openURL(
              "https://apps.apple.com/in/app/fitazfk-fitness-nutrition/id1438373600"
            );
          } else {
            Linking.openURL(
              "https://play.google.com/store/apps/details?id=com.fitazfk.fitazfkapp"
            );
          }
        };
        await this.loadAssetsAsync();
      }
    }
  }

  loadAssetsAsync = async () => {
    const imageAssets = cacheImages([
      require("../../assets/icons/fitazfk-app-icon-gradient-dark.png"),
      require("../../assets/icons/fitazfk-splash-dark-logo.png"),
      require("../../assets/icons/fitazfk-icon-outline-white.png"),
      require("../../assets/icons/fitazfk-logo-outline-white.png"),
      require("../../assets/icons/apple-music-icon.png"),
      require("../../assets/icons/apple-icon-black.png"),
      require("../../assets/icons/spotify-icon.png"),
      require("../../assets/icons/facebook-icon-white.png"),
      require("../../assets/images/app-onboarding-carousel-1.jpg"),
      require("../../assets/images/app-onboarding-carousel-2.jpg"),
      require("../../assets/images/app-onboarding-carousel-3.jpg"),
      require("../../assets/images/app-onboarding-carousel-4.jpg"),
      require("../../assets/images/app-onboarding-carousel-5.jpg"),
      require("../../assets/images/signup-screen-background.jpg"),
      require("../../assets/images/subscription-screen-background.jpg"),
      require("../../assets/images/special-offer-screen-background.jpg"),
      require("../../assets/images/homeScreenTiles/home-screen-blog.jpg"),
      require("../../assets/images/homeScreenTiles/home-screen-shop-apparel-jumper.jpg"),
      require("../../assets/images/blog-header.jpg"),
      require("../../assets/images/shop-bundles.jpg"),
      require("../../assets/images/fitazfk-army.jpg"),
      require("../../assets/images/nutrition-breakfast.jpg"),
      require("../../assets/images/nutrition-lunch.jpg"),
      require("../../assets/images/nutrition-dinner.jpg"),
      require("../../assets/images/nutrition-snack.jpg"),
      require("../../assets/images/recipe-tile-skeleton.png"),
      require("../../assets/images/workouts-gym.jpg"),
      require("../../assets/images/workouts-gym-abt.jpg"),
      require("../../assets/images/workouts-gym-full.jpg"),
      require("../../assets/images/workouts-gym-upper.jpg"),
      require("../../assets/images/workouts-hiit.jpg"),
      require("../../assets/images/workouts-hiit-airdyne.jpg"),
      require("../../assets/images/workouts-hiit-rowing.jpg"),
      require("../../assets/images/workouts-hiit-running.jpg"),
      require("../../assets/images/workouts-hiit-skipping.jpg"),
      require("../../assets/images/workouts-home.jpg"),
      require("../../assets/images/workouts-home-abt.jpg"),
      require("../../assets/images/workouts-home-full.jpg"),
      require("../../assets/images/workouts-home-upper.jpg"),
      require("../../assets/images/workouts-outdoors.jpg"),
      require("../../assets/images/workouts-outdoors-abt.jpg"),
      require("../../assets/images/workouts-outdoors-full.jpg"),
      require("../../assets/images/workouts-outdoors-upper.jpg"),
      require("../../assets/images/workouts-resistance.jpg"),
      require("../../assets/images/hiit-rest-placeholder.jpg"),
      require("../../assets/images/profile-add.png"),
      require("../../assets/images/splitImages/NINA-1.jpg"),
      require("../../assets/images/splitImages/NINA-2.jpg"),
      require("../../assets/images/splitImages/NINA-3.jpg"),
      require("../../assets/images/splitImages/NINA-4.jpg"),
      require("../../assets/images/splitImages/SHARNIE-1.jpg"),
      require("../../assets/images/splitImages/SHARNIE-2.jpg"),
      require("../../assets/images/splitImages/SHARNIE-3.jpg"),
      require("../../assets/images/splitImages/SHARNIE-4.jpg"),
      require("../../assets/images/splitImages/ELLE-1.jpg"),
      require("../../assets/images/splitImages/ELLE-2.jpg"),
      require("../../assets/images/splitImages/ELLE-3.jpg"),
      require("../../assets/images/splitImages/ELLE-4.jpg"),
    ]);
    const fontAssets = cacheFonts([
      {
        GothamBold: require("../../assets/fonts/gotham-bold.otf"),
      },
      {
        GothamNarrowBold: require("../../assets/fonts/gotham-narrow-bold.otf"),
      },
      {
        GothamBook: require("../../assets/fonts/gotham-book.otf"),
      },
      {
        GothamBookItalic: require("../../assets/fonts/gotham-book-italic.otf"),
      },
      {
        GothamNarrowBook: require("../../assets/fonts/gotham-narrow-book.otf"),
      },
      {
        GothamUltraItalic: require("../../assets/fonts/gotham-ultra-italic.otf"),
      },
      {
        TuesdayNight: require("../../assets/fonts/tuesday-night.otf"),
      },
      {
        GothamLight: require("../../assets/fonts/Gotham-Light.otf"),
      },
      {
        GothamThin: require("../../assets/fonts/Gotham-Thin.otf"),
      },
      {
        GothamThinItalic: require("../../assets/fonts/Gotham-ThinItalic.otf"),
      },
      {
        GothamBookItalic: require("../../assets/fonts/Gotham-BookItalic.otf"),
      },
      {
        GothamMedium: require("../../assets/fonts/Gotham-Medium.otf"),
      },
      {
        SimplonMonoLight: require("../../assets/fonts/SimplonMono-Light.otf"),
      },
      {
        SimplonMonoMedium: require("../../assets/fonts/SimplonMono-Medium-Regular.otf"),
      },
      {
        StyreneAWebRegular: require("../../assets/fonts/StyreneAWeb-Regular.ttf"),
      },
      {
        StyreneAWebThin: require("../../assets/fonts/StyreneAWeb-Thin.ttf"),
      },
      {
        icomoon: require("../../assets/fonts/icomoon.ttf"),
      },
    ]);
    const soundAsset = cacheSound([require("../../assets/sounds/ding.mp3")]);
    await Promise.all([...imageAssets, ...fontAssets, soundAsset]);
    SplashScreen.hide();
    await this.cachingComplete();
  };
  goToAppScreen = async (doc) => {
    // RECEIPT STILL VALID
    // this.setState({ loading: false });
    if (await !doc.data().onboarded) {
      this.props.navigation.navigate("Onboarding1");
      return;
    }
    isActiveChallenge().then((res) => {
      if (res) this.props.navigation.navigate("Calendar");
      else this.props.navigation.navigate("App");
    });
  };
  // GRAND UNIFIED()
  cachingComplete = async () => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        unsubscribe();
        const { uid } = user;
        await AsyncStorage.setItem("uid", uid);
        const userRef = db.collection("users").doc(uid);
        userRef.get().then(async (doc) => {
          if (doc.exists) {
            if (await !doc.data().fitnessLevel) {
              await AsyncStorage.setItem("fitnessLevel", "1");
            } else {
              await AsyncStorage.setItem(
                "fitnessLevel",
                await doc.data().fitnessLevel.toString()
              );
            }
            const { subscriptionInfo = undefined, onboarded = false } =
              await doc.data();

            if (subscriptionInfo === undefined) {
              // console.log("uid",uid);
              if (await hasChallenges(uid)) {
                await this.goToAppScreen(doc);
              } else {
                // NO PURCHASE INFORMATION SAVED
                this.props.navigation.navigate("Subscription");
              }
            } else if (subscriptionInfo.expiry < Date.now()) {
              if (await hasChallenges(uid)) {
                await this.goToAppScreen(doc);
              } else {
                // EXPIRED
                if (subscriptionInfo.receipt) {
                  await this.storePurchase(subscriptionInfo, onboarded);
                } else {
                  this.props.navigation.navigate("Subscription");
                }
              }
            } else if (subscriptionInfo.expiry > Date.now()) {
              // RECEIPT STILL VALID
              await hasChallenges(uid);
              await this.goToAppScreen(doc);
            }
          } else {
            Alert.alert("Account data could not be found");
            this.props.navigation.navigate("Auth");
          }
        });
      } else {
        unsubscribe();
        this.props.navigation.navigate("Auth");
      }
    });
  };

  storePurchase = async (subscriptionInfo, onboarded) => {
    const restoreSubscriptions = new RestoreSubscriptions(this.props);
    if (!subscriptionInfo.platform) {
      subscriptionInfo.platform = "ios";
    }
    try {
      await restoreSubscriptions.restore(subscriptionInfo, onboarded);
    } catch (ex) {
      if (Platform.OS === "ios") {
        await this.restorePurchaseIOS(onboarded);
      } else if (Platform.OS === "android") {
        //await restoreSubscriptions.restore(subscriptionInfo, onboarded);
        await restoreAndroidPurchases(this.props);
      }
    }
  };

  restorePurchaseIOS = async (onboarded) => {
    InAppUtils.restorePurchases(async (error, response) => {
      if (error) {
        Alert.alert("iTunes Error", "Could not connect to iTunes store.");
        AsyncStorage.removeItem("uid");
        auth.signOut();
        this.props.navigation.navigate("Auth");
      } else {
        const uid = await AsyncStorage.getItem("uid");
        if (response.length === 0) {
          this.props.navigation.navigate("Subscription");
          return;
        }
        const sortedPurchases = response.slice().sort(compare);
        try {
          const validationData = await this.validate(
            sortedPurchases[0].transactionReceipt
          );
          if (validationData === undefined) {
            Alert.alert("Receipt validation error");
            return;
          }
          const sortedInApp = validationData.receipt.in_app
            .slice()
            .sort(compareInApp);
          if (sortedInApp[0] && sortedInApp[0].expires_date_ms > Date.now()) {
            // Alert.alert('Your subscription has been auto-renewed');
            const userRef = db.collection("users").doc(uid);
            const data = {
              subscriptionInfo: {
                receipt: sortedPurchases[0].transactionReceipt,
                expiry: sortedInApp[0].expires_date_ms,
                platform: Platform.OS,
              },
            };
            await userRef.set(data, { merge: true });
            if (onboarded) {
              this.props.navigation.navigate("App");
            } else {
              this.props.navigation.navigate("Onboarding1");
            }
          } else if (
            sortedInApp[0] &&
            sortedInApp[0].expires_date_ms < Date.now()
          ) {
            Alert.alert("Expired", "Your most recent subscription has expired");
            this.props.navigation.navigate("Subscription");
          } else {
            Alert.alert("Something went wrong");
            this.props.navigation.navigate("Subscription");
          }
        } catch (err) {
          Alert.alert("Error", "Could not retrieve subscription information");
          this.props.navigation.navigate("Subscription");
        }
      }
    });
  };

  validate = async (receiptData) => {
    const validationData = await validateReceiptProduction(receiptData).catch(
      async (error) => {
        if (error.redirect) {
          const validationDataSandbox = await validateReceiptSandbox(
            receiptData
          );
          return validationDataSandbox;
        }
        return undefined;
      }
    );
    return validationData;
  };
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("../../assets/icons/FITAZ_SplashScreen.png")}
          style={styles.background}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
});
