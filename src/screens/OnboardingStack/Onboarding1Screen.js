import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  AsyncStorage,
} from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import CustomButton from '../../components/CustomButton';
import { db } from '../../../config/firebase';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const { width } = Dimensions.get('window');

export default class OnboardingScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      weight: null,
      waist: null,
      hip: null,
      error: null,
    };
  }
  handleSubmit = async (weight, waist, hip) => {
    try {
      const uid = await AsyncStorage.getItem('uid');
      const userRef = db.collection('users').doc(uid);
      const data = {
        weight,
        waist,
        hip,
      };
      await userRef.set(data, { merge: true });
      this.props.navigation.navigate('Onboarding2');
    } catch (err) {
      console.log(err);
    }
  }
  render() {
    const {
      weight,
      waist,
      hip,
      error,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={-60}
          behavior="position"
        >
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                padding: 15,
              }}
            >
              <Text style={styles.headerText}>
                Welcome to FitazFK!
              </Text>
              <Text style={styles.bodyText}>
                To help us get you FitazFK, we need some information from you.
              </Text>
            </View>
            <View>
              <FormLabel
                fontFamily={fonts.bold}
                labelStyle={styles.inputLabel}
              >
                Your Weight (kgs)
              </FormLabel>
              <FormInput
                placeholder="Weight"
                value={weight}
                maxLength={3}
                keyboardType="numeric"
                returnKeyType="done"
                onChangeText={(text) => this.setState({ weight: text })}
                containerStyle={styles.inputContainer}
                inputStyle={styles.input}
                enablesReturnKeyAutomatically
              />
              <FormLabel
                fontFamily={fonts.bold}
                labelStyle={styles.inputLabel}
              >
                Waist Measurement (cm)
              </FormLabel>
              <FormInput
                placeholder="Waist"
                value={waist}
                maxLength={3}
                keyboardType="numeric"
                returnKeyType="done"
                onChangeText={(text) => this.setState({ waist: text })}
                containerStyle={styles.inputContainer}
                inputStyle={styles.input}
              />
              <FormLabel
                fontFamily={fonts.bold}
                labelStyle={styles.inputLabel}
              >
                Hip Measurement (cm)
              </FormLabel>
              <FormInput
                placeholder="Hip"
                value={hip}
                maxLength={3}
                keyboardType="numeric"
                returnKeyType="done"
                onChangeText={(text) => this.setState({ hip: text })}
                containerStyle={styles.inputContainer}
                inputStyle={styles.input}
              />
            </View>
            {
              error && (
                <FormValidationMessage>
                  {error}
                </FormValidationMessage>
              )
            }
            <View
              style={{
                paddingTop: 15,
                paddingBottom: 15,
              }}
            >
              <CustomButton
                title="Next Step"
                onPress={() => this.handleSubmit(weight, waist, hip)}
                primary
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: 24,
  },
  bodyText: {
    textAlign: 'center',
    fontFamily: fonts.standard,
    fontSize: 14,
  },
  inputLabel: {
    color: colors.charcoal.standard,
  },
  inputContainer: {
    marginTop: 5,
    marginBottom: 5,
    borderBottomWidth: 0,
  },
  input: {
    width: width - 100,
    padding: 12,
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.charcoal.standard,
    borderWidth: 1,
    borderColor: colors.grey.standard,
    borderRadius: 4,
  },
});
