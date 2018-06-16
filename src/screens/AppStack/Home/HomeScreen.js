import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import colors from '../../../styles/colors';

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
          }}
        >
          <Text
            style={{
              fontFamily: 'GothamBold',
              fontSize: 24,
            }}
          >
            Home
          </Text>
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
