import React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, AsyncStorage, TouchableOpacity } from 'react-native';
import moment from 'moment';
import Image from 'react-native-image-progress';
import { db } from '../../../../config/firebase';
import Loader from '../../../components/Loader';
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
            loading: false,
          });
        } else {
          this.setState({ loading: false });
        }
      });
  }
  render() {
    const { loading, initialProgressInfo, currentProgressInfo } = this.state;
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
          <View style={styles.imagesContainer}>
            {
              initialProgressInfo ? (
                <Image
                  source={{ uri: initialProgressInfo.photoURL }}
                  style={styles.image}
                />
              ) : (
                <View
                  style={{
                    backgroundColor: 'blue',
                    width: width / 2,
                    height: (width / 3) * 2,
                  }}
                />
              )
            }
            {
              currentProgressInfo ? (
                <Image
                  source={{ uri: currentProgressInfo.photoURL }}
                  style={styles.image}
                />
              ) : (
                <View
                  style={{
                    backgroundColor: 'green',
                    width: width / 2,
                    height: (width / 3) * 2,
                  }}
                />
              )
            }
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.fieldText}>
              DATE
            </Text>
            <View style={styles.dataRowContainer}>
              <View style={styles.dataContainer}>
                <Text style={styles.dataText}>
                  {initialProgressInfo && moment(initialProgressInfo.date).format('DD/MM/YYYY')}
                </Text>
              </View>
              <View style={styles.dataContainer} />
              <View style={styles.dataContainer}>
                <Text style={styles.dataText}>
                  {currentProgressInfo && moment(currentProgressInfo.date).format('DD/MM/YYYY')}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.fieldText}>
              WEIGHT
            </Text>
            <View style={styles.dataRowContainer}>
              <View style={styles.dataContainer}>
                <Text style={styles.dataText}>
                  {initialProgressInfo && initialProgressInfo.weight}
                </Text>
              </View>
              <View style={styles.dataContainer}>
                <Text style={[
                    styles.dataTextNegative,
                    weightDifference >= 0 && styles.dataTextPositive,
                  ]}
                >
                  {weightDifference}
                </Text>
              </View>
              <View style={styles.dataContainer}>
                <Text style={styles.dataText}>
                  {currentProgressInfo && currentProgressInfo.weight}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.fieldText}>
              HIP
            </Text>
            <View style={styles.dataRowContainer}>
              <View style={styles.dataContainer}>
                <Text style={styles.dataText}>
                  {initialProgressInfo && initialProgressInfo.hip}
                </Text>
              </View>
              <View style={styles.dataContainer}>
                <Text style={[
                    styles.dataTextNegative,
                    hipDifference >= 0 && styles.dataTextPositive,
                  ]}
                >
                  {hipDifference}
                </Text>
              </View>
              <View style={styles.dataContainer}>
                <Text style={styles.dataText}>
                  {currentProgressInfo && currentProgressInfo.hip}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.fieldText}>
              WAIST
            </Text>
            <View style={styles.dataRowContainer}>
              <View style={styles.dataContainer}>
                <Text style={styles.dataText}>
                  {initialProgressInfo && initialProgressInfo.waist}
                </Text>
              </View>
              <View style={styles.dataContainer}>
                <Text style={[
                    styles.dataTextNegative,
                    waistDifference >= 0 && styles.dataTextPositive,
                  ]}
                >
                  {waistDifference}
                </Text>
              </View>
              <View style={styles.dataContainer}>
                <Text style={styles.dataText}>
                  {currentProgressInfo && currentProgressInfo.waist}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.fieldText}>
              BURPEES
            </Text>
            <View style={styles.dataRowContainer}>
              <View style={styles.dataContainer}>
                <Text style={styles.dataText}>
                  {initialProgressInfo && initialProgressInfo.burpeeCount}
                </Text>
              </View>
              <View style={styles.dataContainer}>
                <Text style={[
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
          <View
            style={{
              flexDirection: 'row',
              width,
              paddingLeft: 5,
              paddingRight: 5,
            }}
          >
            {/* <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Onboarding2', { isInitial: true })}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                margin: 5,
                padding: 20,
                backgroundColor: colors.blue.standard,
              }}
            >
              <Text>Add Initial</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Onboarding2', { isInitial: false })}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                margin: 5,
                padding: 10,
                backgroundColor: colors.blue.standard,
              }}
            >
              <Text>RETEST</Text>
            </TouchableOpacity>
          </View>
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
  },
  imagesContainer: {
    width,
    flexDirection: 'row',
  },
  image: {
    width: width / 2,
    height: (width / 3) * 2,
  },
  sectionContainer: {
    alignItems: 'center',
  },
  fieldText: {
    marginTop: 5,
    marginBottom: 5,
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.standard,
  },
  dataRowContainer: {
    width,
    flexDirection: 'row',
    backgroundColor: colors.white,
  },
  dataContainer: {
    flex: 1,
    alignItems: 'center',
  },
  dataText: {
    marginTop: 10,
    marginBottom: 10,
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.black,
  },
  dataTextPositive: {
    marginTop: 10,
    marginBottom: 10,
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.green.standard,
  },
  dataTextNegative: {
    marginTop: 10,
    marginBottom: 10,
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.coral.standard,
  },
});
