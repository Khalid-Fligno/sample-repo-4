import React, { Component } from 'react';
import { View, Text ,ScrollView,FlatList, Alert} from 'react-native';
import { ListItem, Button,  } from 'react-native-elements'
import colors from '../../styles/colors';
import globalStyle from '../../styles/globalStyles';
import { db } from '../../../config/firebase';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import momentTimezone from 'moment-timezone';
import { any } from 'prop-types';
import Loader from '../../components/Shared/Loader';
import ChallengeStyle from './chellengeStyle';
import createUserChallengeData from '../../components/Challenges/UserChallengeData';
const mylist = [
  {
    name: '28 Days Challenge',
    subtitle: 'Vice President',
    status:true
  },
  {
    name: 'Lose a KG',
    subtitle: 'Vice Chairman',
    status:false
  },
]
const newlist = [
  {
    name: 'New Year Challenge',
  },
  {
    name: 'Beach Body',
  },
  {
    name: 'New Year Challenge',
  },
  {
    name: 'Beach Body',
  },

]



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
    userRef.add(data).then((res)=>{
      this.props.navigation.navigate('ChallengeOnBoarding1',{
        data:{
          challengeData:data
        }
      })
    }).catch((err)=>{
      console.log(err)
    })
    console.log( data)
 }


  renderItem = ({ item ,index}) => (
        <ListItem
            key={index}
            title={item.name}
            bottomDivider
            rightElement={
                <Button
                    title="Buy"
                    type="solid"
                    // onPress={()=>console.log('hello')}
                    buttonStyle={{width:150,}}
                    titleStyle={{fontSize:15}}
                    onPress={()=>this.addChallengeToUser(index)}
                    />
             }
        />
  )
  renderItem1 = ({item,index}) =>{
      let  btnTitle = ''
      let btnDisabled = false
      const findIndex = this.state.userChallengesList.findIndex((res)=> res.status === 'Active')
      
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
      else if(item.status === 'InActive'){
        btnTitle='Start';
        btnDisabled = false
      } 
    
        return (
        <ListItem
                  key={index}
                  title={item.name}
                  bottomDivider
                  rightElement={
                    <Button
                        title={btnTitle}
                        type="solid"
                        onPress={()=>this.onBoarding(item)}
                        // loading={true}
                        buttonStyle={{width:150,}}
                        titleStyle={{fontSize:15}}
                        disabled={(btnDisabled)?true:false}
                        // disabledStyle={{backgroundColor:colors.green.dark}}
                        // disabledTitleStyle={{color:colors.white}}
                        />
                  }
                />
      )
  }

  onBoarding(challengeData){
    this.props.navigation.navigate('ChallengeOnBoarding1',{
      data:{
        challengeData
      }
    })
  }

  
  render() {
    const {challengesList,userChallengesList,loading} = this.state
    return (
      <ScrollView style={{flex:1}}>
       { 
          !loading &&  
          <View>
            {
               userChallengesList.map((item,index)=>(this.renderItem1({item,index})))
            }
              
              {/* <FlatList
                keyExtractor={(item,index)=>index.toString()}
                data={userChallengesList}
                renderItem={this.renderItem1}
              /> */}
              {challengesList.length > 0 && <Text style={ChallengeStyle.Title}>Take a new challenge</Text>}
              {
                challengesList.map((item,index)=>(this.renderItem({item,index})))
              }
              {/* <FlatList
                keyExtractor={(item,index)=>index.toString()}
                data={challengesList}
                renderItem={this.renderItem}
              /> */}
          
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
