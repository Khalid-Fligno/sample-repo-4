import React from 'react';
import { StyleSheet, View, Text, AsyncStorage, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { FileSystem } from 'expo';
import { PieChart } from 'react-native-svg-charts';
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

export default class HiitWorkoutCompleteScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  componentDidMount = () => {
    try {
      FileSystem.deleteAsync(`${FileSystem.cacheDirectory}exercise-1.mp4`, { idempotent: true });
      FileSystem.deleteAsync(`${FileSystem.cacheDirectory}exercise-2.mp4`, { idempotent: true });
    } catch (err) {
      Alert.alert('Filesystem delete error', `${err}`);
    }
  }
  completeHiitWorkout = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    const userRef = db.collection('users').doc(uid);
    return db.runTransaction((transaction) => {
      return transaction.get(userRef).then((userDoc) => {
        const newHiitWeeklyComplete = userDoc.data().weeklyTargets.hiitWeeklyComplete + 1;
        const oldWeeklyTargets = userDoc.data().weeklyTargets;
        const newWeeklyTargets = updateWeeklyTargets(oldWeeklyTargets, 'resistanceWeeklyComplete', newHiitWeeklyComplete);
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
            size={60}
          />
        </View>
      </View>
    );
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.flexContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>
              Workout Complete
            </Text>
            <Text style={styles.bodyText}>
              Congratulations!  Press the button at the bottom of your screen to complete your workout.
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
    justifyContent: 'space-between',
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
    marginLeft: 3,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieChart: {
    height: 120,
    width: 120,
  },
  invisibleView: {
    height: 0,
  },
  tickContainer: {
    marginTop: -90,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
});
