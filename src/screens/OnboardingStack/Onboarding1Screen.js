import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  AsyncStorage,
  DatePickerIOS,
} from 'react-native';
import CustomButton from '../../components/CustomButton';
import Loader from '../../components/Loader';
import { db } from '../../../config/firebase';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const moment = require('moment');

export default class Onboarding1Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      chosenDate: new Date(2008, 0, 1),
      loading: false,
    };
  }
  setDate = (newDate) => {
    this.setState({ chosenDate: newDate });
  }
  handleSubmit = async (chosenDate) => {
    this.setState({ loading: true });
    try {
      const dob = moment(chosenDate).format('YYYY-MM-DD');
      const uid = await AsyncStorage.getItem('uid');
      const userRef = db.collection('users').doc(uid);
      const data = {
        dob,
      };
      await userRef.set(data, { merge: true });
      this.setState({ loading: false });
      this.props.navigation.navigate('Onboarding2');
    } catch (err) {
      console.log(err);
      this.setState({ loading: false });
    }
  }
  render() {
    const {
      loading,
      chosenDate,
    } = this.state;
    if (loading) {
      return <Loader loading={loading} />;
    }
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.flexContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>
              Welcome to FitazFK!
            </Text>
            <Text style={styles.bodyText}>
              To help us get you FitazFK, we need some information from you.
            </Text>
          </View>
          <View style={styles.flexContainer}>
            <Text style={styles.bodyText}>
              Please enter your date of birth:
            </Text>
            <DatePickerIOS
              mode="date"
              date={chosenDate}
              onDateChange={this.setDate}
              minimumDate={new Date(1940, 0, 1)}
              maximumDate={new Date(2008, 0, 1)}
            />
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Next Step"
              onPress={() => this.handleSubmit(chosenDate)}
              primary
            />
          </View>
        </View>
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
  flexContainer: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
    paddingTop: 15,
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
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 15,
  },
});
