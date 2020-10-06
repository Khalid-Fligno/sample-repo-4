import React, { Component } from 'react';
import { View, 
        Text, 
        SafeAreaView,
        TouchableOpacity,
        Picker
      } from 'react-native';
import { number } from 'prop-types';
import ChallengeStyle from '../chellengeStyle';
import globalStyle from '../../../styles/globalStyles';
import CustomBtn from '../../../components/Shared/CustomBtn';
import { CheckBox } from 'react-native-elements';
import authScreenStyle from '../../AuthStack/authScreenStyle';
import Modal from 'react-native-modal';
import {
  weightOptionsMetric,
  waistOptionsMetric,
  hipOptionsMetric,
  weightOptionsImperial,
  waistOptionsImperial,
  hipOptionsImperial,
} from '../../../utils/index';
export default class OnBoarding3 extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      challengeData:{},
      height:number,
      weight:number,
      goalWeight:number,
      girth:{
          waist:number,
          hip:number
      },
      btnDisabled:true,
      CM_KG:true,
      FT_LB:false,
      weightModalVisible: false,
    };
  }
  onFocusFunction = () => {
    const data = this.props.navigation.getParam('data', {});
    this.setState({
      challengeData:data['challengeData'],
      btnDisabled:false
    })
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
    
    if(type === 'next'){
      this.props.navigation.navigate('ChallengeOnBoarding4',{
        data:{
               challengeData:this.state.challengeData
             }
      })
    }else{
      this.props.navigation.navigate('ChallengeOnBoarding2',{
        data:{
               challengeData:this.state.challengeData
             }
      })
    }
     
  }
  showModal = (modalNameVisible) => {
    this.setState({ [modalNameVisible]: true });
  }
  hideModal = (modalNameVisible) => {
    this.setState({ [modalNameVisible]: false });
  }

  render() {
    let {
          challengeData,
          btnDisabled,
          CM_KG,
          FT_LB,
          weight,
          weightModalVisible
        } = this.state;
    
    return (
      <SafeAreaView style={ChallengeStyle.container}>
      <View style={[globalStyle.container,{paddingVertical:15}]}>
        <View>
          <Text style={[ChallengeStyle.onBoardingTitle,{textAlign:'center'}]}>Measurments</Text>
        </View>
       <View style={ChallengeStyle.checkBox}>
          <CheckBox
            center
            title='CM-KG'
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            checked={CM_KG}
            onPress={() =>
              {this.setState({FT_LB: !FT_LB,CM_KG:!CM_KG})} 
            }
            containerStyle={ChallengeStyle.checkBoxConteiner}
          />
          <View style={authScreenStyle.dividerOverlay} >
              <Text style={authScreenStyle.dividerOverlayText}>
                OR
              </Text>
          </View>
          <CheckBox
            center
            title='FT-LB'
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            checked={FT_LB}
            onPress={() =>
              {this.setState({FT_LB: !FT_LB,CM_KG:!CM_KG})} 
            }
            containerStyle={ChallengeStyle.checkBoxConteiner}
          />
       </View>
       <View >
                <Text >
                  Weight
                </Text>
                <TouchableOpacity
                  onPress={() => this.showModal('weightModalVisible')}
                >
                  <Text >
                    {weight} {CM_KG === true && 'kg'}{FT_LB === true && 'lbs'}
                  </Text>
                </TouchableOpacity>
                <Modal
                  isVisible={weightModalVisible}
                  onBackdropPress={() => this.hideModal('weightModalVisible')}
                  animationIn="fadeIn"
                  animationInTiming={600}
                  animationOut="fadeOut"
                  animationOutTiming={600}
                >
                  <View >
                    <Picker
                      selectedValue={weight}
                      onValueChange={(value) => this.setState({ weight: value })}
                    >
                      {
                        CM_KG
                        ?
                          weightOptionsMetric.map((i) => (
                            <Picker.Item
                              key={i.value}
                              label={`${i.label} kg`}
                              value={i.value}
                            />
                          ))
                        :
                          weightOptionsImperial.map((i) => (
                            <Picker.Item
                              key={i.value}
                              label={`${i.label} lbs`}
                              value={i.value}
                            />
                          ))
                      }
                    </Picker>
                    <TouchableOpacity
                      title="DONE"
                      onPress={() => this.hideModal('weightModalVisible')}
                    >
                      <Text >
                        DONE
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Modal>
              </View>
      

        <View style={ChallengeStyle.btnContainer}>
              <CustomBtn 
                  Title="Previous"
                  outline={true}
                  customBtnStyle={{borderRadius:50,padding:15,width:"49%"}}
                  onPress={()=>this.goToScreen('previous')}
                  // disabled={btnDisabled}
              />    
              <CustomBtn 
                Title="Next"
                outline={true}
                customBtnStyle={{borderRadius:50,padding:15,width:"49%"}}
                onPress={()=>this.goToScreen('next')}
                // disabled={btnDisabled}
              />
            </View>
      </View>
  </SafeAreaView> 
    );
  }
}
