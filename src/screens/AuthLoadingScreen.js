import React from 'react';
import { Alert, NativeModules } from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { validateReceiptProduction, validateReceiptSandbox, compareExpiry } from '../../config/apple';
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
      require('../../assets/icons/apple-music-icon.png'),
      require('../../assets/icons/spotify-icon.png'),
      require('../../assets/icons/facebook-icon-white.png'),
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
  cachingComplete = async () => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        unsubscribe();
        const { uid } = user;
        db.collection('users').doc(uid)
          .get()
          .then(async (doc) => {
            InAppUtils.receiptData(async (error, receiptData) => {
              if (error) {
                Alert.alert('itunes Error', 'Receipt not found.');
                this.props.navigate('Subscription');
              } else {
                const validationData = await this.validate(receiptData);
                if (validationData === undefined) {
                  this.props.navigation.navigate('Subscription');
                }
                const sortedReceipts = validationData.latest_receipt_info.slice().sort(compareExpiry);
                const isSubscribed = sortedReceipts[0].expires_date_ms > Date.now();
                if (isSubscribed && await doc.data().onboarded) {
                  this.props.navigation.navigate('App');
                } else if (isSubscribed && await !doc.data().onboarded) {
                  this.props.navigation.navigate('Onboarding1');
                } else {
                  this.props.navigation.navigate('Subscription');
                }
              }
            });
          });
      } else {
        unsubscribe();
        this.props.navigation.navigate('Auth');
      }
    });
  }
  validate = async (receiptData) => {
    const validationData = await validateReceiptProduction(receiptData).catch(async (err) => {
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
