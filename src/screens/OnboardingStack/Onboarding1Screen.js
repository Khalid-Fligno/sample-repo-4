import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  AsyncStorage,
  DatePickerIOS,
  Picker,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { DangerZone } from 'expo';
import Modal from 'react-native-modal';
import CustomButton from '../../components/CustomButton';
import Loader from '../../components/Loader';
import { db } from '../../../config/firebase';
import { uomMap } from '../../utils/index';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const moment = require('moment-timezone');

const { Localization } = DangerZone;

const { width } = Dimensions.get('window');

export default class Onboarding1Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      chosenDate: new Date(2008, 0, 1),
      dobModalVisible: false,
      chosenUom: 'metric',
      uomModalVisible: false,
      timezone: null,
    };
  }
  componentDidMount = async () => {
    const timezone = await Localization.getCurrentTimeZoneAsync();
    this.setState({ timezone });
  }
  setDate = async (newDate) => {
    this.setState({ chosenDate: newDate });
  }
  handleSubmit = async (chosenDate, chosenUom) => {
    this.setState({ loading: true });
    try {
      const timezone = await Localization.getCurrentTimeZoneAsync();
      const dob = moment.tz(chosenDate, timezone).format('YYYY-MM-DD');
      const uid = await AsyncStorage.getItem('uid');
      const userRef = db.collection('users').doc(uid);
      const data = {
        dob,
        unitsOfMeasurement: chosenUom,
        onboarded: true,
      };
      await userRef.set(data, { merge: true });
      this.setState({ loading: false });
      this.props.navigation.navigate('Progress1', { isInitial: true });
    } catch (err) {
      console.log(err);
      this.setState({ loading: false });
    }
  }
  toggleDobModal = () => {
    this.setState((prevState) => ({ dobModalVisible: !prevState.dobModalVisible }));
  }
  toggleUomModal = () => {
    this.setState((prevState) => ({ uomModalVisible: !prevState.uomModalVisible }));
  }
  render() {
    const {
      loading,
      chosenDate,
      dobModalVisible,
      chosenUom,
      uomModalVisible,
      timezone,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.flexContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>
              Welcome
            </Text>
            <Text style={styles.bodyText}>
              To help us get you FitazFK, we need some information from you.
            </Text>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputFieldTitle}>
                Date of Birth
              </Text>
              <TouchableOpacity
                onPress={() => this.toggleDobModal()}
                style={styles.inputButton}
              >
                <Text style={styles.inputSelectionText}>
                  {moment.tz(chosenDate, timezone).format('LL')}
                </Text>
              </TouchableOpacity>
              <Modal
                isVisible={dobModalVisible}
                onBackdropPress={() => this.toggleDobModal()}
                animationIn="fadeIn"
                animationInTiming={600}
                animationOut="fadeOut"
                animationOutTiming={600}
              >
                <View style={styles.modalContainer}>
                  <DatePickerIOS
                    mode="date"
                    date={chosenDate}
                    onDateChange={this.setDate}
                    minimumDate={new Date(1940, 0, 1)}
                    maximumDate={new Date(2008, 0, 1)}
                    itemStyle={{
                      fontFamily: fonts.standard,
                    }}
                  />
                  <TouchableOpacity
                    title="DONE"
                    onPress={() => this.toggleDobModal()}
                    style={styles.modalButton}
                  >
                    <Text style={styles.modalButtonText}>
                      DONE
                    </Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputFieldTitle}>
                Units of measurement
              </Text>
              <TouchableOpacity
                onPress={() => this.toggleUomModal()}
                style={styles.inputButton}
              >
                <Text style={styles.inputSelectionText}>
                  {uomMap[chosenUom]}
                </Text>
              </TouchableOpacity>
              <Modal
                isVisible={uomModalVisible}
                onBackdropPress={() => this.toggleUomModal()}
                animationIn="fadeIn"
                animationInTiming={600}
                animationOut="fadeOut"
                animationOutTiming={600}
              >
                <View style={styles.modalContainer}>
                  <Picker
                    selectedValue={chosenUom}
                    onValueChange={(value) => this.setState({ chosenUom: value })}
                  >
                    <Picker.Item label="Metric (cm, kg)" value="metric" />
                    <Picker.Item label="Imperial (inch, lb)" value="imperial" />
                  </Picker>
                  <TouchableOpacity
                    title="DONE"
                    onPress={() => this.toggleUomModal()}
                    style={styles.modalButton}
                  >
                    <Text style={styles.modalButtonText}>
                      DONE
                    </Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              title="NEXT"
              onPress={() => this.handleSubmit(chosenDate, chosenUom)}
              primary
            />
          </View>
          {
            loading && <Loader loading={loading} color={colors.coral.standard} />
          }
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 4,
    overflow: 'hidden',
  },
  modalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.coral.standard,
    height: 50,
    width: '100%',
  },
  modalButtonText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    marginTop: 3,
  },
  textContainer: {
    flex: 1,
    width,
    padding: 20,
  },
  headerText: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.charcoal.light,
    marginBottom: 10,
  },
  bodyText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.light,
    marginLeft: 5,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  inputFieldContainer: {
    marginBottom: 20,
  },
  inputFieldTitle: {
    marginLeft: 2,
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.charcoal.light,
    marginBottom: 5,
  },
  inputButton: {
    width: width - 20,
    padding: 15,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: colors.grey.light,
    borderRadius: 2,
  },
  inputSelectionText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.charcoal.dark,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
});
