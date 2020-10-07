import React, { Component } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Dimensions } from 'react-native';
import { number } from 'prop-types';
import ChallengeStyle from '../chellengeStyle';
import globalStyle, { containerPadding } from '../../../styles/globalStyles';
import CustomBtn from '../../../components/Shared/CustomBtn';
import fonts from '../../../styles/fonts';
import colors from '../../../styles/colors';
const { width } = Dimensions.get('window');

const actionSheetOptions = ['Cancel', 'Take photo', 'Upload from Camera Roll'];
export default class OnBoarding4 extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  
  onFocusFunction = () => {
    const data = this.props.navigation.getParam('data', {});
    console.log(data)
    this.setState({challengeData:data['challengeData']})
  }
  
  // add a focus listener onDidMount
  async componentDidMount () {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction()
    })
  }
  
  // and don't forget to remove the listener
  componentWillUnmount () {
    this.focusListener.remove()
  }

  goToScreen(type){
    
    if(type === 'next'){
      this.props.navigation.navigate('ChallengeOnBoarding5',{
        data:{
               challengeData:this.state.challengeData
             }
      })
    }else{
      this.props.navigation.navigate('ChallengeOnBoarding3',{
        data:{
               challengeData:this.state.challengeData
             }
      })
    }
     
  }
  render() {
    return (
      <SafeAreaView style={ChallengeStyle.container}>
          <View style={[globalStyle.container,{paddingVertical:15}]}>
            <View>
              <Text style={[ChallengeStyle.onBoardingTitle,{textAlign:'center'}]}>Capture Yourself</Text>
            </View>
          
          

            <View style={ChallengeStyle.btnContainer}>
                  <CustomBtn 
                      Title="Previous"
                      outline={true}
                      customBtnStyle={{borderRadius:50,padding:15,width:"49%"}}
                      onPress={()=>this.goToScreen('previous')}
                  />    
                  <CustomBtn 
                    Title="Next"
                    outline={true}
                    customBtnStyle={{borderRadius:50,padding:15,width:"49%"}}
                    onPress={()=>this.goToScreen('next')}
                  />
                </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.offWhite,
  },
  textContainer: {
    flex: 1,
    width,
    padding: 10,
    paddingHorizontal:containerPadding
  },
  headerText: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.charcoal.light,
    marginBottom: 5,
  },
  bodyText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.light,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    shadowColor: colors.grey.standard,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  image: {
    height: 240,
    width: 180,
    backgroundColor: colors.grey.standard,
    borderRadius: 4,
    shadowColor: colors.grey.standard,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 240,
    width: 180,
    backgroundColor: colors.grey.standard,
    borderRadius: 4,
    shadowColor: colors.grey.standard,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  imagePlaceholderText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.charcoal.light,
    margin: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10,
    paddingHorizontal:containerPadding,
    width:'100%'
  },
  errorText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.coral.standard,
    textAlign: 'center',
    margin: 10,
  },
});
