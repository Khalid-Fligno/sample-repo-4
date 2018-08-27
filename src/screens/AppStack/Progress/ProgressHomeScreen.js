import React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, AsyncStorage, Image } from 'react-native';
import { db } from '../../../../config/firebase';
import Loader from '../../../components/Loader';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

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
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View
            style={{
              width,
              flexDirection: 'row',
            }}
          >
            {
              initialProgressInfo ? (
                <Image
                  source={{ uri: initialProgressInfo.photoURL }}
                  style={{
                    width: width / 2,
                    height: (width / 3) * 2,
                  }}
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
                  style={{
                    width: width / 2,
                    height: (width / 3) * 2,
                  }}
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
          <View
            style={{
              width,
              flexDirection: 'row',
              backgroundColor: colors.white,
            }}
          >
            <View
              style={{
                flex: 1,
                alignItems: 'center',
              }}
            >
              <Text style={styles.dataText}>
                Initial
              </Text>
              <Text style={styles.dataText}>
                {initialProgressInfo && initialProgressInfo.weight}
              </Text>
              <Text style={styles.dataText}>
                {initialProgressInfo && initialProgressInfo.hip}
              </Text>
              <Text style={styles.dataText}>
                {initialProgressInfo && initialProgressInfo.waist}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.blue.light,
                alignItems: 'center',
                borderRadius: 4,
              }}
            >
              <Text style={styles.fieldText}>
                -
              </Text>
              <Text style={styles.fieldText}>
                Weight
              </Text>
              <Text style={styles.fieldText}>
                Hip
              </Text>
              <Text style={styles.fieldText}>
                Waist
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
              }}
            >
              <Text style={styles.dataText}>
                Current
              </Text>
              <Text style={styles.dataText}>
                {currentProgressInfo && currentProgressInfo.weight}
              </Text>
              <Text style={styles.dataText}>
                {currentProgressInfo && currentProgressInfo.hip}
              </Text>
              <Text style={styles.dataText}>
                {currentProgressInfo && currentProgressInfo.waist}
              </Text>
            </View>
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
  fieldText: {
    marginTop: 10,
    marginBottom: 10,
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.charcoal.dark,
  },
  dataText: {
    marginTop: 10,
    marginBottom: 10,
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.charcoal.dark,
  },
});
