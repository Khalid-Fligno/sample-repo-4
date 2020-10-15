import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Picker,
  TouchableOpacity,
  Dimensions,
  Alert,
  ImageBackground,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as Haptics from 'expo-haptics';
import * as Localization from 'expo-localization';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import CustomButton from '../../components/Shared/CustomButton';
import Loader from '../../components/Shared/Loader';
import { db } from '../../../config/firebase';
import { uomMap } from '../../utils/index';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import CustomBtn from '../../components/Shared/CustomBtn';
import globalStyle, { containerPadding } from '../../styles/globalStyles';
import Icon from '../../components/Shared/Icon';

const moment = require('moment-timezone');

const { width } = Dimensions.get('window');

export default class Onboarding1Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      chosenDate: '',
      dobModalVisible: false,
      chosenUom: 'metric',
      uomModalVisible: false,
      timezone: null,
      name: props.navigation.getParam('name', null),
      specialOffer: props.navigation.getParam('specialOffer', undefined)
    };
  }
  componentDidMount = async () => {
    const timezone = await Localization.timezone;
    this.setState({ timezone });
  }
  setDate = async (event, selectedDate) => {
    const currentDate = selectedDate;
    this.setState({ chosenDate: currentDate?currentDate:new Date(1990, 0, 1) });
  }
  handleSubmit = async (chosenDate, chosenUom) => {
    const {name ,specialOffer } = this.state
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    this.setState({ loading: true });
    try {
      const timezone = await Localization.timezone;
      const dob = moment.tz(chosenDate, timezone).format('YYYY-MM-DD');
      const uid = await AsyncStorage.getItem('uid');
      const userRef = db.collection('users').doc(uid);
      const data = {
        dob,
        unitsOfMeasurement: chosenUom,
        // onboarded: true,
        weeklyTargets: {
          currentWeekStartDate: moment().startOf('week').format('YYYY-MM-DD'),
          resistanceWeeklyComplete: 0,
          hiitWeeklyComplete: 0,
          strength:0,
          circuit:0,
          interval:0
        },
   
      };
      await userRef.set(data, { merge: true });
      this.setState({ loading: false });
      this.props.navigation.navigate('Onboarding2', { 
        name,
        specialOffer
      });
         
    } catch (err) {
      console.log(err)
      Alert.alert('Database write error', `${err}`);
      this.setState({ loading: false });
    }
  }
  toggleDobModal = () => {
    this.setState((prevState) => ({ dobModalVisible: !prevState.dobModalVisible }));
  }
  closeDobModal = () => {
    this.setState({ dobModalVisible: false });
  }
  toggleUomModal = () => {
    this.setState((prevState) => ({ uomModalVisible: !prevState.uomModalVisible }));
  }
  closeUomModal = () => {
    this.setState({ uomModalVisible: false });
  }
  render() {
    const {
      loading,
      chosenDate,
      dobModalVisible,
      chosenUom,
      uomModalVisible,
      timezone,
      name,
      specialOffer
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.flexContainer}>
          <ImageBackground
            source ={require('../../../assets/images/OnBoardindImg/izzy1.png')}
            style={{width:width,height:width/2}}
          >
          <View style={[globalStyle.opacityLayer,{alignItems:'flex-start',paddingStart:20,backgroundColor:'none'}]}>
            <Text style={styles.headerText}>
              {/* Welcome{name !== null && `, ${name}`} */}
              Welcome
            </Text>
            <Text style={styles.bodyText}>
              It’s time to start your FitazFK journey! Just a few questions before we can start.
            </Text>
          </View>
          </ImageBackground>
    
          <View style={styles.contentContainer}>
            <View style={styles.inputFieldContainer}>
              {/* <Text style={styles.inputFieldTitle}>
                Date of Birth
              </Text> */}
              
              <TouchableOpacity
                onPress={this.toggleDobModal}
                style={styles.inputButton}
              >
                <Text style={styles.inputSelectionText}>
                  {chosenDate?moment.tz(chosenDate, timezone).format('LL'):'Enter date of birth'}
                </Text>
                <Icon
                  name="chevron-down"
                  size={19}
                  color={colors.charcoal.light}
                  style={{textAlign:'right'}}
                />
              </TouchableOpacity>
              <Modal
                isVisible={dobModalVisible}
                onBackdropPress={this.closeDobModal}
                animationIn="fadeIn"
                animationInTiming={600}
                animationOut="fadeOut"
                animationOutTiming={600}
              >
                <View style={globalStyle.modalContainer}>
                  <DateTimePicker
                    mode="date"
                    value={chosenDate?chosenDate:new Date(1990, 0, 1)}
                    onChange={this.setDate}
                    minimumDate={new Date(1940, 0, 1)}
                    maximumDate={new Date(2008, 0, 1)}
                    itemStyle={{
                      fontFamily: fonts.standard,
                    }}
                  />(
                    { Platform.OS==='ios' &&
                  <TouchableOpacity
                    title="DONE"
                    onPress={this.toggleDobModal}
                    style={globalStyle.modalButton}
                  >
                    <Text style={globalStyle.modalButtonText}>
                      DONE
                    </Text>
                  </TouchableOpacity>
                  })
                </View>
              </Modal>
            </View>
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputFieldTitle}>
                Units of measurement
              </Text>
              <View style={styles.buttonRowContainer}>
                <CustomBtn 
                  Title="Metric"
                  outline={true}
                  customBtnStyle={{
                    borderRadius:50,
                    padding:5,
                    width:'46%',
                    borderColor:chosenUom === 'metric'?colors.themeColor.color:colors.grey.standard
                  }}
                  onPress={() => this.setState({chosenUom:'metric'})}
                  customBtnTitleStyle={{
                    fontSize:15,
                    marginLeft:5,
                    color:chosenUom === 'metric'?colors.themeColor.color:colors.grey.dark
                  }}
                  leftIconColor={colors.themeColor.color}
                  leftIconSize={15}
                  isLeftIcon={chosenUom === 'metric'?true:false}
                  leftIconName="tick"
                />
                <CustomBtn 
                  Title="Imperial"
                  outline={true}
                  customBtnStyle={{
                                    borderRadius:50,
                                    padding:5,
                                    width:'46%',
                                    borderColor:chosenUom === 'imperial'?colors.themeColor.color:colors.grey.standard
                                  }}
                  onPress={() => this.setState({chosenUom:'imperial'})}
                  customBtnTitleStyle={{
                    fontSize:15,
                    marginLeft:5,
                    color:chosenUom === 'imperial'?colors.themeColor.color:colors.grey.dark
                  }}
                  leftIconColor={colors.themeColor.color}
                  leftIconSize={15}
                  isLeftIcon={chosenUom === 'imperial'?true:false}
                  leftIconName="tick"
                />
              </View>
             
             
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <CustomBtn 
              Title="Continue"
              customBtnStyle={{borderRadius:50,padding:15}}
              onPress={() => this.handleSubmit(chosenDate, chosenUom)}
              customBtnTitleStyle={{letterSpacing:fonts.letterSpacing}}
            />
           
          </View>
          <Loader
            loading={loading}
            color={colors.coral.standard}
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.offWhite,
    
  },
  buttonRowContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    width:width-containerPadding*2,
    marginTop:15
  },


  textContainer: {
    flex: 1,
    width,
    padding: 10,
    paddingHorizontal:containerPadding
  },
  headerText: {
    fontFamily: fonts.bold,
    fontSize: 40,
    color: colors.offWhite,
    marginBottom: 7,
    textTransform:'capitalize'
  },
  bodyText: {
    // fontFamily: fonts.boldNarrow,
    fontSize: 13,
    color: '#eaeced',
    width:'65%',
    fontWeight:fonts.fontWeight,
    letterSpacing:fonts.letterSpacing
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  inputFieldContainer: {
    marginBottom: 20,
  },
  inputFieldTitle: {
    marginLeft: 2,
    fontSize: 15,
    color: colors.black,
    marginBottom: 5,
    fontWeight:fonts.fontWeight,
    letterSpacing:fonts.letterSpacing
  },
  inputButton: {
    width: width - containerPadding*2,
    padding: 15,
    paddingBottom: 12,
    backgroundColor: colors.containerBackground,
    borderBottomWidth: 2,
    paddingLeft:0,
    borderColor: colors.themeColor.color,
    borderRadius: 2,
    flexDirection:'row',
    justifyContent:'space-between',
    marginVertical:20
  },
  inputSelectionText: {
    fontWeight:fonts.fontWeight,
    letterSpacing:fonts.letterSpacing,
    fontSize: 15,
    color: colors.grey.dark,
  },
  buttonContainer: {
    flex: 0.5,
    justifyContent: 'flex-start',
    padding: 10,
    width:width - containerPadding*2
  },
});
