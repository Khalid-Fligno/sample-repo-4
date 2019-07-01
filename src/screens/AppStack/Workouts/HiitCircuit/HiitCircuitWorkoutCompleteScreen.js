import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import * as FileSystem from 'expo-file-system';
import { PieChart } from 'react-native-svg-charts';
import Rate from 'react-native-rate';
import Loader from '../../../../components/Shared/Loader';
import Icon from '../../../../components/Shared/Icon';
import CustomButton from '../../../../components/Shared/CustomButton';
import { db } from '../../../../../config/firebase';
import fonts from '../../../../styles/fonts';
import colors from '../../../../styles/colors';

const { width } = Dimensions.get('window');

const updateWeeklyTargets = (obj, field, newTally) => {
  return Object.assign({}, obj, { [field]: newTally });
};

const pieDataComplete = [100, 0]
  .map((value, index) => ({
    value,
    svg: {
      fill: colors.coral.standard,
    },
    key: `pie-${index}`,
  }));

export default class HiitCircuitWorkoutCompleteScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  componentDidMount = async () => {
    this.manageVideoCache();
    if (Rate.rate !== undefined) {
      Rate.rate({ AppleAppID: '1438373600', preferInApp: true, openAppStoreIfInAppFails: false });
    }
  }
  manageVideoCache = async () => {
    const exerciseVideos = [
      `${FileSystem.cacheDirectory}exercise-hiit-circuit-1.mp4`,
      `${FileSystem.cacheDirectory}exercise-hiit-circuit-2.mp4`,
      `${FileSystem.cacheDirectory}exercise-hiit-circuit-3.mp4`,
      `${FileSystem.cacheDirectory}exercise-hiit-circuit-4.mp4`,
      `${FileSystem.cacheDirectory}exercise-hiit-circuit-5.mp4`,
      `${FileSystem.cacheDirectory}exercise-hiit-circuit-6.mp4`,
    ];
    Promise.all(exerciseVideos.map(async (exerciseVideoURL) => {
      FileSystem.deleteAsync(exerciseVideoURL, { idempotent: true });
    }));
  }
  completeHiitWorkout = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    const userRef = db.collection('users').doc(uid);
    return db.runTransaction((transaction) => {
      return transaction.get(userRef).then((userDoc) => {
        const newHiitWeeklyComplete = userDoc.data().weeklyTargets.hiitWeeklyComplete + 1;
        const oldWeeklyTargets = userDoc.data().weeklyTargets;
        const newWeeklyTargets = updateWeeklyTargets(oldWeeklyTargets, 'hiitWeeklyComplete', newHiitWeeklyComplete);
        transaction.update(userRef, { weeklyTargets: newWeeklyTargets });
        this.setState({ loading: false });
        this.props.navigation.navigate('WorkoutsHome');
      });
    });
  }
  render() {
    const { loading } = this.state;
    const completePieChart = (
      <PieChart
        style={styles.pieChart}
        data={pieDataComplete}
        innerRadius="80%"
      />
    );
    const tickIcon = (
      <View style={styles.invisibleView}>
        <View style={styles.tickContainer}>
          <Icon
            name="tick-heavy"
            color={colors.charcoal.dark}
            size={100}
          />
        </View>
      </View>
    );
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.flexContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>
              WORKOUT
            </Text>
            <Text style={styles.headerText}>
              COMPLETE
            </Text>
            <Text style={styles.bodyText}>
              {"EVERY SESSION GETS YOU CLOSER TO SMASHING YOUR GOALS.  YOU'VE GOT THIS!"}
            </Text>
          </View>
          <View style={styles.iconContainer}>
            {completePieChart}
            {tickIcon}
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              title="COMPLETE"
              onPress={() => this.completeHiitWorkout()}
              primary
            />
          </View>
          <Loader
            color={colors.coral.standard}
            loading={loading}
          />
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
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    width,
    padding: 10,
    paddingTop: 25,
  },
  headerText: {
    fontFamily: fonts.bold,
    fontSize: 48,
    color: colors.coral.standard,
    textAlign: 'center',
  },
  bodyText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.charcoal.dark,
    marginTop: 10,
    textAlign: 'center',
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieChart: {
    height: 160,
    width: 160,
  },
  invisibleView: {
    height: 0,
  },
  tickContainer: {
    marginTop: -130,
  },
  buttonContainer: {
    padding: 10,
  },
});
