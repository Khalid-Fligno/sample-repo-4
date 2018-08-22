import React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, AsyncStorage } from 'react-native';
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
    };
  }
  componentDidMount = async () => {
    const uid = await AsyncStorage.getItem('uid');
    db.collection('users').doc(uid)
      .get()
      .then(async (doc) => {
        if (doc.exists && doc.data().initialProgressInfo) {
          this.setState({ initialProgressInfo: await doc.data().initialProgressInfo });
        } else {
          console.log("No such document!");
        }
      });
  }
  render() {
    const { loading, initialProgressInfo } = this.state;
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
            <View
              style={{
                backgroundColor: 'blue',
                width: width / 2,
                height: width / 3 * 2
              }}
            >
              
            </View>
            <View
              style={{
                backgroundColor: 'green',
                width: width / 2,
              }}
            >
              
            </View>
          </View>
          <View
            style={{
              width,
              flexDirection: 'row',
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
                150
              </Text>
              <Text style={styles.dataText}>
                90
              </Text>
              <Text style={styles.dataText}>
                120
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
    backgroundColor: colors.white,
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
