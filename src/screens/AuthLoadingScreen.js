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
      require('../../assets/images/fitazfk-app-icon-dark.png'),
      require('../../assets/images/fitazfk-splash-dark.png'),
      require('../../assets/images/yazzy-colour-mask.png'),
      require('../../assets/images/yazzy.png'),
      require('../../assets/images/yazzy2.png'),
      require('../../assets/images/yazzy3.png'),
      require('../../assets/icons/fitazfk-icon-solid-white.png'),
      require('../../assets/icons/fitazfk-icon-outline.png'),
    ]);
    const fontAssets = cacheFonts([
      {
        GothamBold: require('../../assets/fonts/gotham-bold.otf'),
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
