import React from 'react';
import {
    View,
    SafeAreaView,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput
     } 
from 'react-native';
import Icon from "../../components/Shared/Icon";
import colors from "../../styles/colors";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import CustomBtn from "../../components/Shared/CustomBtn";

const FindAccountScreen =({navigation}) =>{
    return(
        <SafeAreaView>
          <View style={styles.container}>
             <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                 <Icon
                    name="cross"
                    color={colors.themeColor.color}
                    size={22}
                  />
            </TouchableOpacity>
            <View style={{paddingTop: hp('15%')}}>
                <Text style={styles.Text}>Please enter the email address you used when you purchased your Transform challenge:</Text>
                <View style={{paddingTop: hp("3%")}}>
                    <TextInput
                    style={styles.Input}
                    />
                </View>
            </View>
            <View style={{paddingTop: hp('20%')}}>
                <CustomBtn
                    customBtnStyle={{
                    padding: 12,
                    margin: 5,
                    borderColor: colors.black,
                    backgroundColor: colors.citrus,
                    }}
                    outline={false}
                    Title="FIND MY ACCOUNT"
                    customBtnTitleStyle={{ color: colors.black }}
                
                />
                <View>
                    <Text>Already have an Account? Sign In</Text>
                </View>
            </View>
          </View>
        </SafeAreaView>
        
    )
    
}
const styles = StyleSheet.create({
    container:{
        justifyContent:'center',
        paddingLeft: wp('10%'),
        paddingRight: wp('10%'),
    },
    closeButton:{
        alignSelf: 'flex-end',
    },
    Text:{
        fontSize: hp('3%')
    },
    Input:{
        height: hp("5%"),
        width: wp('70%'),
        margin: 12,
        borderWidth: 1,
        fontSize: hp('2%')
    }
})

export default FindAccountScreen;
