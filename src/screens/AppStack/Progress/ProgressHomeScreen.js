import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, ScrollView, Dimensions, AsyncStorage, TouchableOpacity } from 'react-native';
import { Segment } from 'expo';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import ReactTimeout from 'react-timeout';
import { db } from '../../../../config/firebase';
import Loader from '../../../components/Shared/Loader';
import Icon from '../../../components/Shared/Icon';
import HelperModal from '../../../components/Shared/HelperModal';
import CustomButton from '../../../components/Shared/CustomButton';
import ImageModal from '../../../components/Progress/ImageModal';
import { diff } from '../../../utils/index';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

class ProgressHomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      initialProgressInfo: null,
      currentProgressInfo: null,
      unitsOfMeasurement: null,
      helperModalVisible: false,
      imageModalVisible: false,
      imageModalSource: undefined,
    };
  }
  componentDidMount() {
    this.props.navigation.setParams({ toggleHelperModal: this.toggleHelperModal });
    this.fetchProgressInfo();
    this.showHelperOnFirstOpen();
    Segment.screen('Progress Screen');
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  showHelperOnFirstOpen = async () => {
    const helperShownOnFirstOpen = await AsyncStorage.getItem('progressHelperShownOnFirstOpen');
    if (helperShownOnFirstOpen === null) {
      this.props.setTimeout(() => this.setState({ helperModalVisible: true }), 1200);
      AsyncStorage.setItem('progressHelperShownOnFirstOpen', 'true');
    }
  }
  toggleHelperModal = () => {
    this.setState((prevState) => ({
      helperModalVisible: !prevState.helperModalVisible,
    }));
  }
  toggleImageModal = (imageSource) => {
    this.setState((prevState) => ({
      imageModalSource: imageSource,
      imageModalVisible: !prevState.imageModalVisible,
    }));
  }
  fetchProgressInfo = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    this.unsubscribe = db.collection('users').doc(uid)
      .onSnapshot(async (doc) => {
        if (doc.exists) {
          this.setState({
            initialProgressInfo: await doc.data().initialProgressInfo,
            currentProgressInfo: await doc.data().currentProgressInfo,
            unitsOfMeasurement: await doc.data().unitsOfMeasurement,
            loading: false,
          });
        }
      });
  }
  render() {
    const {
      loading,
      initialProgressInfo,
      currentProgressInfo,
      unitsOfMeasurement,
      helperModalVisible,
      imageModalVisible,
      imageModalSource,
    } = this.state;
    const weightDifference = initialProgressInfo && currentProgressInfo && diff(initialProgressInfo.weight, currentProgressInfo.weight);
    const hipDifference = initialProgressInfo && currentProgressInfo && diff(initialProgressInfo.hip, currentProgressInfo.hip);
    const waistDifference = initialProgressInfo && currentProgressInfo && diff(initialProgressInfo.waist, currentProgressInfo.waist);
    const burpeesDifference = initialProgressInfo && currentProgressInfo && diff(initialProgressInfo.burpeeCount, currentProgressInfo.burpeeCount);
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.imagesContainer}>
            {
              initialProgressInfo ? (
                <TouchableOpacity
                  onPress={() => this.toggleImageModal(initialProgressInfo.photoURL)}
                >
                  <FastImage
                    style={styles.image}
                    source={{ uri: initialProgressInfo.photoURL }}
                  />
                </TouchableOpacity>
              ) : (
                <View style={styles.imagePlaceholder}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Progress1', { isInitial: true })}
                    style={styles.imagePlaceholderButton}
                  >
                    <Icon
                      name="add-circle"
                      color={colors.white}
                      size={20}
                      style={styles.addIcon}
                    />
                    <Text style={styles.imagePlaceholderButtonText}>
                      Add before photo and measurements
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            }
            {
              currentProgressInfo ? (
                <TouchableOpacity
                  onPress={() => this.toggleImageModal(currentProgressInfo.photoURL)}
                >
                  <FastImage
                    style={styles.image}
                    source={{ uri: currentProgressInfo.photoURL }}
                  />
                </TouchableOpacity>
              ) : (
                <View style={styles.imagePlaceholder}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Progress1', { isInitial: false })}
                    disabled={initialProgressInfo === null}
                    style={[
                      styles.imagePlaceholderButton,
                      initialProgressInfo === null && styles.disabledImagePlaceHolderButton,
                    ]}
                  >
                    <Icon
                      name="add-circle"
                      color={colors.white}
                      size={20}
                      style={styles.addIcon}
                    />
                    <Text style={styles.imagePlaceholderButtonText}>
                      Add after photo and measurements
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            }
          </View>
          <View style={styles.dateRowContainer}>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>
                {initialProgressInfo ? moment(initialProgressInfo.date).format('DD/MM/YYYY') : '-'}
              </Text>
            </View>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>
                {currentProgressInfo ? moment(currentProgressInfo.date).format('DD/MM/YYYY') : '-'}
              </Text>
            </View>
          </View>
          <View style={styles.dataRowContainer}>
            <View style={styles.dataContainer}>
              <Text style={styles.dataText}>
                {initialProgressInfo ? initialProgressInfo.weight : '-'} {initialProgressInfo && unitsOfMeasurement === 'metric' && 'kg'}{initialProgressInfo && unitsOfMeasurement === 'imperial' && 'lbs'}
              </Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldText}>
                WEIGHT
              </Text>
              <Text
                style={[
                  styles.dataTextNegative,
                  weightDifference >= 0 && styles.dataTextPositive,
                ]}
              >
                {weightDifference || '-'} {weightDifference && unitsOfMeasurement === 'metric' && 'kg'}{weightDifference && unitsOfMeasurement === 'imperial' && 'lbs'}
              </Text>
            </View>
            <View style={styles.dataContainer}>
              <Text style={styles.dataText}>
                {currentProgressInfo ? currentProgressInfo.weight : '-'} {currentProgressInfo && unitsOfMeasurement === 'metric' && 'kg'}{currentProgressInfo && unitsOfMeasurement === 'imperial' && 'lbs'}
              </Text>
            </View>
          </View>
          <View style={styles.dataRowContainer}>
            <View style={styles.dataContainer}>
              <Text style={styles.dataText}>
                {initialProgressInfo ? initialProgressInfo.waist : '-'} {initialProgressInfo && unitsOfMeasurement === 'metric' && 'cm'}{initialProgressInfo && unitsOfMeasurement === 'imperial' && 'inches'}
              </Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldText}>
                WAIST
              </Text>
              <Text
                style={[
                  styles.dataTextNegative,
                  waistDifference >= 0 && styles.dataTextPositive,
                ]}
              >
                {waistDifference || '-'} {waistDifference && unitsOfMeasurement === 'metric' && 'cm'}{waistDifference && unitsOfMeasurement === 'imperial' && 'inches'}
              </Text>
            </View>
            <View style={styles.dataContainer}>
              <Text style={styles.dataText}>
                {currentProgressInfo ? currentProgressInfo.waist : '-'} {currentProgressInfo && unitsOfMeasurement === 'metric' && 'cm'}{currentProgressInfo && unitsOfMeasurement === 'imperial' && 'inches'}
              </Text>
            </View>
          </View>
          <View style={styles.dataRowContainer}>
            <View style={styles.dataContainer}>
              <Text style={styles.dataText}>
                {initialProgressInfo ? initialProgressInfo.hip : '-'} {initialProgressInfo && unitsOfMeasurement === 'metric' && 'cm'}{initialProgressInfo && unitsOfMeasurement === 'imperial' && 'inches'}
              </Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldText}>
                HIP
              </Text>
              <Text
                style={[
                  styles.dataTextNegative,
                  hipDifference >= 0 && styles.dataTextPositive,
                ]}
              >
                {hipDifference || '-'} {hipDifference && unitsOfMeasurement === 'metric' && 'cm'}{hipDifference && unitsOfMeasurement === 'imperial' && 'inches'}
              </Text>
            </View>
            <View style={styles.dataContainer}>
              <Text style={styles.dataText}>
                {currentProgressInfo ? currentProgressInfo.hip : '-'} {currentProgressInfo && unitsOfMeasurement === 'metric' && 'cm'}{currentProgressInfo && unitsOfMeasurement === 'imperial' && 'inches'}
              </Text>
            </View>
          </View>
          <View style={styles.dataRowContainer}>
            <View style={styles.dataContainer}>
              <Text style={styles.dataText}>
                {initialProgressInfo ? initialProgressInfo.burpeeCount : '-'}
              </Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldText}>
                BURPEES
              </Text>
              <Text
                style={[
                  styles.dataTextNegative,
                  burpeesDifference >= 0 && styles.dataTextPositive,
                ]}
              >
                {burpeesDifference || '-'}
              </Text>
            </View>
            <View style={styles.dataContainer}>
              <Text style={styles.dataText}>
                {currentProgressInfo ? currentProgressInfo.burpeeCount : '-'}
              </Text>
            </View>
          </View>
          {
            initialProgressInfo && currentProgressInfo && (
              <View style={styles.buttonContainer}>
                <CustomButton
                  title="UPDATE PROGRESS"
                  onPress={() => this.props.navigation.navigate('Progress1', { isInitial: false })}
                  blue
                />
              </View>
            )
          }
        </ScrollView>
        <HelperModal
          helperModalVisible={helperModalVisible}
          toggleHelperModal={() => this.toggleHelperModal()}
          headingText="Progress"
          bodyText="We want you to enjoy the journey just as much as the destination. By tracking your progress, you can stay accountable and motivate you throughout the journey."
          bodyText2="Your ‘before’ photo and measurements will stay on the left of screen.  When it comes time to check-in, your ‘after’ photo and measurement will be uploaded on the right."
          bodyText3="When you want to update your ‘after’ photo, press the update button at the bottom of screen. You can reset your ‘before’ photo in Profile => Settings."
          color="blue"
        />
        <ImageModal
          imageModalVisible={imageModalVisible}
          toggleImageModal={() => this.toggleImageModal()}
          color="blue"
          imageSource={{ uri: imageModalSource }}
        />
        <Loader
          loading={loading}
          color={colors.blue.standard}
        />
      </View>
    );
  }
}

