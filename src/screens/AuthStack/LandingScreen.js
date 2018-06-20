import React from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';

const { width } = Dimensions.get('window');

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
        <StatusBar
          barStyle="light-content"
        />
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
              flex: 1,
              position: 'absolute',
              height: '100%',
              width: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: colors.white,
              }}
            >
              Logo here
            </Text>
          </View>
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
            borderRadius: 3,
          }}
        >
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Signup')}
            activeOpacity={0.6}
            style={{
              flex: 1,
              marginRight: 5,
              backgroundColor: colors.coral.standard,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
              borderWidth: 4,
              borderColor: colors.coral.standard,
              shadowColor: colors.charcoal.dark,
              shadowOpacity: 0.7,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 3,
            }}
          >
            <Text
              style={{
                marginTop: 4,
                color: colors.white,
                fontFamily: fonts.bold,
                fontSize: 15,
              }}
            >
              SIGN UP
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Login')}
            activeOpacity={0.6}
            style={{
              flex: 1,
              marginLeft: 5,
              backgroundColor: 'white',
              borderColor: colors.coral.standard,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 4,
              borderRadius: 4,
              shadowColor: colors.charcoal.dark,
              shadowOpacity: 0.5,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 3,
            }}
          >
            <Text
              style={{
                marginTop: 4,
                color: colors.coral.standard,
                fontFamily: fonts.bold,
                fontSize: 15,
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
