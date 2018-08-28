import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  AsyncStorage,
  Alert,
} from 'react-native';
import { Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import Image from 'react-native-scalable-image';
import Modal from 'react-native-modal';
import CustomButton from '../../components/CustomButton';
import Loader from '../../components/Loader';
import { db } from '../../../config/firebase';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const { width } = Dimensions.get('window');

export default class Onboarding2Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      weight: null,
      waist: null,
      hip: null,
      error: null,
      isModalVisible: false,
      loading: false,
    };
  }
  componentWillMount = () => {
    this.props.navigation.setParams({ handleSkip: this.handleSkip });
  }
  handleSkip = () => {
    Alert.alert(
      'Warning',
      'You will need to do this before your first workout',
      [
        {
          text: 'Cancel', style: 'cancel',
        },
        {
          text: 'Ok, got it!', onPress: () => this.props.navigation.navigate('App'),
        },
      ],
      { cancelable: false },
    );
  }
  toggleModal = () => {
    this.setState((prevState) => ({
      isModalVisible: !prevState.isModalVisible,
    }));
  }
  handleSubmit = async (weight, waist, hip) => {
    this.setState({ loading: true });
    if (!weight || !waist || !hip) {
      this.setState({ error: 'Please complete all fields', loading: false });
      return;
    }
    try {
      const uid = await AsyncStorage.getItem('uid');
      const userRef = db.collection('users').doc(uid);
      const data = {
        weight,
        waist,
        hip,
      };
      await userRef.set({
        initialProgressInfo: data,
      }, { merge: true });
      this.setState({ loading: false });
      this.props.navigation.navigate('Onboarding3');
    } catch (err) {
      console.log(err);
      this.setState({ loading: false });
    }
  }
  render() {
    const {
      weight,
      waist,
      hip,
      error,
      isModalVisible,
      loading,
    } = this.state;
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={-60}
          behavior="position"
        >
          <View style={styles.container}>
            <Modal isVisible={isModalVisible}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContentContainer}>
                  <Image
                    source={require('../../../assets/images/landing-page-1.png')}
                    width={width - 70}
                  />
                  <Text>I am the modal content!</Text>
                </View>
                <Button
                  title="Ok, got it!"
                  onPress={this.toggleModal}
                  containerViewStyle={styles.modalButtonContainer}
                  buttonStyle={styles.modalButton}
                  textStyle={styles.modalButtonText}
                />
              </View>
            </Modal>
            <View style={styles.textContainer}>
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
              <Button
                title="How do I measure this?"
                onPress={this.toggleModal}
                containerViewStyle={styles.modalTriggerButtonContainer}
                buttonStyle={styles.modalTriggerButton}
                textStyle={styles.modalTriggerButtonText}
              />
            </View>
            <View style={styles.buttonContainer}>
              {
                error && (
                  <FormValidationMessage>
                    {error}
                  </FormValidationMessage>
                )
              }
              <CustomButton
                title="Next Step"
                onPress={() => this.handleSubmit(weight, waist, hip)}
                primary
              />
            </View>
            {
              loading && <Loader loading={loading} color={colors.charcoal.standard} />
            }
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 4,
  },
  modalContentContainer: {
    margin: 15,
  },
  modalButtonContainer: {
    margin: 15,
  },
  modalButton: {
    backgroundColor: colors.violet.standard,
    borderRadius: 4,
  },
  modalButtonText: {
    fontFamily: fonts.standard,
    fontSize: 14,
  },
  textContainer: {
    padding: 15,
  },
  headerText: {
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: 24,
    marginBottom: 15,
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
  modalTriggerContainer: {
    marginTop: 15,
  },
  modalTriggerButton: {
    width: width - 100,
    alignSelf: 'center',
    borderRadius: 4,
    backgroundColor: colors.violet.standard,
  },
  modalTriggerButtonText: {
    fontFamily: fonts.standard,
    fontSize: 14,
  },
  buttonContainer: {
    alignItems: 'center',
  },
});
