import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as Haptics from 'expo-haptics';
import Carousel from 'react-native-snap-carousel';
import FadeInView from 'react-native-fade-in-view';
import moment from 'moment';
import ReactTimeout from 'react-timeout';
import Icon from '../../../components/Shared/Icon';
import CustomButton from '../../../components/Shared/CustomButton';
import Loader from '../../../components/Shared/Loader';
import HelperModal from '../../../components/Shared/HelperModal';
import { db } from '../../../../config/firebase';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';
import Tile from '../../../components/Shared/Tile';
const { width } = Dimensions.get('window');
import globalStyle from '../../../styles/globalStyles';
import WorkoutScreenStyle from './WorkoutScreenStyle';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-navigation';
import BigHeadingWithBackButton from '../../../components/Shared/BigHeadingWithBackButton';


const workouts=[
  {displayName:'Workout Focus',subTitles:false ,image: require('../../../../assets/images/workouts-resistance.jpg')},
  {displayName:'Equipment',subTitles:false,image: require('../../../../assets/images/workouts-resistance.jpg')},
  {displayName:'Mascle Group',subTitles:false,image: require('../../../../assets/images/workouts-resistance.jpg')}
]

const workoutTypeMap = [
  'Strength',
  'Circuit',
  'Interval',
];

const equipmentMap = [
   'Full EquipmentMap',
   'Fitazfk EquipmentMap',
   'Minimum EquipmentMap',
   'No EquipmentMap'
];

const muscleGroupMap = [
  'Full Body',
  'Upper Body',
  'Lower Body',
  'Core' 
];

class WorkoutsHomeScreen2 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      selectedWorkoutTypeIndex: 0,
      selectedWorkoutLocationIndex: 0,
      selectedResistanceFocusIndex: 0,
      selectedHiitStyleIndex: 0,
      helperModalVisible: false,
      resistanceWeeklyTarget: 3,
      hiitWeeklyTarget: 2,
      resistanceWeeklyComplete: undefined,
      hiitWeeklyComplete: undefined,
    };
  }
  componentDidMount = () => {
    this.props.navigation.setParams({ toggleHelperModal: this.showHelperModal });
    this.fetchWeeklyTargetInfo();
    this.showHelperOnFirstOpen();
  }
  componentWillUnmount = () => {
    this.unsubscribeFromTargets();
  }
  onSnapToItemTopCarousel = (field, slideIndex) => {
    Haptics.selectionAsync();
    this.setState({
      selectedWorkoutTypeIndex: slideIndex,
      selectedHiitStyleIndex: 0,
      selectedResistanceFocusIndex: 0,
    });
  }
  onSnapToItem = (field, slideIndex) => {
    Haptics.selectionAsync();
    this.setState({ [field]: slideIndex });
  }
  showHelperOnFirstOpen = async () => {
    const helperShownOnFirstOpen = await AsyncStorage.getItem('workoutHelperShownOnFirstOpen');
    if (helperShownOnFirstOpen === null) {
      this.props.setTimeout(() => this.setState({ helperModalVisible: true }), 500);
      AsyncStorage.setItem('workoutHelperShownOnFirstOpen', 'true');
    }
  }
  fetchWeeklyTargetInfo = async () => {
    const uid = await AsyncStorage.getItem('uid', null);
    const userRef = db.collection('users').doc(uid);
    this.unsubscribeFromTargets = userRef.onSnapshot(async (doc) => {
      this.setState({
        resistanceWeeklyComplete: await doc.data().weeklyTargets.resistanceWeeklyComplete,
        hiitWeeklyComplete: await doc.data().weeklyTargets.hiitWeeklyComplete,
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
  showHelperModal = () => {
    this.setState({ helperModalVisible: true });
  }
  hideHelperModal = () => {
    this.setState({ helperModalVisible: false });
  }
  handleWorkoutSelected = (selectedWorkoutLocationIndex, selectedResistanceFocusIndex) => {
    const workoutLocation = workoutLocationMap[selectedWorkoutLocationIndex];
    const workoutFocus = workoutFocusMap[selectedResistanceFocusIndex];
    this.props.navigation.navigate('WorkoutsSelection', {
      workoutFocus,
      workoutLocation,
    });
  }
  handleHiitWorkoutSelected = (selectedWorkoutLocationIndex, selectedHiitStyleIndex) => {
    const workoutLocation = workoutLocationMap[selectedWorkoutLocationIndex];
    const hiitWorkoutStyle = hiitWorkoutStyleMap[selectedHiitStyleIndex];
    this.props.navigation.navigate('HiitWorkoutsSelection', {
      hiitWorkoutStyle,
      workoutLocation,
    });
  }
  goToWorkouts = (selectedWorkoutTypeIndex) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { selectedWorkoutLocationIndex, selectedResistanceFocusIndex, selectedHiitStyleIndex } = this.state;
    if (selectedWorkoutTypeIndex === 0) {
      this.handleWorkoutSelected(selectedWorkoutLocationIndex, selectedResistanceFocusIndex);
    } else {
      this.handleHiitWorkoutSelected(selectedWorkoutLocationIndex, selectedHiitStyleIndex);
    }
  }

  // renderItem = (subItems ) => {
  //   const {
  //     resistanceWeeklyTarget,
  //     hiitWeeklyTarget,
  //     resistanceWeeklyComplete,
  //     hiitWeeklyComplete,
  //   } = this.state;
  //   return (
  //     <View style={WorkoutScreenStyle.slide}>
  //         <View style={globalStyle.opacityLayer}>
  //         for (let i = 0; i < subItems.length; i++) {
  //                    <Text>
  //                       {{subItems[i]}}
  //                     </Text>
  //                   }   
  //         </View>
  //     </View>
  //   );
  // }
  render() {
    const {
      loading,
      selectedWorkoutTypeIndex,
      helperModalVisible,
    } = this.state;
    return (
        <ScrollView showsVerticalScrollIndicator={false} style={globalStyle.container}>
          <SafeAreaView>
            <View>
            <BigHeadingWithBackButton  bigTitleText = "Workouts" isBackButton ={false} isBigTitle = {true} />
            <View style={{width:'100%',marginBottom:30}}>
              <Text style={{color:'gray'}}>Choose your workout</Text>
            </View>
            {
              workouts.map(work=>{ 
              return <Tile
                title1={work.displayName}
                image={work.image}
                onPress={() => console.log("hi")}
                showTitle = {false}
                overlayTitle = {true}
                height={150}
                key={work}
              />           
              })
              
            }
            
            </View>
          </SafeAreaView>
        
        <View style={globalStyle.buttonContainer}>
          <CustomButton
            title="SHOW WORKOUTS"
            onPress={() => this.goToWorkouts(selectedWorkoutTypeIndex)}
            primary
          />
        </View>
        <HelperModal
          helperModalVisible={helperModalVisible}
          hideHelperModal={this.hideHelperModal}
          headingText="Workouts"
          bodyText="What would you like to train today?"
          bodyText2="Select your workout type, followed by the location that you would like to train at.  Finally, select what you would like to focus on today."
          bodyText3="Once you are happy with your selections, press the ‘Show workouts’ button to continue."
          color="coral"
        />
        <Loader
          color={colors.coral.standard}
          loading={loading}
        />
        </ScrollView>
      );
  }
}

WorkoutsHomeScreen2.propTypes = {
  setTimeout: PropTypes.func.isRequired,
};


export default ReactTimeout(WorkoutsHomeScreen2);
