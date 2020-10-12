import React from 'react';
import PropTypes, { any } from 'prop-types';
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
// import fonts from '../../../styles/fonts';
import Tile from '../../../components/Shared/Tile';
const { width } = Dimensions.get('window');
import globalStyle from '../../../styles/globalStyles';
import WorkoutScreenStyle from './WorkoutScreenStyle';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-navigation';
import BigHeadingWithBackButton from '../../../components/Shared/BigHeadingWithBackButton';


let toggleSubtitle = [];
class WorkoutsHomeScreen2 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      helperModalVisible: false,
      resistanceWeeklyTarget: 3,
      hiitWeeklyTarget: 2,
      resistanceWeeklyComplete: undefined,
      hiitWeeklyComplete: undefined,
      toggleList:toggleSubtitle,
      workoutCategories:[]
    };
  }
  componentDidMount = () => {
    this.props.navigation.setParams({ toggleHelperModal: this.showHelperModal });
    this.fetchWeeklyTargetInfo();
    this.showHelperOnFirstOpen();
    this.fetchCategories();
  }

  componentWillUnmount = async () => {
    this.unsubscribeFromTargets();
    this.unsubscribeCategories();
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


// ******************************* new code *************************************
scrollView = any

fetchCategories = async () =>{
  this.setState({ loading: true });
  this.unsubscribeCategories = await db.collection('workoutCategories')
  .orderBy("name", "desc")
  .onSnapshot(async (querySnapshot) => {
    const workoutCategories = [];
    await querySnapshot.forEach(async (doc) => {
      await workoutCategories.push(await doc.data());
      await toggleSubtitle.push(false)
    });
    this.setState({ workoutCategories, loading: false });
  });
}

  toggleSubtitleList(index){
    const list= this.state.toggleList.map((item , i)=>{
      if(index === i){
         return !item
      }
      else{
        return false
      }
    })
    this.state.toggleList = list
    this.forceUpdate();
    // console.log(index)
  }

  handleClick(mainIndex,subIndex){
    Haptics.selectionAsync();
    console.log(this.state.workoutCategories[mainIndex])
    this.props.navigation.navigate('WorkoutsSelection', {
      selectedMainCategory : this.state.workoutCategories[mainIndex],
      selectedSubCategory : this.state.workoutCategories[mainIndex].subCategories[subIndex]
    });
  }


  render() {
    const {
      loading,
      helperModalVisible,
      toggleList,
      workoutCategories
    } = this.state;
    console.log(workoutCategories)
    return (
        <ScrollView 
                showsVerticalScrollIndicator={false} 
                style={globalStyle.container}  
                ref={ref => {this.scrollView = ref}}
                onContentSizeChange={() =>  {
                  if(this.state.toggleList[1] || this.state.toggleList[2] || this.state.toggleList[3])
                      this.scrollView.scrollToEnd({animated: true})
                }}
        >
          {
           !loading && <>
            <SafeAreaView>
              <View>
              <BigHeadingWithBackButton  bigTitleText = "Workouts" isBackButton ={false} isBigTitle = {true} />
              <View style={{width:'100%',marginBottom:30}}>
                <Text style={{color:'gray'}}>Choose your workout</Text>
              </View>
              {
                workoutCategories.map((work,index)=>(
                  <View  key={index}>
                    <Tile
                      title1={work.displayName}
                      image={0}
                      imageUrl={work.imageUrl}
                      onPress={() => this.toggleSubtitleList(index)}
                      showTitle = {false}
                      overlayTitle = {true}
                      overlayTitleStyle ={WorkoutScreenStyle.overlayTitleStyle}
                      customContainerStyle={{height:width/2.5,marginBottom:15}}
                      // customContainerStyle={{height:170,marginBottom:15}}
                    />    
                  { toggleList[index] && <View style={{marginBottom:20,paddingLeft:5}}>
                        {work.subCategories.map((data,i)=>(
                            <TouchableOpacity key={i}
                                onPress={()=>this.handleClick(index,i)}
                            >
                                <Text  style={WorkoutScreenStyle.subTitleText}>{data.displayName}</Text>
                            </TouchableOpacity> 
                        ))
                        } 
                    </View>
                  }   
                  </View>  
                  ))
                
              }
              
              </View>
            </SafeAreaView>
          
          <HelperModal
            helperModalVisible={helperModalVisible}
            hideHelperModal={this.hideHelperModal}
            headingText="Workouts"
            bodyText="What would you like to train today?"
            bodyText2="Select your workout type, followed by the location that you would like to train at.  Finally, select what you would like to focus on today."
            bodyText3="Once you are happy with your selections, press the ‘Show workouts’ button to continue."
            color="coral"
          />
          </>
          }
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
