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
import Modal from 'react-native-modal';
import CustomButton from '../../components/CustomButton';
import Loader from '../../components/Loader';
import { weightOptions, waistOptions, hipOptions } from '../../utils/index';
import { db } from '../../../config/firebase';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const { width } = Dimensions.get('window');

export default class Progress1Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      weight: 50,
      waist: 50,
      hip: 70,
      weightModalVisible: false,
      waistModalVisible: false,
      hipModalVisible: false,
      helperModalVisible: true,
      unitsOfMeasurement: null,
    };
  }
  componentWillMount = () => {
    this.props.navigation.setParams({ handleSkip: this.handleSkip, toggleHelperModal: this.toggleHelperModal });
  }
  componentDidMount = () => {
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
  toggleWeightModal = () => {
    this.setState((prevState) => ({ weightModalVisible: !prevState.weightModalVisible }));
  }
  toggleWaistModal = () => {
    this.setState((prevState) => ({ waistModalVisible: !prevState.waistModalVisible }));
  }
  toggleHipModal = () => {
    this.setState((prevState) => ({ hipModalVisible: !prevState.hipModalVisible }));
  }
  toggleHelperModal = () => {
    this.setState((prevState) => ({ helperModalVisible: !prevState.helperModalVisible }));
  }
  handleSubmit = async (weight, waist, hip) => {
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
            <Modal
              isVisible={helperModalVisible}
              animationIn="fadeIn"
              animationInTiming={800}
              animationOut="fadeOut"
              animationOutTiming={800}
            >
              <View style={styles.helperModalContainer}>
                <View style={styles.helperModalTextContainer}>
                  <Text style={styles.headerText}>
                    Progress
                  </Text>
                  <Text style={styles.bodyText}>
                    {'Adding a progress entry involves 3 steps - your measurements, a progress photo and a 1 minute burpee test.\n\n'}
                  </Text>
                  <Text style={styles.bodyText}>
                    {'You will need to complete all three to successfully add an entry.\n\n'}
                  </Text>
                  <Text style={styles.bodyText}>
                    {'If you can\'t do all this right now, press skip in the top right corner.'}
                  </Text>
                </View>
                <TouchableOpacity
                  title="DONE"
                  onPress={() => this.toggleHelperModal()}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonText}>
                    Ok, got it!
                  </Text>
                </TouchableOpacity>
              </View>
            </Modal>
            <View style={styles.textContainer}>
              <Text style={styles.headerText}>
                Measurements
              </Text>
              <Text style={styles.bodyText}>
                Please enter your measurements, or skip to do this another time.
              </Text>
            </View>
            <View style={styles.contentContainer}>
              <View style={styles.inputFieldContainer}>
                <Text style={styles.inputFieldTitle}>
                  Weight
                </Text>
                <TouchableOpacity
                  onPress={() => this.toggleWeightModal()}
                  style={styles.inputButton}
                >
                  <Text style={styles.inputSelectionText}>
                    {weight} {unitsOfMeasurement === 'metric' && 'kg'}{unitsOfMeasurement === 'imperial' && 'lbs'}
                  </Text>
                </TouchableOpacity>
                <Modal
                  isVisible={weightModalVisible}
                  onBackdropPress={() => this.toggleWeightModal()}
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
                      {waistOptions.map((i) => (
                        <Picker.Item
                          key={i.value}
                          label={`${i.label} ${unitsOfMeasurement === 'metric' ? 'kg' : ''}${unitsOfMeasurement === 'imperial' ? 'lbs' : ''}`}
                          value={i.value}
                        />
                      ))}
                    </Picker>
                    <TouchableOpacity
                      title="DONE"
                      onPress={() => this.toggleWeightModal()}
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
                  onPress={() => this.toggleWaistModal()}
                  style={styles.inputButton}
                >
                  <Text style={styles.inputSelectionText}>
                    {waist} {unitsOfMeasurement === 'metric' && 'cm'}{unitsOfMeasurement === 'imperial' && 'inches'}
                  </Text>
                </TouchableOpacity>
                <Modal
                  isVisible={waistModalVisible}
                  onBackdropPress={() => this.toggleWaistModal()}
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
                      {weightOptions.map((i) => (
                        <Picker.Item
                          key={i.value}
                          label={`${i.label} ${unitsOfMeasurement === 'metric' ? 'cm' : ''}${unitsOfMeasurement === 'imperial' ? 'inches' : ''}`}
                          value={i.value}
                        />
                      ))}
                    </Picker>
                    <TouchableOpacity
                      title="DONE"
                      onPress={() => this.toggleWaistModal()}
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
                  onPress={() => this.toggleHipModal()}
                  style={styles.inputButton}
                >
                  <Text style={styles.inputSelectionText}>
                    {hip} {unitsOfMeasurement === 'metric' && 'cm'}{unitsOfMeasurement === 'imperial' && 'inches'}
                  </Text>
                </TouchableOpacity>
                <Modal
                  isVisible={hipModalVisible}
                  onBackdropPress={() => this.toggleHipModal()}
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
                      {hipOptions.map((i) => (
                        <Picker.Item
                          key={i.value}
                          label={`${i.label} ${unitsOfMeasurement === 'metric' ? 'cm' : ''}${unitsOfMeasurement === 'imperial' ? 'inches' : ''}`}
                          value={i.value}
                        />
                      ))}
                    </Picker>
                    <TouchableOpacity
                      title="DONE"
                      onPress={() => this.toggleHipModal()}
                      style={styles.modalButton}
                    >
                      <Text style={styles.modalButtonText}>
                        DONE
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Modal>
              </View>
              {/* <Button
                title="How do I measure this?"
                onPress={this.toggleModal}
                containerViewStyle={styles.modalTriggerButtonContainer}
                buttonStyle={styles.modalTriggerButton}
                textStyle={styles.modalTriggerButtonText}
              /> */}
            </View>
            <View style={styles.buttonContainer}>
              <CustomButton
                title="NEXT"
                onPress={() => this.handleSubmit(weight, waist, hip)}
                primary
              />
            </View>
            {
              loading && <Loader loading={loading} color={colors.coral.standard} />
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
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
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
    marginLeft: 5,
    marginTop: 5,
    marginBottom: 10,
  },
  bodyText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.light,
    marginLeft: 5,
    marginBottom: 5,
  },
  modalContainer: {
    flexShrink: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 4,
    overflow: 'hidden',
  },
  helperModalContainer: {
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 4,
    overflow: 'hidden',
  },
  helperModalTextContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 10,
  },
  modalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.coral.standard,
    height: 50,
    width: '100%',
    marginBottom: 0,
  },
  modalButtonText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    marginTop: 3,
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
