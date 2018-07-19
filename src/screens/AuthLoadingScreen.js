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
      require('../../assets/images/recipes/baked-eggs-1024x768.png'),
      require('../../assets/images/landing-page-1.png'),
      require('../../assets/images/landing-screen-carousel-1.png'),
      require('../../assets/images/landing-screen-carousel-2.png'),
      require('../../assets/images/landing-screen-carousel-3.png'),
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
        GothamBook: require('../../assets/fonts/gotham-book.otf'),
      },
      {
        GothamNarrowLight: require('../../assets/fonts/gotham-narrow-light.otf'),
      },
      {
        icomoon: require('../../assets/fonts/icomoon.ttf'),
      },
    ]);
    await Promise.all([...imageAssets, ...fontAssets]);
  }
  cachingComplete = async () => {
    this.props.navigation.navigate('NutritionHome');
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
