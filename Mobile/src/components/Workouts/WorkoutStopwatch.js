import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import CustomBtn from '../Shared/CustomBtn';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import { containerPadding } from '../../styles/globalStyles';
const { width, height } = Dimensions.get('window');
export default class StopWatch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRunning: false,
            mm: 0,
            ss: 0,
            ms: 0
        };
        timerID = 0;
      }
static getDerivedStateFromProps(props, state) {
    if (props.isRunning !== state.isRunning) {
        return { isRunning: props.isRunning };
    }
    return null;
    }
    componentDidMount = async () => {
        this.setState({ isRunning: this.props.isRunning });
      }
      componentDidUpdate(props, prevState) {
        if (prevState.isRunning !== this.state.isRunning) {
          this.onPropsChange();
        }
      }
      componentWillUnmount() {
        clearInterval(this.timerID);
      }
      onPropsChange = () => {
        if (this.state.isRunning) {
          this.start();
        } else {
            console.log("stop")
          this.stop();
        }
      }

  stop = () =>{
    clearInterval(this.timerID);
  }
  start = () => {
    let {isRunning} = this.state;
      // Stop => Running
      let {mm, ss, ms} = this.state;

      this.timerID = setInterval(() => {
        ms++;
        if (ms >= 100) {
          ss++;
          ms = 0;
        }
        if (ss >= 60) {
          mm++;
          ss = 0;
        }
        this.setState({ mm, ss, ms });
      }, 10);
    this.setState({ isRunning: !isRunning });
  }

  // 1 => 01
  format(num) {
    return (num + '').length === 1 ? '0' + num : num + '';
  }

  render() {
    return (
      <View style={styles.container} >
        <View style={{flexDirection:'row'}}>        
          <Text style={styles.text}>{this.format(this.state.mm)}</Text>
          <Text style={styles.text1}>:</Text>
          <Text style={styles.text}>{this.format(this.state.ss)}</Text>
          <Text style={styles.text1}>:</Text>
          <Text style={styles.text}>{this.format(this.state.ms)}</Text>
        </View>
     
        {/* <CustomBtn
            Title={this.state.isRunning ? 'Stop' : 'Start'}
            customBtnStyle={{borderRadius:7,padding:15,width:"49%",backgroundColor:colors.charcoal.dark}}
            onPress={()=>this.onPropsChange()}
            // disabled={counterButtonDisable}
        /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        width,
        backgroundColor: colors.black,
        paddingVertical: height > 800 ? 25 : 15,
        alignItems: 'center',
        justifyContent: 'center',

      },
      text: {
        fontFamily: fonts.bold,
        fontSize: height > 800 ? 50 : 60,
        color: colors.white,
        width:width/5
      },
      text1: {
        fontFamily: fonts.bold,
        fontSize: height > 800 ? 50 : 60,
        color: colors.white,
      },
});
