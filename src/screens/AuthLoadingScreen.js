import React from 'react';
import {
  Alert,
  NativeModules,
} from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import {
  validateReceiptProduction,
  validateReceiptSandbox,
  compare,
} from '../../config/apple';
import { auth, db } from '../../config/firebase';

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
      require('../../assets/icons/fitazfk-icon-solid-white.png'),
      require('../../assets/images/landing-page-1.png'),
      require('../../assets/images/landing-page-2.jpg'),
      require('../../assets/images/landing-page-3.jpg'),
      require('../../assets/images/landing-page-4.jpg'),
      require('../../assets/images/landing-screen-carousel-1.png'),
      require('../../assets/images/landing-screen-carousel-2.png'),
      require('../../assets/images/landing-screen-carousel-3.png'),
      require('../../assets/images/fitazfk-blog-sleep.jpg'),
      require('../../assets/images/fitazfk-blog-mindset.jpg'),
      require('../../assets/images/shop-bundles.jpg'),
      require('../../assets/images/fitazfk-army.jpg'),
      // require('../../assets/images/workouts-core.jpg'),
      // require('../../assets/images/workouts-upper.jpg'),
      // require('../../assets/images/workouts-lower.jpg'),
      // require('../../assets/images/workouts-full.jpg'),
      // require('../../assets/images/workouts-home.jpg'),
      // require('../../assets/images/workouts-gym.jpg'),
      // require('../../assets/images/workouts-park.jpg'),
      require('../../assets/images/workouts-blank-tile.png'),
      require('../../assets/images/nutrition-breakfast.jpg'),
      require('../../assets/images/nutrition-lunch.jpg'),
      require('../../assets/images/nutrition-dinner.jpg'),
      require('../../assets/images/nutrition-snack.jpg'),
      require('../../assets/images/recipe-tile-skeleton.png'),
      require('../../assets/icons/apple-music-icon.png'),
      require('../../assets/icons/spotify-icon.png'),
      require('../../assets/icons/facebook-icon-white.png'),
      require('../../assets/images/profile-add.png'),
    ]);
    const fontAssets = cacheFonts([
      {
        GothamBold: require('../../assets/fonts/gotham-bold.otf'),
      },
      {
        GothamBoldItalic: require('../../assets/fonts/gotham-bold-italic.otf'),
      },
      {
        GothamMedium: require('../../assets/fonts/gotham-medium.otf'),
      },
      {
        GothamBook: require('../../assets/fonts/gotham-book.otf'),
      },
      {
        GothamNarrowLight: require('../../assets/fonts/gotham-narrow-light.otf'),
      },
      {
        Knucklebones: require('../../assets/fonts/dk-knucklebones.otf'),
      },
      {
        icomoon: require('../../assets/fonts/icomoon.ttf'),
      },
    ]);
    await Promise.all([...imageAssets, ...fontAssets]);
  }
  // // Include payments
  cachingComplete = async () => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        unsubscribe();
        const { uid } = user;
        db.collection('users').doc(uid)
          .get()
          .then(async (doc) => {
            const { subscriptionInfo } = await doc.data();
            if (subscriptionInfo === undefined) {
              // NO PURCHASE INFORMATION SAVED
              this.props.navigation.navigate('Subscription');
            } else if (subscriptionInfo.expiry < Date.now()) {
              // EXPIRED
              InAppUtils.restorePurchases(async (error, response) => {
                if (error) {
                  Alert.alert('iTunes Error', 'Could not connect to iTunes store.');
                } else {
                  const sortedPurchases = response.slice().sort(compare);
                  try {
                    const validationData = await this.validate(sortedPurchases[0].transactionReceipt);
                    if (validationData === undefined) {
                      Alert.alert('Receipt validation error');
                    }
                    if (validationData.latest_receipt_info && validationData.latest_receipt_info.expires_date > Date.now()) {
                      Alert.alert('Your subscription has been auto-renewed');
                      const userRef = db.collection('users').doc(uid);
                      const data = {
                        subscriptionInfo: {
                          receipt: sortedPurchases[0].transactionReceipt,
                          expiry: validationData.latest_receipt_info.expires_date,
                        },
                      };
                      await userRef.set(data, { merge: true });
                      this.props.navigation.navigate('App');
                    } else {
                      Alert.alert('Something went wrong');
                      this.props.navigation.navigate('Subscription');
                    }
                  } catch (err) {
                    // MOST RECENT RECEIPT VALID BUT EXPIRED (USER HAS CANCELLED)
                    Alert.alert('Subscription has been cancelled');
                    this.props.navigation.navigate('Subscription');
                  }
                }
              });
            } else {
              // RECEIPT STILL VALID
              this.props.navigation.navigate('App');
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
  //           if (await doc.data().fitnessLevel) {
  //             await AsyncStorage.setItem('fitnessLevel', await doc.data().fitnessLevel.toString());
  //           }
  //           if (await doc.data().onboarded !== true) {
  //             this.props.navigation.navigate('Onboarding1');
  //           } else {
  //             this.props.navigation.navigate('App');
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
