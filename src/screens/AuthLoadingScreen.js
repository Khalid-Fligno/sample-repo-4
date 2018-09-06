import React from 'react';
import { AppLoading, Asset, Font } from 'expo';

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
      require('../../assets/icons/fitazfk-app-icon-dark.png'),
      require('../../assets/icons/fitazfk-splash-dark.png'),
      require('../../assets/icons/fitazfk-icon-solid-white.png'),
      require('../../assets/images/recipes/baked-eggs.png'),
      require('../../assets/images/landing-page-1.png'),
      require('../../assets/images/landing-page-2.jpg'),
      require('../../assets/images/landing-page-3.jpg'),
      require('../../assets/images/landing-page-4.jpg'),
      require('../../assets/images/landing-screen-carousel-1.png'),
      require('../../assets/images/landing-screen-carousel-2.png'),
      require('../../assets/images/landing-screen-carousel-3.png'),
      require('../../assets/images/workouts-core.jpg'),
      require('../../assets/images/workouts-upper.jpg'),
      require('../../assets/images/workouts-lower.jpg'),
      require('../../assets/images/workouts-full.jpg'),
      require('../../assets/images/workouts-home.jpg'),
      require('../../assets/images/workouts-gym.jpg'),
      require('../../assets/images/workouts-park.jpg'),
      require('../../assets/images/nutrition-breakfast.jpg'),
      require('../../assets/images/nutrition-lunch.jpg'),
      require('../../assets/images/nutrition-dinner.jpg'),
      require('../../assets/images/nutrition-snack.jpg'),
      require('../../assets/videos/burpees-trimmed.mp4'),
      require('../../assets/videos/burpees-trimmed-square.mp4'),
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
    this.props.navigation.navigate('Auth');
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
