import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import colors from '../../../styles/colors';

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
          </TouchableOpacity>
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
