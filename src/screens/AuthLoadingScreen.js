import React from 'react';
import {
  Alert,
  NativeModules,
  AsyncStorage,
} from 'react-native';
import {
  AppLoading,
  Asset,
  Font,
  Audio,
} from 'expo';
import {
  validateReceiptProduction,
  validateReceiptSandbox,
  compare,
} from '../../config/apple';
import { auth, db } from '../../config/firebase';
import { timerSound } from '../../config/audio';

const { InAppUtils } = NativeModules;

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

export default class AuthLoadingScreen extends React.PureComponent {
  loadAssetsAsync = async () => {
    const imageAssets = cacheImages([
      require('../../assets/icons/fitazfk-app-icon-gradient-dark.png'),
      require('../../assets/icons/fitazfk-splash-dark-logo.png'),
      require('../../assets/icons/fitazfk-icon-outline-white.png'),
      require('../../assets/icons/fitazfk-logo-outline-white.png'),
      require('../../assets/icons/apple-music-icon.png'),
      require('../../assets/icons/spotify-icon.png'),
      require('../../assets/icons/facebook-icon-white.png'),
      require('../../assets/images/app-onboarding-carousel-1.jpg'),
      require('../../assets/images/app-onboarding-carousel-2.jpg'),
      require('../../assets/images/app-onboarding-carousel-3.jpg'),
      require('../../assets/images/app-onboarding-carousel-4.jpg'),
      require('../../assets/images/app-onboarding-carousel-5.jpg'),
      require('../../assets/images/signup-screen-background.jpg'),
      require('../../assets/images/homeScreenTiles/home-screen-blog.jpg'),
      require('../../assets/images/homeScreenTiles/home-screen-shop-apparel-jumper.jpg'),
      require('../../assets/images/subscription-screen-background.jpg'),
      require('../../assets/images/blog-header.jpg'),
      require('../../assets/images/shop-bundles.jpg'),
      require('../../assets/images/fitazfk-army.jpg'),
      require('../../assets/images/nutrition-breakfast.jpg'),
      require('../../assets/images/nutrition-lunch.jpg'),
      require('../../assets/images/nutrition-dinner.jpg'),
      require('../../assets/images/nutrition-snack.jpg'),
      require('../../assets/images/recipe-tile-skeleton.png'),
      require('../../assets/images/workouts-gym.jpg'),
      require('../../assets/images/workouts-gym-abt.jpg'),
      require('../../assets/images/workouts-gym-full.jpg'),
      require('../../assets/images/workouts-gym-upper.jpg'),
      require('../../assets/images/workouts-hiit.jpg'),
      require('../../assets/images/workouts-hiit-airdyne.jpg'),
      require('../../assets/images/workouts-hiit-rowing.jpg'),
      require('../../assets/images/workouts-hiit-running.jpg'),
      require('../../assets/images/workouts-hiit-skipping.jpg'),
      require('../../assets/images/workouts-home.jpg'),
      require('../../assets/images/workouts-home-abt.jpg'),
      require('../../assets/images/workouts-home-full.jpg'),
      require('../../assets/images/workouts-home-upper.jpg'),
      require('../../assets/images/workouts-outdoors.jpg'),
      require('../../assets/images/workouts-outdoors-abt.jpg'),
      require('../../assets/images/workouts-outdoors-full.jpg'),
      require('../../assets/images/workouts-outdoors-upper.jpg'),
      require('../../assets/images/workouts-resistance.jpg'),
      require('../../assets/images/hiit-rest-placeholder.jpg'),
      require('../../assets/images/profile-add.png'),
      require('../../assets/images/splitImages/NINA-1.jpg'),
      require('../../assets/images/splitImages/NINA-2.jpg'),
      require('../../assets/images/splitImages/NINA-3.jpg'),
      require('../../assets/images/splitImages/NINA-4.jpg'),
      require('../../assets/images/splitImages/SHARNIE-1.jpg'),
      require('../../assets/images/splitImages/SHARNIE-2.jpg'),
      require('../../assets/images/splitImages/SHARNIE-3.jpg'),
      require('../../assets/images/splitImages/SHARNIE-4.jpg'),
      require('../../assets/images/splitImages/ELLE-1.jpg'),
      require('../../assets/images/splitImages/ELLE-2.jpg'),
      require('../../assets/images/splitImages/ELLE-3.jpg'),
      require('../../assets/images/splitImages/ELLE-4.jpg'),
    ]);
    const fontAssets = cacheFonts([
      {
        GothamBold: require('../../assets/fonts/gotham-bold.otf'),
      },
      {
        GothamNarrowBold: require('../../assets/fonts/gotham-narrow-bold.otf'),
      },
      {
        GothamBook: require('../../assets/fonts/gotham-book.otf'),
      },
      {
        GothamBookItalic: require('../../assets/fonts/gotham-book-italic.otf'),
      },
      {
        GothamNarrowBook: require('../../assets/fonts/gotham-narrow-book.otf'),
      },
      {
        GothamUltraItalic: require('../../assets/fonts/gotham-ultra-italic.otf'),
      },
      {
        TuesdayNight: require('../../assets/fonts/tuesday-night.otf'),
      },
      {
        icomoon: require('../../assets/fonts/icomoon.ttf'),
      },
    ]);
    await Promise.all([...imageAssets, ...fontAssets]);
  }
  // Include payments
  cachingComplete = async () => {
    Audio.setIsEnabledAsync(true);
    timerSound.loadAsync(require('../../assets/sounds/ding.mp3'));
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        unsubscribe();
        const { uid } = user;
        db.collection('users').doc(uid)
          .get()
          .then(async (doc) => {
            if (doc.exists) {
              if (await doc.data().fitnessLevel !== undefined) {
                await AsyncStorage.setItem('fitnessLevel', await doc.data().fitnessLevel.toString());
              } else {
                await AsyncStorage.setItem('fitnessLevel', '1');
              }
              const { subscriptionInfo, onboarded } = await doc.data();
              if (subscriptionInfo === undefined) {
                // NO PURCHASE INFORMATION SAVED
                this.props.navigation.navigate('Subscription');
              } else if (subscriptionInfo.expiry < Date.now()) {
                // EXPIRED
                InAppUtils.restorePurchases(async (error, response) => {
                  if (error) {
                    Alert.alert('iTunes Error', 'Could not connect to iTunes store.');
                    AsyncStorage.removeItem('uid');
                    auth.signOut();
                    this.props.navigation.navigate('Auth');
                  } else {
                    if (response.length === 0) {
                      this.props.navigation.navigate('Subscription');
                      return;
                    }
                    const sortedPurchases = response.slice().sort(compare);
                    try {
                      const validationData = await this.validate(sortedPurchases[0].transactionReceipt);
                      if (validationData === undefined) {
                        Alert.alert('Receipt validation error');
                        return;
                      }
                      if (validationData.latest_receipt_info && validationData.latest_receipt_info.expires_date > Date.now()) {
                        // Alert.alert('Your subscription has been auto-renewed');
                        const userRef = db.collection('users').doc(uid);
                        const data = {
                          subscriptionInfo: {
                            receipt: sortedPurchases[0].transactionReceipt,
                            expiry: validationData.latest_receipt_info.expires_date,
                          },
                        };
                        await userRef.set(data, { merge: true });
                        if (onboarded) {
                          this.props.navigation.navigate('App');
                        } else {
                          this.props.navigation.navigate('Onboarding1');
                        }
                      } else {
                        Alert.alert('Something went wrong');
                        this.props.navigation.navigate('Subscription');
                      }
                    } catch (err) {
                      // MOST RECENT RECEIPT VALID BUT EXPIRED (USER HAS CANCELLED)
                      Alert.alert('Your subscription has expired');
                      this.props.navigation.navigate('Subscription');
                    }
                  }
                });
              } else if (subscriptionInfo.expiry > Date.now()) {
                // RECEIPT STILL VALID
                if (onboarded) {
                  this.props.navigation.navigate('App');
                } else {
                  this.props.navigation.navigate('Onboarding1');
                }
              }
            } else {
              Alert.alert('Account data could not be found');
              this.props.navigation.navigate('Auth');
            }
          });
      } else {
        unsubscribe();
        this.props.navigation.navigate('Auth');
      }
    });
  }
  // WITHOUT PAYMENT (FOR TESTING PURPOSES)
  // cachingComplete = async () => {
  //   const unsubscribe = auth.onAuthStateChanged(async (user) => {
  //     if (user) {
  //       unsubscribe();
  //       const { uid } = user;
  //       await db.collection('users').doc(uid)
  //         .get()
  //         .then(async (doc) => {
  //           if (doc.exists) {
  //             if (await doc.data().fitnessLevel !== undefined) {
  //               await AsyncStorage.setItem('fitnessLevel', await doc.data().fitnessLevel.toString());
  //             }
  //             if (await doc.data().onboarded !== true) {
  //               this.props.navigation.navigate('Onboarding1');
  //             } else {
  //               this.props.navigation.navigate('App');
  //             }
  //           } else {
  //             Alert.alert('Account data could not be found');
  //             this.props.navigation.navigate('Auth');
  //           }
  //         });
  //     } else {
  //       unsubscribe();
  //       this.props.navigation.navigate('Auth');
  //     }
  //   });
  // }
  validate = async (receiptData) => {
    const validationData = await validateReceiptProduction(receiptData).catch(async () => {
      const validationDataSandbox = await validateReceiptSandbox(receiptData);
      return validationDataSandbox;
    });
    if (validationData !== undefined) {
      return validationData;
    }
    return undefined;
  }
  render() {
    return (
      <AppLoading
        startAsync={this.loadAssetsAsync}
        onFinish={() => this.cachingComplete()}
      />
    );
  }
}
