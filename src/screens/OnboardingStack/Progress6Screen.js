import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
  TouchableOpacity,
  AsyncStorage,
  Picker,
} from 'react-native';
import Modal from 'react-native-modal';
import moment from 'moment';
import { db } from '../../../config/firebase';
import { burpeeOptions, findFitnessLevel } from '../../utils';
import CustomButton from '../../components/Shared/CustomButton';
import Loader from '../../components/Shared/Loader';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const { width } = Dimensions.get('window');

const storeProgressInfo = async (uri, isInitial, weight, waist, hip, burpeeCount) => {
  const uid = await AsyncStorage.getItem('uid');
  const firebase = require('firebase');
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = firebase.storage().ref();
  const userPhotosStorageRef = storageRef.child('user-photos');
  const userStorageRef = userPhotosStorageRef.child(uid);
  const progressDataFieldName = isInitial ? 'initialProgressInfo' : 'currentProgressInfo';
  const progressPhotoFilename = isInitial ? 'initial-progress-photo.jpeg' : 'current-progress-photo.jpeg';
  const initialPhotoStorageRef = userStorageRef.child(progressPhotoFilename);
  const snapshot = await initialPhotoStorageRef.put(blob);
  const url = await snapshot.ref.getDownloadURL();
  await db.collection('users').doc(uid).set({
    [progressDataFieldName]: {
      photoURL: url,
      weight: parseInt(weight, 10),
      waist: parseInt(waist, 10),
      hip: parseInt(hip, 10),
      burpeeCount,
      date: moment().format('YYYY-MM-DD'),
    },
  }, { merge: true });
};

export default class Progress6Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      burpeeCount: 0,
      burpeeModalVisible: false,
      loading: false,
    };
  }
  componentDidMount = () => {
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
  handleSubmit = async () => {
    this.setState({ loading: true });
    try {
      const { burpeeCount } = this.state;
      const uid = await AsyncStorage.getItem('uid');
      const userRef = db.collection('users').doc(uid);
      const {
        weight,
        waist,
        hip,
        isInitial,
        image,
      } = this.props.navigation.state.params;
      await storeProgressInfo(image.uri, isInitial, weight, waist, hip, burpeeCount);
      const fitnessLevel = findFitnessLevel(burpeeCount);
      AsyncStorage.setItem('fitnessLevel', fitnessLevel.toString());
      await userRef.set({
        fitnessLevel,
      }, { merge: true });
      this.setState({ loading: false });
      if (isInitial) {
        this.props.navigation.navigate('App');
      } else {
        this.props.navigation.navigate('ProgressHome');
      }
    } catch (err) {
      console.log(err);
      this.setState({ loading: false });
    }
  }
  toggleBurpeeModal = () => {
    this.setState((prevState) => ({ burpeeModalVisible: !prevState.burpeeModalVisible }));
  }
  render() {
    const {
      burpeeCount,
      burpeeModalVisible,
      loading,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.flexContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>
              Results
            </Text>
            <Text style={styles.bodyText}>
              Please enter the number of burpees you completed
            </Text>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputFieldTitle}>
                Burpee Count
              </Text>
              <TouchableOpacity
                onPress={() => this.toggleBurpeeModal()}
                style={styles.inputButton}
              >
                <Text style={styles.inputSelectionText}>
                  {burpeeCount}
                </Text>
              </TouchableOpacity>
              <Modal
                isVisible={burpeeModalVisible}
                onBackdropPress={() => this.toggleBurpeeModal()}
                animationIn="fadeIn"
                animationInTiming={600}
                animationOut="fadeOut"
                animationOutTiming={600}
              >
                <View style={styles.modalContainer}>
                  <Picker
                    selectedValue={burpeeCount}
                    onValueChange={(value) => this.setState({ burpeeCount: value })}
                  >
                    {burpeeOptions.map((i) => (
                      <Picker.Item
                        key={i.value}
                        label={i.label}
                        value={i.value}
                      />
                    ))}
                  </Picker>
                  <TouchableOpacity
                    title="DONE"
                    onPress={() => this.toggleBurpeeModal()}
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
              onPress={() => this.handleSubmit()}
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
  },
  flexContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  textContainer: {
    flex: 1,
    width,
    padding: 10,
    paddingTop: 15,
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
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
});
