import React, { Component } from 'react';
import { View, Text ,ScrollView,FlatList, Alert, Linking} from 'react-native';
import { ListItem, Button,  } from 'react-native-elements'
import colors from '../../styles/colors';
import globalStyle, { containerPadding } from '../../styles/globalStyles';
import { db } from '../../../config/firebase';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import momentTimezone from 'moment-timezone';
import { any } from 'prop-types';
import Loader from '../../components/Shared/Loader';
import ChallengeStyle from './chellengeStyle';
import createUserChallengeData from '../../components/Challenges/UserChallengeData';
import ChallengeCard from '../../components/Challenges/ChallengeCard';
import * as Haptics from 'expo-haptics';


class ChallengeSubscriptionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData:any,
      challengesList:[],
      userChallengesList:[],
      loading:false
    }
  }

  componentDidMount = () => {
    this.fetchProfile();
   
  }
  componentWillUnmount = () => {
    this.unsubscribeUserChallenges();
    this.unsubscribeUserData();
    this.unsubscribeChallenges();
  }
  fetchProfile = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    try{
      this.unsubscribeUserData = db.collection('users').doc(uid)
        .onSnapshot(async (doc) => {
            this.setState({userData:doc.data()})
          })

    this.unsubscribeUserChallenges = db.collection('users').doc(uid).collection('challenges')
      .onSnapshot(async (querySnapshot) => {
        const userChallengesList = [];
        await querySnapshot.forEach(async (doc) => {
          await userChallengesList.push(await doc.data());
        });
        this.setState({ userChallengesList});
        this.fetchChallenges();
      });
    }
    catch(err){
      Alert.alert('Something went wrong')
    }
 
  }

  fetchChallenges = async () => {
    let {userChallengesList} = this.state
    
    this.unsubscribeChallenges = await db.collection('challenges')
      .onSnapshot(async (querySnapshot) => {
        const challengesList = [];
        await querySnapshot.forEach(async (doc) => {
          const check = userChallengesList.findIndex((challenge)=>{
            console.log(doc.id,challenge.id)
            return  doc.id === challenge.id
          })
          console.log(check)
          if(check === -1)
            await challengesList.push(await doc.data());
        });
        this.setState({ challengesList ,loading:false});
      });
   
  }
 
 addChallengeToUser(index){
  let {userData , challengesList} = this.state
    const userRef = db.collection('users').doc(userData.id).collection('challenges');
    const data = createUserChallengeData(challengesList[index])
    console.log( data.id)
    userRef.doc(data.id).set(data).then((res)=>{
      this.props.navigation.navigate('ChallengeOnBoarding1',{
        data:{
          challengeData:data
        }
      })
    }).catch((err)=>{
      console.log(err)
    })
   
 }
 openLink = (url) => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  Linking.openURL(url);
}

  renderItem = ({ item ,index}) => (
    <ChallengeCard 
        outline={false}
        imageUrl={item.imageUrl}
        numberOfDays={item.numberOfDays}
        numberOfWeeks={item.numberOfWeeks}
        title={item.displayName}
        key={index}
        btnTitle = "Buy"
        onPress={()=>this.addChallengeToUser(index)}
        // onPress={() => item.shopifyUrl && this.openLink(item.shopifyUrl)}
        disabled = {false}
    />
      
  )
  renderItem1 = ({item,index}) =>{
      let  btnTitle = ''
      let btnDisabled = false
      const findIndex = this.state.userChallengesList.findIndex((res)=> res.status === 'Active')
      console.log(findIndex)
      if(findIndex === -1 && item.status === 'Completed'){
        btnTitle = 'Restart';
      }
      else if(findIndex !== -1 && item.status === 'Completed'){
        btnTitle = 'Completed';
        btnDisabled = true
      } 
      else if(item.status === 'Active'){
        btnTitle='Active';
        btnDisabled = true
      } 
      else if( findIndex !== -1 &&  item.status === 'InActive'){
        btnTitle='Start';
        btnDisabled = true
      } else if( findIndex === -1 &&  item.status === 'InActive'){
        btnTitle='Start';
        btnDisabled = false
      } 
    
      console.log("item.numberOfDays",item);
        return (
          <ChallengeCard 
              outline={true}
              imageUrl={item.imageUrl}
              numberOfDays={item.numberOfDays}
              numberOfWeeks={item.numberOfWeeks}
              key={index}
              btnTitle = {btnTitle}
              onPress={()=>this.onBoarding(item,btnTitle,btnDisabled)}
              
          />
       
      )
  }

  onBoarding(challengeData,btnTitle,btnDisabled){
    if(btnDisabled){
      if(btnTitle === 'Active')
        this.props.navigation.navigate('Calendar')
      else{
        Alert.alert('Sorry,you cant start new challenge','you have already one active challege')
      }
    }else{
      this.props.navigation.navigate('ChallengeOnBoarding1',{
        data:{
          challengeData
        }
      })
    } 
   
  }

  
  render() {
    const {challengesList,userChallengesList,loading} = this.state
    return (
      <ScrollView style={{flex:1,paddingHorizontal:containerPadding}} bounces={false}>
         
       { 
          !loading &&  
          <View>
            {
               userChallengesList.map((item,index)=>(this.renderItem1({item,index})))
            }
          
            {
              challengesList.length > 0 && <Text style={ChallengeStyle.Title}>Take a new challenge</Text>
            }
            {
              challengesList.map((item,index)=>(this.renderItem({item,index})))
            }
          
          </View>
            
       }  
       {
         
       }
         <Loader
          loading={loading}
          color={colors.themeColor.color}
        />
    </ScrollView>
    );
  }
}

export default ChallengeSubscriptionScreen
