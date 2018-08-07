import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

export default class HomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <View
        style={styles.container}
      >
        <View
          style={{
            flex: 1,
            alignItems: 'flex-start',
            paddingTop: 7.5,
            paddingBottom: 7.5,
          }}
        >
          <TouchableOpacity
            onPress={() => Linking.openURL('https://www.fitazfkblog.com/')}
            style={{
              flex: 1,
              width: width - 30,
              marginTop: 7.5,
              marginBottom: 7.5,
              borderRadius: 4,
              shadowColor: colors.black,
              shadowOpacity: 0.8,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 5,
            }}
          >
            <ImageBackground
              source={require('../../../../assets/images/fitazfk-blog.jpg')}
              style={{
                height: null,
                width: null,
                flexGrow: 1,
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.8)', 'transparent']}
                start={[0.4, 1]}
                end={[1, 0]}
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.boldItalic,
                    fontSize: 24,
                    color: colors.white,
                    marginLeft: 12,
                  }}
                >
                  Check out our blog
                </Text>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://www.facebook.com/groups/180007149128432/?source_id=204363259589572')}
            style={{
              flex: 1,
              width: width - 30,
              marginTop: 7.5,
              marginBottom: 7.5,
              borderRadius: 4,
              shadowColor: colors.black,
              shadowOpacity: 0.8,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 5,
            }}
          >
            <ImageBackground
              source={require('../../../../assets/images/fitazfk-facebook-group.jpg')}
              style={{
                height: null,
                width: null,
                flexGrow: 1,
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.8)', 'transparent']}
                start={[0.4, 1]}
                end={[1, 0]}
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.boldItalic,
                    fontSize: 24,
                    color: colors.white,
                    marginLeft: 12,
                  }}
                >
                  Join our Facebook Group
                </Text>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://www.fitazfk.com/')}
            style={{
              flex: 1,
              width: width - 30,
              marginTop: 7.5,
              marginBottom: 7.5,
              borderRadius: 4,
              shadowColor: colors.black,
              shadowOpacity: 0.8,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 5,
            }}
          >
            <ImageBackground
              source={require('../../../../assets/images/fitazfk-shop-now.jpg')}
              style={{
                height: null,
                width: null,
                flexGrow: 1,
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.8)', 'transparent']}
                start={[0.4, 1]}
                end={[1, 0]}
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.boldItalic,
                    fontSize: 24,
                    color: colors.white,
                    marginLeft: 12,
                  }}
                >
                  Shop now
                </Text>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => Linking.openURL('https://www.fitazfk.com/')}
            style={{
              flex: 1,
              width: width - 30,
              marginTop: 7.5,
              marginBottom: 7.5,
              borderRadius: 4,
              shadowColor: colors.black,
              shadowOpacity: 0.8,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 5,
            }}
          >
            <ImageBackground
              source={require('../../../../assets/images/fitazfk-shop-now.jpg')}
              style={{
                height: null,
                width: null,
                flexGrow: 1,
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.8)', 'transparent']}
                start={[0.4, 1]}
                end={[1, 0]}
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.boldItalic,
                    fontSize: 24,
                    color: colors.white,
                    marginLeft: 12,
                  }}
                >
                  Shop now
                </Text>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity> */}

          {/* <TouchableOpacity
            onPress={() => Linking.openURL('https://www.fitazfkblog.com/')}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 7.5,
              marginBottom: 7.5,
              width: width - 30,
              backgroundColor: colors.charcoal.standard,
              borderRadius: 4,
            }}
          >
            <Text
              style={{
                fontFamily: 'GothamBold',
                fontSize: 24,
                color: colors.white,
              }}
            >
              Check out our blog
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://www.facebook.com/groups/180007149128432/?source_id=204363259589572')}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 7.5,
              marginBottom: 7.5,
              width: width - 30,
              backgroundColor: colors.charcoal.standard,
              borderRadius: 4,
            }}
          >
            <Text
              style={{
                fontFamily: 'GothamBold',
                fontSize: 24,
                color: colors.white,
              }}
            >
              Join our facebook group
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://www.fitazfk.com/')}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 7.5,
              marginBottom: 7.5,
              width: width - 30,
              backgroundColor: colors.charcoal.standard,
              borderRadius: 4,
            }}
          >
            <Text
              style={{
                fontFamily: 'GothamBold',
                fontSize: 24,
                color: colors.white,
              }}
            >
              Shop now
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 7.5,
              marginBottom: 7.5,
              width: width - 30,
              backgroundColor: colors.charcoal.standard,
              borderRadius: 4,
            }}
          >
            <Text
              style={{
                fontFamily: 'GothamBold',
                fontSize: 24,
                color: colors.white,
              }}
            >
              Blank
            </Text>
          </TouchableOpacity> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
