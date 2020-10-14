import React, { Component } from 'react';
import { View, 
        Text, 
        SafeAreaView,
        TouchableOpacity,
        Picker,
      } from 'react-native';
import { number, any } from 'prop-types';
import ChallengeStyle from '../chellengeStyle';
import globalStyle from '../../../styles/globalStyles';
import CustomBtn from '../../../components/Shared/CustomBtn';
import { CheckBox } from 'react-native-elements';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';
import authScreenStyle from '../../AuthStack/authScreenStyle';
import Modal from 'react-native-modal';
import {
  weightOptionsMetric,
  waistOptionsMetric,
  hipOptionsMetric,
  weightOptionsImperial,
  waistOptionsImperial,
  hipOptionsImperial,
  hipOptionsFt,
} from '../../../utils/index';
import PickerModal from '../../../components/Challenges/PickerModal';
import InputBox2 from '../../../components/Challenges/InputBox2';
import { ScrollView } from 'react-native-gesture-handler';
export default class OnBoarding3 extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      challengeData:{},
      height:150,
      weight:60,
      goalWeight:60,
      waist:60,
      hip:60,
      btnDisabled:true,
      CM_KG:true,
      FT_LB:false,
      ModalVisible: false,
      pickerDataList:[],
      inputType:any,
      chosenUom: 'metric'
    };
  }
  onFocusFunction = () => {
    const data = this.props.navigation.getParam('data', {});
    const measurments = data['challengeData']['onBoardingInfo']['measurements']
    console.log(measurments)
    if(measurments){
      this.setState({
        challengeData:data['challengeData'],
        btnDisabled:false,
        height:measurments.height,
        weight:measurments.weight,
        goalWeight:measurments.goalWeight,
        waist:measurments.waist,
        hip:measurments.hip,
        CM_KG:measurments.unit === 'CM-KG' ?true:false,
        FT_LB:measurments.unit === 'FT-LB' ?true:false
      })
    }else{
      this.setState({
        challengeData:data['challengeData'],
        btnDisabled:false,
      })
    }
  
    console.log(data['challengeData'],"<><><<")
  }
  
  // add a focus listener onDidMount
  async componentDidMount () {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction()
    })
  }
  
  // and don't forget to remove the listener
  componentWillUnmount () {
    console.log("unmount")
    this.focusListener.remove()
  }

  goToScreen(type){
    let {
      challengeData,
    } = this.state


    const onBoardingInfo = Object.assign({},challengeData.onBoardingInfo,{
      measurements:{
        height:this.state.height,
        weight:this.state.weight,
        goalWeight:this.state.goalWeight,
        waist:this.state.waist,
        hip:this.state.hip,
        unit:this.state.CM_KG?'CM-KG':'FT-LB'
      }
    })
    console.log(challengeData)
    let updatedChallengedata = Object.assign({},challengeData,{onBoardingInfo})
    console.log(updatedChallengedata)
    if(type === 'next'){
      this.props.navigation.navigate('ChallengeOnBoarding4',{
        data:{
               challengeData:updatedChallengedata
             }

      })
    }else{
      this.props.navigation.navigate('ChallengeOnBoarding2',{
        data:{
               challengeData:updatedChallengedata
             }
      })
    }
     
  }
  showModal = (inputType) => {
    console.log(inputType)
    let {CM_KG , FT_LB,modalVisible} = this.state
    let dataList = []
    if(inputType === 'weight' || inputType === "goalWeight")
      dataList = CM_KG?weightOptionsMetric:weightOptionsImperial;
    
    if(inputType === 'waist' || inputType === "hip" || inputType === "height" )
      dataList = CM_KG?waistOptionsMetric:hipOptionsFt;

    this.setState({ 
                    modalVisible: true ,
                    inputType:inputType,
                    pickerDataList:dataList
                  });
   
  }
  hideModal = () => {
    this.setState({ 
      modalVisible: false ,
      inputType:'',
      pickerDataList:[],
    });
  }

  render() {
    let {
          challengeData,
          btnDisabled,
          CM_KG,
          FT_LB,
          weight,
          modalVisible,
          pickerDataList,
          inputType,
          goalWeight,
          hip,
          height,
          waist,
          chosenUom,
        } = this.state;
    return (
     
          <SafeAreaView style={ChallengeStyle.container}>
            <View style={[globalStyle.container,{paddingVertical:15}]}>
            <ScrollView>
              <View>
                <Text style={[ChallengeStyle.onBoardingTitle,{textAlign:'center'}]}>Measurments</Text>
              </View>
               <View style={ChallengeStyle.checkBox}>
              
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
              <InputBox2 
                  onPress={() => this.showModal('height')}
                  title="Height"
                  extension={CM_KG?'cm': 'ft'}
                  value={height}

              />
             
              <InputBox2 
                  onPress={() => this.showModal('weight')}
                  title="Weight"
                  extension={CM_KG?'kg': 'lbs'}
                  value={weight}

              />
               <InputBox2 
                  onPress={() => this.showModal('goalWeight')}
                  title="Goal weight"
                  extension={CM_KG?'kg': 'lbs'}
                  value={goalWeight}

              />

              <View>
                <Text style={[ChallengeStyle.onBoardingTitle,{marginBottom:20,marginTop:30}]}>Girth Measurments</Text>
              </View>

               <InputBox2 
                  onPress={() => this.showModal('waist')}
                  title="Waist"
                  extension={CM_KG?'cm': 'ft'}
                  value={waist}

              />
               <InputBox2 
                  onPress={() => this.showModal('hip')}
                  title="Hip"
                  extension={CM_KG?'cm': 'ft'}
                  value={hip}

              />
              </ScrollView>  
              <PickerModal 
                metric = {CM_KG}
                imerial = {FT_LB}
                dataMapList = {pickerDataList}
                onValueChange = {(value) => this.setState({ [inputType]: value })}
                isVisible = {modalVisible}
                onBackdropPress = {() => this.hideModal()}
                selectedValue = {this.state[inputType]}
                onPress = {() => this.hideModal()}
                inputType = {inputType}
              />
            
              <View style={ChallengeStyle.btnContainer}>
                    <CustomBtn 
                        Title="Previous"
                        outline={true}
                        customBtnStyle={{borderRadius:50,padding:15,width:"49%"}}
                        onPress={()=>this.goToScreen('previous')}
                        disabled={btnDisabled}
                    />    
                    <CustomBtn 
                      Title="Next"
                      outline={true}
                      customBtnStyle={{borderRadius:50,padding:15,width:"49%"}}
                      onPress={()=>this.goToScreen('next')}
                      disabled={btnDisabled}
                    />
                  </View>
            </View>
          </SafeAreaView> 
     
    );
  }
}