ProgressHomeScreen.propTypes = {
  setTimeout: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
  },
  contentContainer: {
    width,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
    paddingBottom: 5,
  },
  imagesContainer: {
    width,
    flexDirection: 'row',
    shadowColor: colors.grey.standard,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  image: {
    width: width / 2,
    height: (width / 3) * 2,
  },
  imagePlaceholder: {
    backgroundColor: colors.grey.light,
    width: width / 2,
    height: (width / 3) * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderButton: {
    backgroundColor: colors.blue.standard,
    width: '70%',
    padding: 10,
    borderRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  disabledImagePlaceHolderButton: {
    backgroundColor: colors.blue.standard,
    width: '70%',
    padding: 10,
    borderRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    opacity: 0.5,
  },
  imagePlaceholderButtonText: {
    color: colors.white,
    fontFamily: fonts.standard,
    fontSize: 12,
    textAlign: 'center',
  },
  addIcon: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  dateRowContainer: {
    width,
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 5,
  },
  dateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.black,
  },
  dataRowContainer: {
    width: width - 20,
    marginTop: 5,
    marginBottom: 5,
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 2,
    shadowColor: colors.grey.standard,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  fieldContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.blue.standard,
  },
  fieldText: {
    fontFamily: fonts.standard,
    fontSize: 12,
    color: colors.white,
    marginTop: 5,
    marginBottom: 5,
  },
  dataContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.black,
  },
  dataTextPositive: {
    marginBottom: 5,
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
  },
  dataTextNegative: {
    marginBottom: 5,
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
  },
  buttonContainer: {
    paddingTop: 5,
    paddingBottom: 5,
  },
});

export default ReactTimeout(ProgressHomeScreen);
