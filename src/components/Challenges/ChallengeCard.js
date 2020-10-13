import React, { Component } from 'react';
import { View, Text, ImageBackground ,TouchableOpacity} from 'react-native';
import globalStyle from '../../styles/globalStyles';
import RoundTick from '../../../assets/icons/RoundTick';

class ChallengeCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
        <ImageBackground
            source ={{uri:'https://firebasestorage.googleapis.com/v0/b/quickstart-1588594831516.appspot.com/o/Photos%2FFL_2.png?alt=media&token=8eb669ad-7e8b-4a41-bc22-2d3cfa3678fc'}}
            style={globalStyle.FT_ImageContainer}
            imageStyle={{ borderRadius: 5}}
        > 
            <TouchableOpacity
                activeOpacity={0.9}
                style={globalStyle.FT_InnerContainer}
                onPress={this.props.onPress}      
            >
                {
                this.props.showTick &&
                    <View style={{marginStart:15}}>
                    <RoundTick/>
                    </View>
                }
                {
                !this.props.showTick &&
                    <View style={{marginStart:15}}>
                    </View>
                }
                
                <Text style={globalStyle.FT_Title}>{this.props.title} </Text>
                
                
            </TouchableOpacity>
        </ImageBackground> 
    );
  }
}

export default ChallengeCard;
