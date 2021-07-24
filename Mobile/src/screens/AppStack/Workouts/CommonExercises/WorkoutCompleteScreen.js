import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Dimensions,
  Image
} from 'react-native';
import { ListItem } from 'react-native-elements';
import * as FileSystem from 'expo-file-system';
import { PieChart } from 'react-native-svg-charts';
import Rate from 'react-native-rate';
import Loader from '../../../../components/Shared/Loader';
import Icon from '../../../../components/Shared/Icon';
import CustomButton from '../../../../components/Shared/CustomButton';
import fonts from '../../../../styles/fonts';
import colors from '../../../../styles/colors';
import { Platform } from 'react-native';
import globalStyle from "../../../../styles/globalStyles";

const { width } = Dimensions.get('window');

const pieDataComplete = [100, 0]
  .map((value, index) => ({
    value,
    svg: {
      fill: colors.coral.standard,
    },
    key: `pie-${index}`,
  }));

export default class WorkoutCompleteScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  componentDidMount = async () => {
    this.manageVideoCache();
    if(Platform.OS === 'ios')
      this.showRatePopup();
  }
  showRatePopup = async () => {
    Rate.rate({ AppleAppID: '1438373600', preferInApp: true, openAppStoreIfInAppFails: false });
  }
  manageVideoCache = async () => {
    FileSystem.readDirectoryAsync(`${FileSystem.cacheDirectory}`).then((res)=>{
      // console.log(res)
        Promise.all(res.map(async (item,index) => {
            if (item.includes("exercise-")) {
              console.log(`${FileSystem.cacheDirectory}${item}`)
              FileSystem.deleteAsync(`${FileSystem.cacheDirectory}${item}`, { idempotent: true }).then(()=>{
                console.log("deleted...",item)
              })
            }
        }))
    })
  }
  completeWorkout = async () => {
    const extraProps = this.props.navigation.getParam('extraProps', undefined)
    if(extraProps['fromCalender']){
      this.props.navigation.navigate('CalendarHome');
    }else{
      this.props.navigation.navigate('WorkoutsHome');
    }
  }
  completeWorkoutAndInvite = async () => {
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
          {/* <View style={styles.textContainer}>
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
          </View> */}
          <Image
            source={require("../../../../../assets/icons/FITAZ_BrandMark.png")}
            style={{width: 160}}
            resizeMode="contain"
          />
          <View style={styles.iconContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.headerText}>
                WORKOUT COMPLETE
              </Text>
              <Text style={styles.bodyText}>
                "Congratulations on empowering yourself!"
              </Text>
              <Text style={styles.bodyText}>
                "See you back here soon."
              </Text>
            </View>
          </View>
          <View>
            {/* <ListItem
              key="InviteFriends"
              title="Earn Free Gifts!"
              containerStyle={styles.listItemContainerGreen}
              titleStyle={styles.listItemTitleStyleGreen}
              onPress={() => this.completeWorkoutAndInvite()}
              leftIcon={
                <Icon
                  name="present"
                  size={20}
                  color={colors.green.forest}
                  style={styles.giftIcon}
                />
              }
              rightIcon={{ name: 'chevron-right', color: colors.grey.standard }}
            /> */}
            <View style={styles.buttonContainer}>
              <CustomButton
                title="NEXT"
                onPress={() => this.completeWorkout()}
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
    // fontFamily: fonts.ultraItalic,
    fontFamily: fonts.SimplonMonoMedium,
    fontSize: 44,
    color: colors.themeColor.color,
    textAlign: 'center',
    //
    paddingBottom: 25
  },
  bodyText: {
    // fontFamily: fonts.bold,
    fontFamily: fonts.SimplonMonoLight,
    fontSize: 16,
    color: colors.charcoal.dark,
    marginTop: 10,
    textAlign: 'center',
    //
    paddingBottom: 25
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
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
    width,
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
