import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  Dimensions,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import * as FileSystem from 'expo-file-system';
import { PieChart } from 'react-native-svg-charts';
import Rate from 'react-native-rate';
import Loader from '../../../../components/Shared/Loader';
import Icon from '../../../../components/Shared/Icon';
import CustomButton from '../../../../components/Shared/CustomButton';
import fonts from '../../../../styles/fonts';
import colors from '../../../../styles/colors';

const { width } = Dimensions.get('window');

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
  componentDidMount = () => {
    this.manageVideoCache();
    // this.showRatePopup();
  }
  showRatePopup = async () => {
    const lastRatingRequest = await AsyncStorage.getItem('lastRatingRequest');
    if (lastRatingRequest === null) {
      Rate.rate({ AppleAppID: '1438373600', preferInApp: true, openAppStoreIfInAppFails: false }, (success) => {
        if (success) {
          AsyncStorage.setItem('lastRatingRequest', Date.now());
        }
      });
    }
    if (lastRatingRequest !== null && (Date.now() - lastRatingRequest) > 10368000000) {
      Rate.rate({ AppleAppID: '1438373600', preferInApp: true, openAppStoreIfInAppFails: false }, (success) => {
        if (success) {
          AsyncStorage.setItem('lastRatingRequest', Date.now());
        }
      });
    }
  }
  manageVideoCache = () => {
    const exerciseVideos = [
      `${FileSystem.cacheDirectory}exercise-hiit-circuit-1.mp4`,
      `${FileSystem.cacheDirectory}exercise-hiit-circuit-2.mp4`,
      `${FileSystem.cacheDirectory}exercise-hiit-circuit-3.mp4`,
      `${FileSystem.cacheDirectory}exercise-hiit-circuit-4.mp4`,
      `${FileSystem.cacheDirectory}exercise-hiit-circuit-5.mp4`,
      `${FileSystem.cacheDirectory}exercise-hiit-circuit-6.mp4`,
    ];
    Promise.all(exerciseVideos.map((exerciseVideoURL) => {
      return FileSystem.deleteAsync(exerciseVideoURL, { idempotent: true });
    }));
  }
  completeHiitCircuitWorkout = async () => {
    this.props.navigation.navigate('WorkoutsHome');
  }
  completeHiitCircuitWorkoutAndInvite = async () => {
    this.props.navigation.navigate('WorkoutsHome');
    this.props.navigation.navigate('InviteFriends');
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
          <View>
            <ListItem
              key="InviteFriends"
              title="Earn Free Gifts!"
              containerStyle={styles.listItemContainerGreen}
              titleStyle={styles.listItemTitleStyleGreen}
              onPress={() => this.completeHiitCircuitWorkoutAndInvite()}
              leftIcon={
                <Icon
                  name="present"
                  size={20}
                  color={colors.green.forest}
                  style={styles.giftIcon}
                />
              }
              rightIcon={{ name: 'chevron-right', color: colors.grey.standard }}
            />
            <View style={styles.buttonContainer}>
              <CustomButton
                title="COMPLETE"
                onPress={() => this.completeHiitCircuitWorkout()}
                primary
              />
            </View>
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
    fontFamily: fonts.ultraItalic,
    fontSize: 44,
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
  listItemContainerGreen: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 0,
    backgroundColor: colors.green.superLight,
  },
  listItemTitleStyleGreen: {
    fontFamily: fonts.bold,
    color: colors.green.forest,
    marginTop: 5,
    fontSize: 14,
  },
  giftIcon: {
    marginLeft: 8,
    marginRight: 8,
  },
});
