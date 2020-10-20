import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import ReactTimeout from 'react-timeout';
import { db } from '../../../../config/firebase';
import Loader from '../../../components/Shared/Loader';
import ProgressBar from '../../../components/Progress/ProgressBar';
import Icon from '../../../components/Shared/Icon';
import HelperModal from '../../../components/Shared/HelperModal';
import CustomButton from '../../../components/Shared/CustomButton';
import ImageModal from '../../../components/Progress/ImageModal';
import { diff } from '../../../utils/index';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';
import { widthPercentageToDP as wp ,heightPercentageToDP as hp} from 'react-native-responsive-screen';

const { width } = Dimensions.get('window');

class ProgressHomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      profile: undefined,
      initialProgressInfo: undefined,
      currentProgressInfo: undefined,
      unitsOfMeasurement: undefined,
      helperModalVisible: false,
      imageModalVisible: false,
      imageModalSource: undefined,
      activeChallengeUserData:undefined,
      activeChallengeData:undefined,
      totalInterval:undefined,
      totalCircuit:undefined,
      totalStrength:undefined,
      totalIntervalCompleted:undefined,
      totalCircuitCompleted:undefined,
      totalStrengthCompleted:undefined,
    };
  }
  componentDidMount() {
    this.props.navigation.setParams({ toggleHelperModal: this.showHelperModal });
    this.fetchProgressInfo();
    this.showHelperOnFirstOpen();
    this.fetchActiveChallengeUserData();
  }
  componentWillUnmount() {
    this.unsubscribe();
    if(this.unsubscribeFACUD)
    this.unsubscribeFACUD()
    if(this.unsubscribeFACD)
      this.unsubscribeFACD()  
  }
  showHelperOnFirstOpen = async () => {
    const helperShownOnFirstOpen = await AsyncStorage.getItem('progressHelperShownOnFirstOpen');
    if (helperShownOnFirstOpen === null) {
      this.props.setTimeout(() => this.setState({ helperModalVisible: true }), 1200);
      AsyncStorage.setItem('progressHelperShownOnFirstOpen', 'true');
    }
  }
  showHelperModal = () => {
    this.setState({ helperModalVisible: true });
  }
  hideHelperModal = () => {
    this.setState({ helperModalVisible: false });
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
    const userRef = db.collection('users').doc(uid);
    this.unsubscribe = userRef.onSnapshot(async (doc) => {
      this.setState({
        profile: await doc.data(),
        initialProgressInfo: await doc.data().initialProgressInfo,
        currentProgressInfo: await doc.data().currentProgressInfo.weight?await doc.data().currentProgressInfo:null,
        unitsOfMeasurement: await doc.data().unitsOfMeasurement,
        loading: false,
      });
      if (await doc.data().weeklyTargets.currentWeekStartDate !== moment().startOf('week').format('YYYY-MM-DD')) {
        const data = {
          weeklyTargets: {
            resistanceWeeklyComplete: 0,
            hiitWeeklyComplete: 0,
            currentWeekStartDate: moment().startOf('week').format('YYYY-MM-DD'),
          },
        };
        await userRef.set(data, { merge: true });
      }
    });
  }

  // ToDo : for challenges
  fetchActiveChallengeUserData = async () =>{
    try{  
      this.setState({ loading: true });
      const uid = await AsyncStorage.getItem('uid');
      this.unsubscribeFACUD = await db.collection('users').doc(uid).collection('challenges')
      .where("status", "==" , "Active")
      .onSnapshot(async (querySnapshot) => {
        const list = [];
        await querySnapshot.forEach(async (doc) => {
            await list.push(await doc.data());
        });
        if(list[0]){
          this.fetchActiveChallengeData(list[0])
        }else{
          this.setState({ 
            activeChallengeUserData:undefined,
            loading:false
          });
        }
      });
    }
    catch(err){
      this.setState({ loading: false });
      console.log(err)
      Alert.alert('Fetch active challenge user data error!')
    }  

  }

  fetchActiveChallengeData = async (activeChallengeUserData) =>{
    try{
      this.unsubscribeFACD = await db.collection('challenges').doc(activeChallengeUserData.id)
      .onSnapshot(async (doc) => {
          if(doc.exists){
            const activeChallengeData = doc.data()
            //TODO calculate total interval circuit strength completed user during challenge
            const totalWorkouts =[] 
            activeChallengeData.phases.forEach(phase => {
              phase.workouts.forEach(workout =>{
                totalWorkouts.push(workout)
              })
            });
            
            const totalInterval = totalWorkouts.filter((res)=>res.target === 'interval')
            const totalCircuit = totalWorkouts.filter((res)=>res.target === 'circuit')
            const totalStrength = totalWorkouts.filter((res)=>res.target === 'strength')
      
            const totalIntervalCompleted = activeChallengeUserData.workouts.filter((res)=>res.target === 'interval')
            const totalCircuitCompleted = activeChallengeUserData.workouts.filter((res)=>res.target === 'circuit')
            const totalStrengthCompleted = activeChallengeUserData.workouts.filter((res)=>res.target === 'strength')
            
            
            this.setState({ 
              activeChallengeUserData,
              activeChallengeData,
              totalInterval,
              totalCircuit,
              totalStrength,
              totalIntervalCompleted,
              totalCircuitCompleted,
              totalStrengthCompleted,
              loading:false
            });
          }
      
      });
    }catch(err){
      this.setState({ loading: false });
      console.log(err);
      Alert.alert('Fetch active challenge data error!')
    }

  }
 //-------**--------  

  render() {
    const {
      loading,
      profile,
      initialProgressInfo,
      currentProgressInfo,
      unitsOfMeasurement,
      helperModalVisible,
      imageModalVisible,
      imageModalSource,
      activeChallengeData,
      activeChallengeUserData,
      totalInterval,
      totalCircuit,
      totalStrength,
      totalIntervalCompleted,
      totalCircuitCompleted,
      totalStrengthCompleted,
    } = this.state;

    let totalI = 0;
    let totalC = 0;
    let totalS = 0;
    let countI = 0;
    let countC = 0;
    let countS = 0;

    if(activeChallengeData !== undefined){
      totalI = totalInterval.length;
      totalC = totalCircuit.length;
      totalS = totalStrength.length;

      countI = totalIntervalCompleted.length;
      countC = totalCircuitCompleted.length;
      countS = totalStrengthCompleted.length;
    }else if(profile !== undefined){
      totalI = 5;
      totalC = 5;
      totalS = 5;

      countI = profile.weeklyTargets.interval;
      countC = profile.weeklyTargets.circuit;
      countS = profile.weeklyTargets.strength;
    }

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
                    disabled={initialProgressInfo === undefined}
                    style={[
                      styles.imagePlaceholderButton,
                      initialProgressInfo === undefined && styles.disabledImagePlaceHolderButton,
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
                {initialProgressInfo ? initialProgressInfo.weight : '-'} {initialProgressInfo && unitsOfMeasurement === 'metric' && 'kg'}
                {initialProgressInfo && unitsOfMeasurement === 'imperial' && 'lbs'}
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
                {currentProgressInfo ? currentProgressInfo.weight : '-'} {currentProgressInfo && unitsOfMeasurement === 'metric' && 'kg'}
                {currentProgressInfo && unitsOfMeasurement === 'imperial' && 'lbs'}
              </Text>
            </View>
          </View>
          <View style={styles.dataRowContainer}>
            <View style={styles.dataContainer}>
              <Text style={styles.dataText}>
                {initialProgressInfo ? initialProgressInfo.waist : '-'} {initialProgressInfo && unitsOfMeasurement === 'metric' && 'cm'}
                {initialProgressInfo && unitsOfMeasurement === 'imperial' && 'inches'}
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
                {currentProgressInfo ? currentProgressInfo.waist : '-'} {currentProgressInfo && unitsOfMeasurement === 'metric' && 'cm'}
                {currentProgressInfo && unitsOfMeasurement === 'imperial' && 'inches'}
              </Text>
            </View>
          </View>
          <View style={styles.dataRowContainer}>
            <View style={styles.dataContainer}>
              <Text style={styles.dataText}>
                {initialProgressInfo ? initialProgressInfo.hip : '-'} {initialProgressInfo && unitsOfMeasurement === 'metric' && 'cm'}
                {initialProgressInfo && unitsOfMeasurement === 'imperial' && 'inches'}
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
                {currentProgressInfo ? currentProgressInfo.hip : '-'} {currentProgressInfo && unitsOfMeasurement === 'metric' && 'cm'}
                {currentProgressInfo && unitsOfMeasurement === 'imperial' && 'inches'}
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
          <View style={styles.workoutProgressContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.bodyText}>
              {activeChallengeData?'Active challenge progress' :'Weekly workout progress'}
              </Text>
            </View>
            <View style={{flexDirection:'row',justifyContent:"space-between",width:"100%"}}>
                    {
                      profile && (
                        <View>
                          <ProgressBar
                            title="Strength"
                            completed={countS}
                            total = {totalS}
                            size ={wp('38%')}
                          />
                        </View>
                      )
                    }
                    {
                      profile && (
                        <View>
                          <ProgressBar
                            title="Circuit"
                            completed={countC}
                            total = {totalC}
                            size ={wp('38%')}
                          />
                        </View>
                      )
                    }
                </View>
                <View style={{width:'100%',flexDirection:"row",justifyContent:"center",marginTop:-30}}>
                    {
                          profile && (
                            <View>
                              <ProgressBar
                                title="Interval"
                                completed={countI}
                                total = {countI}
                                size ={wp('38%')}
                              />
                            </View>
                          )
                        }
                </View>
          </View>
        </ScrollView>
        <HelperModal
          helperModalVisible={helperModalVisible}
          hideHelperModal={this.hideHelperModal}
          headingText="Progress"
          bodyText="By tracking your progress, you can stay accountable and motivated throughout your fitness journey."
          bodyText2="Your ‘before’ photo and measurements will stay on the left of screen.  When it comes time to check-in, your ‘after’ photo and measurement will be uploaded on the right."
          bodyText3="When you want to update your ‘after’ photo, press the update button at the bottom of screen. You can reset your ‘before’ photo in Profile => Settings."
          color="red"
        />
        <ImageModal
          imageModalVisible={imageModalVisible}
          toggleImageModal={() => this.toggleImageModal()}
          color="red"
          imageSource={{ uri: imageModalSource }}
        />
        <Loader
          loading={loading}
          color={colors.red.standard}
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
    backgroundColor: colors.themeColor.lightColor,
    width: '70%',
    padding: 10,
    borderRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  disabledImagePlaceHolderButton: {
    backgroundColor: colors.themeColor.lightColor,
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
    backgroundColor: colors.themeColor.lightColor,
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
  workoutProgressContainer: {
    alignItems: 'center',
    width: width - 20,
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    backgroundColor:'transparent',
    borderRadius: 2,
    shadowColor: colors.themeColor.lightColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  sectionHeader: {
    alignItems: 'center',
    // backgroundColor: colors.themeColor.lightColor,
    width: width - 20,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    padding: 8,
    paddingBottom: 5,
  },
  bodyText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.grey.dark,
    fontWeight:'500',
    paddingVertical:20,
    textAlign:"center",
    width:'100%'
  },
});

export default ReactTimeout(ProgressHomeScreen);
