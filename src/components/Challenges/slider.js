import React from 'react';
import { View, Text } from 'react-native';
import { Slider} from 'react-native-elements';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';

const SliderComponent = (props) => (
  <View style={{marginTop:10}}>
    <Text style={{marginVertical:10,fontFamily:fonts.standard,fontSize:15}}>{props.title}</Text>
    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}> 
      <Text style={{fontFamily:fonts.boldNarrow,color:colors.transparentBlackDark}}>1</Text>
        <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center',marginHorizontal:10 }}>
          <Slider
            value={props.value}
            onValueChange={props.onValueChange}
            minimumValue={props.minimumValue}
            maximumValue={props.maximumValue}
            trackStyle={{height:7,borderRadius:5}}
          />
        </View>
        <Text style={{fontFamily:fonts.boldNarrow,color:colors.transparentBlackDark}}> 10</Text>
    </View>
  </View>
);

export default SliderComponent;
