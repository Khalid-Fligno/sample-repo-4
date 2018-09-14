import React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, AsyncStorage, TouchableOpacity } from 'react-native';
import moment from 'moment';
import Image from 'react-native-image-progress';
import { DotIndicator } from 'react-native-indicators';
import { db } from '../../../../config/firebase';
import Loader from '../../../components/Loader';
import CustomButton from '../../../components/CustomButton';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

const diff = (a, b) => {
  if ((b - a) > 0) {
    return `+${(b - a)}`;
  }
  return (b - a);
};

export default class ProgressHomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      initialProgressInfo: null,
      currentProgressInfo: null,
      unitsOfMeasurement: null,
    };
  }
  componentDidMount() {
    this.fetchProgressInfo();
  }
  fetchProgressInfo = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    db.collection('users').doc(uid)
      .get()
      .then(async (doc) => {
        if (doc.exists && doc.data().initialProgressInfo) {
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
    } = this.state;
    if (loading) {
      return (
        <Loader
          loading={loading}
          color={colors.blue.standard}
        />
      );
    }
    const weightDifference = initialProgressInfo && currentProgressInfo && diff(initialProgressInfo.weight, currentProgressInfo.weight);
    const hipDifference = initialProgressInfo && currentProgressInfo && diff(initialProgressInfo.hip, currentProgressInfo.hip);
    const waistDifference = initialProgressInfo && currentProgressInfo && diff(initialProgressInfo.waist, currentProgressInfo.waist);
    const burpeesDifference = initialProgressInfo && currentProgressInfo && diff(initialProgressInfo.burpeeCount, currentProgressInfo.burpeeCount);
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.contentContainer}>
            <View style={styles.imagesContainer}>
              {
                initialProgressInfo ? (
                  <Image
                    source={{ uri: initialProgressInfo.photoURL }}
                    style={styles.image}
                    indicator={DotIndicator}
                    indicatorProps={{
                      color: colors.blue.standard,
                      count: 3,
                      size: 6,
                    }}
                  />
                ) : (
                  <View style={styles.imagePlaceholder} />
                )
              }
              {
                currentProgressInfo ? (
                  <Image
                    source={{ uri: currentProgressInfo.photoURL }}
                    style={styles.image}
                    indicator={DotIndicator}
                    indicatorProps={{
                      color: colors.blue.standard,
                      count: 3,
                      size: 6,
                    }}
                  />
                ) : (
                  <View style={styles.imagePlaceholder} />
                )
              }
            </View>
            <View style={styles.dateRowContainer}>
              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>
                  {initialProgressInfo && moment(initialProgressInfo.date).format('DD/MM/YYYY')}
                </Text>
              </View>
              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>
                  {currentProgressInfo && moment(currentProgressInfo.date).format('DD/MM/YYYY')}
                </Text>
              </View>
            </View>
            <View style={styles.dataRowContainer}>
              <View style={styles.dataContainer}>
                <Text style={styles.dataText}>
                  {initialProgressInfo && initialProgressInfo.weight} {unitsOfMeasurement === 'metric' && 'kg'}{unitsOfMeasurement === 'imperial' && 'lbs'}
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
                  {weightDifference} {unitsOfMeasurement === 'metric' && 'kg'}{unitsOfMeasurement === 'imperial' && 'lbs'}
                </Text>
              </View>
              <View style={styles.dataContainer}>
                <Text style={styles.dataText}>
                  {currentProgressInfo && currentProgressInfo.weight} {unitsOfMeasurement === 'metric' && 'kg'}{unitsOfMeasurement === 'imperial' && 'lbs'}
                </Text>
              </View>
            </View>
            <View style={styles.dataRowContainer}>
              <View style={styles.dataContainer}>
                <Text style={styles.dataText}>
                  {initialProgressInfo && initialProgressInfo.waist} {unitsOfMeasurement === 'metric' && 'cm'}{unitsOfMeasurement === 'imperial' && 'inches'}
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
                  {waistDifference} {unitsOfMeasurement === 'metric' && 'cm'}{unitsOfMeasurement === 'imperial' && 'inches'}
                </Text>
              </View>
              <View style={styles.dataContainer}>
                <Text style={styles.dataText}>
                  {currentProgressInfo && currentProgressInfo.waist} {unitsOfMeasurement === 'metric' && 'cm'}{unitsOfMeasurement === 'imperial' && 'inches'}
                </Text>
              </View>
            </View>
            <View style={styles.dataRowContainer}>
              <View style={styles.dataContainer}>
                <Text style={styles.dataText}>
                  {initialProgressInfo && initialProgressInfo.hip} {unitsOfMeasurement === 'metric' && 'cm'}{unitsOfMeasurement === 'imperial' && 'inches'}
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
                  {hipDifference} {unitsOfMeasurement === 'metric' && 'cm'}{unitsOfMeasurement === 'imperial' && 'inches'}
                </Text>
              </View>
              <View style={styles.dataContainer}>
                <Text style={styles.dataText}>
                  {currentProgressInfo && currentProgressInfo.hip} {unitsOfMeasurement === 'metric' && 'cm'}{unitsOfMeasurement === 'imperial' && 'inches'}
                </Text>
              </View>
            </View>
            <View style={styles.dataRowContainer}>
              <View style={styles.dataContainer}>
                <Text style={styles.dataText}>
                  {initialProgressInfo && initialProgressInfo.burpeeCount}
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
                  {burpeesDifference}
                </Text>
              </View>
              <View style={styles.dataContainer}>
                <Text style={styles.dataText}>
                  {currentProgressInfo && currentProgressInfo.burpeeCount}
                </Text>
              </View>
            </View>
          </View>
          <CustomButton
            title="RETEST YOUR PROGRESS"
            onPress={() => this.props.navigation.navigate('Progress1', { isInitial: false })}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
  },
  scrollView: {
    alignItems: 'center',
    paddingBottom: 10,
    width,
  },
  imagesContainer: {
    width,
    flexDirection: 'row',
  },
  image: {
    width: width / 2,
    height: (width / 3) * 2,
  },
  imagePlaceholder: {
    backgroundColor: colors.grey.standard,
    width: width / 2,
    height: (width / 3) * 2,
  },
  contentContainer: {
    backgroundColor: colors.offWhite,
    alignItems: 'center',
    paddingBottom: 5,
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
});
