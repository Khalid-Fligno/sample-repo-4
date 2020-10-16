import React from 'react';
import { View, Text } from 'react-native';
import { Slider} from 'react-native-elements';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';

const SliderComponent = (props) => (
  <View style={{marginTop:10}}>
    <View style={{flexDirection:"row",alignItems:'center'}}>
    <Text style={{
        marginVertical:5,
        fontFamily:fonts.GothamMedium,
        fontSize:12,
        color:colors.grey.dark
        }}>
      {props.title} 
      </Text>
      <Text style={{
        marginVertical:5,
        fontFamily:fonts.GothamMedium,
        fontSize:16,
        color:colors.themeColor.color
        }}> {props.value > 0 ? props.value :""}
      </Text>
      </View>
    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}> 
      <Text style={{fontFamily:fonts.boldNarrow,color:colors.grey.dark}}>0</Text>
        <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center',marginHorizontal:10 }}>
          <Slider
            value={props.value}
            onValueChange={props.onValueChange}
            minimumValue={props.minimumValue}
            maximumValue={props.maximumValue}
            trackStyle={{height:5,borderRadius:5}}
            minimumTrackTintColor={colors.themeColor.color}
            maximumTrackTintColor={colors.grey.medium}
            thumbStyle={{
              height:20, 
              width:20,
              borderRadius:50,
              backgroundColor:colors.themeColor.color,
              borderWidth:3,
              borderColor:colors.themeColor.color
            }}
          />
        </View>
        <Text style={{fontFamily:fonts.boldNarrow,color:colors.grey.dark}}> 10</Text>
    </View>
  </View>
);

export default SliderComponent;
