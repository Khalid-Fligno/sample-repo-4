import React from 'react';
import {
        Image,
        View,
        Text,
        ScrollView,
        FlatList,
        TouchableOpacity,
        Linking,
        } from'react-native';
 import {
         widthPercentageToDP as wp,
         heightPercentageToDP as hp,
        } from "react-native-responsive-screen";

import fonts from "../../../../styles/fonts";
import * as Haptics from "expo-haptics";


export default class AllBlogs extends React.PureComponent {
    constructor(props){
        super(props);
        this.state={
            blogs: []
        }
    }

    onFocusFunction(){
        this.setState({
            blogs : this.props.navigation.getParam("data",null)
        })
    }

    componentDidMount(){
        this.onFocusFunction();
    }

    openLink = (url) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Linking.openURL(url);
      };
    

render(){
    const {blogs} = this.state;
    console.log(blogs);

return(
    <ScrollView style={{}}>
        <View style={{ marginBottom: wp("10%"), flex: 1,alignItems:'center' }}>
            <View style={{alignContent:'center',flex: 1}}>
                

            </View>
        </View>


    </ScrollView>

)







}



}