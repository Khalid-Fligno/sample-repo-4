import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, ScrollView, Dimensions, AsyncStorage, TouchableOpacity, Alert } from 'react-native';
import { FileSystem } from 'expo';
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
    db.collection('users').doc(uid)
      .get()
      .then(async (doc) => {
        if (doc.exists && doc.data().initialProgressInfo) {
          const images = [];
          await images.push(await doc.data().initialProgressInfo.photoURL, await doc.data().currentProgressInfo && await doc.data().currentProgressInfo.photoURL);
          await Promise.all(images.map(async (image, index) => {
            const fileUri = `${FileSystem.cacheDirectory}progress-photo-${index}.jpg`;
            await FileSystem.getInfoAsync(fileUri)
              .then(async ({ exists }) => {
                if (!exists) {
                  await FileSystem.downloadAsync(
                    image,
                    `${FileSystem.cacheDirectory}progress-photo-${index}.jpg`,
                  );
                }
              }).catch(() => {
                Alert.alert('Image download error');
              });
          }));
          this.setState({
            initialProgressInfo: await doc.data().initialProgressInfo,
            currentProgressInfo: await doc.data().currentProgressInfo,
            unitsOfMeasurement: await doc.data().unitsOfMeasurement,
            loading: false,
          });
        } else {
          this.setState({ loading: false });
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
                      Add initial progress info
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
                      Add current progress info
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
                {initialProgressInfo ? initialProgressInfo.weight : '-'} {unitsOfMeasurement === 'metric' && 'kg'}{unitsOfMeasurement === 'imperial' && 'lbs'}
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
                  title="RETEST YOUR PROGRESS"
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
          bodyText="This tab will show you how far you've come from when you first started."
          bodyText2="Your initial progress photo and info will always stay on the left of this screen."
          bodyText3="Re-testing your progress will update the photo and information on the right hand side."
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
    shadowColor: colors.charcoal.standard,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
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
    fontFamily: fonts.bold,
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
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
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
