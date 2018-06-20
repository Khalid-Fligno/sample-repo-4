import React from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';

const { width, height } = Dimensions.get('window');

export default class LandingScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0)',
          }}
        >
          <Image
            source={require('../../../assets/images/landing-page-1.png')}
            resizeMode="cover"
            style={{
              flex: 1,
              width,
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height,
              width,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            width,
            height: 70,
            backgroundColor: colors.white,
            borderColor: colors.grey.light,
            borderWidth: 1,
            padding: 10,
            borderRadius: 2,
          }}
        >
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Signup')}
            style={{
              flex: 1,
              marginRight: 5,
              backgroundColor: colors.charcoal.standard,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
              borderWidth: 4,
              borderColor: colors.charcoal.standard,
            }}
          >
            <Text
              style={{
                marginTop: 3,
                color: colors.white,
                fontFamily: fonts.bold,
                fontSize: 16,
              }}
            >
              SIGN UP
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Login')}
            style={{
              flex: 1,
              marginLeft: 5,
              backgroundColor: 'white',
              borderColor: colors.charcoal.standard,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 4,
              borderRadius: 4,
            }}
          >
            <Text
              style={{
                marginTop: 3,
                color: colors.charcoal.standard,
                fontFamily: fonts.bold,
                fontSize: 16,
              }}
            >
              LOG IN
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
