import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  AsyncStorage,
  TouchableOpacity,
} from 'react-native';
import { Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import Image from 'react-native-scalable-image';
import DateTimePicker from 'react-native-modal-datetime-picker';
import CustomModal from '../../components/CustomModal';
import CustomButton from '../../components/CustomButton';
import { db } from '../../../config/firebase';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const { width } = Dimensions.get('window');

const formatDate = (day, month, year) => {
  const realMonth = month + 1;
  return `${day <= 9 ? `0${day}` : day}/${realMonth <= 9 ? `0${realMonth}` : realMonth}/${year}`;
};

export default class Onboarding1Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      weight: null,
      waist: null,
      hip: null,
      error: null,
      isModalVisible: false,
      isDateTimePickerVisible: false,
      dob: null,
    };
  }
  showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
  handleDatePicked = async (date) => {
    console.log(date);
    const dob = formatDate(date.getDate(), date.getMonth(), date.getFullYear());
    await this.setState({ dob });
    this.hideDateTimePicker();
    console.log(this.state.dob);
  };
  toggleModal = () => {
    this.setState((prevState) => ({
      isModalVisible: !prevState.isModalVisible,
    }));
  }
  handleSubmit = async (weight, waist, hip, dob) => {
    if (!weight || !waist || !hip || !dob) {
      this.setState({ error: 'Please complete all fields' });
      return;
    }
    try {
      const uid = await AsyncStorage.getItem('uid');
      const userRef = db.collection('users').doc(uid);
      const data = {
        weight,
        waist,
        hip,
        dob,
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
      dob,
      error,
      isModalVisible,
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
            <CustomModal
              isVisible={isModalVisible}
              onDismiss={this.toggleModal}
            >
              <Image
                source={require('../../../assets/images/landing-page-1.png')}
                width={width - 70}
              />
              <Text>I am the modal content!</Text>
            </CustomModal>
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
            <TouchableOpacity onPress={this.showDateTimePicker}>
              <Text>Show DatePicker</Text>
            </TouchableOpacity>
            <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={(date) => this.handleDatePicked(date)}
              onCancel={this.hideDateTimePicker}
              mode="date"
              minimumDate={new Date('1930-01-01')}
            />
            <Text>{dob}</Text>
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
                containerViewStyle={{
                  marginTop: 15,
                }}
                buttonStyle={{
                  width: width - 100,
                  alignSelf: 'center',
                  borderRadius: 4,
                  backgroundColor: colors.violet.standard,
                }}
                textStyle={{
                  fontFamily: fonts.standard,
                  fontSize: 14,
                }}
              />
            </View>

            <View
              style={{
                paddingTop: 15,
                paddingBottom: 15,
                alignItems: 'center',
              }}
            >
              {
                error && (
                  <FormValidationMessage>
                    {error}
                  </FormValidationMessage>
                )
              }
              <CustomButton
                title="Next Step"
                onPress={() => this.handleSubmit(weight, waist, hip, dob)}
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
});
