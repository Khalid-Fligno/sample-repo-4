import React from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { Facebook } from 'expo';
// import firebase from 'firebase';
import CustomButton from '../../components/CustomButton';
import colors from '../../styles/colors';

export default class SignInScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  logIn = async () => {
    const { type, token } = await Facebook.logInWithReadPermissionsAsync('1825444707513470', {
      permissions: ['public_profile', 'email'],
    });
    if (type === 'success') {
      this.props.navigation.navigate('App')
      // Get the user's name using Facebook's Graph API
      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}`);
      Alert.alert(
        'Logged in!',
        `Hi ${(await response.json()).name}!`,
      );
    }
  }
  render() {
    return (
      <View
        style={styles.container}
      >
        <Text>SignInScreen</Text>

        <CustomButton
          onPress={() => this.logIn()}
          title="Sign in with Facebook"
          primary
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
