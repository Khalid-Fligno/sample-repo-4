import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
  TouchableOpacity,
  Picker,
  AsyncStorage,
} from 'react-native';
import { Haptic } from 'expo';
import Modal from 'react-native-modal';
import HelperModal from '../../components/Shared/HelperModal';
import CustomButton from '../../components/Shared/CustomButton';
import Loader from '../../components/Shared/Loader';
import {
  weightOptionsMetric,
  waistOptionsMetric,
  hipOptionsMetric,
  weightOptionsImperial,
  waistOptionsImperial,
  hipOptionsImperial,
} from '../../utils/index';
import { db } from '../../../config/firebase';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const { width } = Dimensions.get('window');

export default class Progress1Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      weight: 60,
      waist: 60,
      hip: 60,
      weightModalVisible: false,
      waistModalVisible: false,
      hipModalVisible: false,
      helperModalVisible: false,
      unitsOfMeasurement: null,
    };
  }
  componentDidMount = () => {
    this.props.navigation.setParams({ handleSkip: this.handleSkip, toggleHelperModal: this.showHelperModal });
    this.fetchUom();
  }
  toggleHelperModal = () => {
    this.setState((prevState) => ({ helperModalVisible: !prevState.helperModalVisible }));
  }
  fetchUom = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    db.collection('users').doc(uid)
      .get()
      .then(async (doc) => {
        this.setState({ unitsOfMeasurement: await doc.data().unitsOfMeasurement, loading: false });
      });
  }
  handleSkip = () => {
    if (this.props.navigation.getParam('isInitial', false)) {
      Alert.alert(
        'Warning',
        'Entering your progress information is a good way to stay accountable. Are you sure you want to skip?',
        [
          {
            text: 'Cancel', style: 'cancel',
          },
          {
            text: 'Skip', onPress: () => this.props.navigation.navigate('App'),
          },
        ],
        { cancelable: false },
      );
    } else {
      Alert.alert(
        'Warning',
        'Skipping means that you will lose any information that you have already entered.',
        [
          {
            text: 'Cancel', style: 'cancel',
          },
          {
            text: 'Skip', onPress: () => this.props.navigation.navigate('App'),
          },
        ],
        { cancelable: false },
      );
    }
  }
  showModal = (modalNameVisible) => {
    this.setState({ [modalNameVisible]: true });
  }
  hideModal = (modalNameVisible) => {
    this.setState({ [modalNameVisible]: false });
  }
  showHelperModal = () => {
    this.setState({ helperModalVisible: true });
  }
  hideHelperModal = () => {
    this.setState({ helperModalVisible: false });
  }
  handleSubmit = async (weight, waist, hip) => {
    Haptic.impact(Haptic.ImpactFeedbackStyle.Light);
    this.setState({ loading: true });
    const isInitial = this.props.navigation.getParam('isInitial', false);
    this.setState({ loading: false });
    this.props.navigation.navigate('Progress2', {
      isInitial,
      weight,
      waist,
      hip,
    });
    this.setState({ loading: false });
  }
  render() {
    const {
      loading,
      weight,
      waist,
      hip,
      weightModalVisible,
      waistModalVisible,
      hipModalVisible,
      unitsOfMeasurement,
      helperModalVisible,
    } = this.state;
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={-60}
          behavior="position"
        >
          <View style={styles.container}>
            <View style={styles.textContainer}>
              <Text style={styles.headerText}>
                Measurements
              </Text>
              <Text style={styles.bodyText}>
                To help you track your progress, let’s find out where you are now.
              </Text>
            </View>
            <View style={styles.contentContainer}>
              <View style={styles.inputFieldContainer}>
                <Text style={styles.inputFieldTitle}>
                  Weight
                </Text>
                <TouchableOpacity
                  onPress={() => this.showModal('weightModalVisible')}
                  style={styles.inputButton}
                >
                  <Text style={styles.inputSelectionText}>
                    {weight} {unitsOfMeasurement === 'metric' && 'kg'}{unitsOfMeasurement === 'imperial' && 'lbs'}
                  </Text>
                </TouchableOpacity>
                <Modal
                  isVisible={weightModalVisible}
                  onBackdropPress={() => this.hideModal('weightModalVisible')}
                  animationIn="fadeIn"
                  animationInTiming={600}
                  animationOut="fadeOut"
                  animationOutTiming={600}
                >
                  <View style={styles.modalContainer}>
                    <Picker
                      selectedValue={weight}
                      onValueChange={(value) => this.setState({ weight: value })}
                    >
                      {
                        unitsOfMeasurement === 'metric'
                        ?
                          weightOptionsMetric.map((i) => (
                            <Picker.Item
                              key={i.value}
                              label={`${i.label} kg`}
                              value={i.value}
                            />
                          ))
                        :
                          weightOptionsImperial.map((i) => (
                            <Picker.Item
                              key={i.value}
                              label={`${i.label} lbs`}
                              value={i.value}
                            />
                          ))
                      }
                    </Picker>
                    <TouchableOpacity
                      title="DONE"
                      onPress={() => this.hideModal('weightModalVisible')}
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
                  Waist
                </Text>
                <TouchableOpacity
                  onPress={() => this.showModal('waistModalVisible')}
                  style={styles.inputButton}
                >
                  <Text style={styles.inputSelectionText}>
                    {waist} {unitsOfMeasurement === 'metric' && 'cm'}{unitsOfMeasurement === 'imperial' && 'inches'}
                  </Text>
                </TouchableOpacity>
                <Modal
                  isVisible={waistModalVisible}
                  onBackdropPress={() => this.hideModal('waistModalVisible')}
                  animationIn="fadeIn"
                  animationInTiming={600}
                  animationOut="fadeOut"
                  animationOutTiming={600}
                >
                  <View style={styles.modalContainer}>
                    <Picker
                      selectedValue={waist}
                      onValueChange={(value) => this.setState({ waist: value })}
                    >
                      {
                        unitsOfMeasurement === 'metric'
                        ?
                          waistOptionsMetric.map((i) => (
                            <Picker.Item
                              key={i.value}
                              label={`${i.label} cm`}
                              value={i.value}
                            />
                          ))
                        :
                          waistOptionsImperial.map((i) => (
                            <Picker.Item
                              key={i.value}
                              label={`${i.label} inches`}
                              value={i.value}
                            />
                          ))
                      }
                    </Picker>
                    <TouchableOpacity
                      title="DONE"
                      onPress={() => this.hideModal('waistModalVisible')}
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
                  Hip
                </Text>
                <TouchableOpacity
                  onPress={() => this.showModal('hipModalVisible')}
                  style={styles.inputButton}
                >
                  <Text style={styles.inputSelectionText}>
                    {hip} {unitsOfMeasurement === 'metric' && 'cm'}{unitsOfMeasurement === 'imperial' && 'inches'}
                  </Text>
                </TouchableOpacity>
                <Modal
                  isVisible={hipModalVisible}
                  onBackdropPress={() => this.hideModal('hipModalVisible')}
                  animationIn="fadeIn"
                  animationInTiming={600}
                  animationOut="fadeOut"
                  animationOutTiming={600}
                >
                  <View style={styles.modalContainer}>
                    <Picker
                      selectedValue={hip}
                      onValueChange={(value) => this.setState({ hip: value })}
                    >
                      {
                        unitsOfMeasurement === 'metric'
                        ?
                          hipOptionsMetric.map((i) => (
                            <Picker.Item
                              key={i.value}
                              label={`${i.label} cm`}
                              value={i.value}
                            />
                          ))
                        :
                          hipOptionsImperial.map((i) => (
                            <Picker.Item
                              key={i.value}
                              label={`${i.label} inches`}
                              value={i.value}
                            />
                          ))
                      }
                    </Picker>
                    <TouchableOpacity
                      title="DONE"
                      onPress={() => this.hideModal('hipModalVisible')}
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
                onPress={() => this.handleSubmit(weight, waist, hip)}
                primary
              />
            </View>
            <Loader
              loading={loading}
              color={colors.coral.standard}
            />
          </View>
        </KeyboardAvoidingView>
        <HelperModal
          helperModalVisible={helperModalVisible}
          hideHelperModal={this.hideHelperModal}
          headingText="Progress"
          bodyText="Adding a progress entry involves 3 steps - your measurements, a progress photo and a 1 minute burpee test."
          bodyText2="You will need to complete all three to successfully add an entry."
          bodyText3="If you can't do all of this right now, press skip in the top right corner to complete it later."
          color="coral"
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.offWhite,
  },
  textContainer: {
    flex: 1,
    width,
    padding: 10,
  },
  headerText: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.charcoal.light,
    marginBottom: 5,
  },
  bodyText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.light,
  },
  modalContainer: {
    justifyContent: 'space-between',
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
  contentContainer: {
    flexGrow: 1,
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
    backgroundColor: colors.white,
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
