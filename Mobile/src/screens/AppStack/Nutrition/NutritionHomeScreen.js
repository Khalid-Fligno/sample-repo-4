import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Tile from '../../../components/Shared/Tile';
import colors from '../../../styles/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-navigation';
import globalStyle from '../../../styles/globalStyles';
import BigHeadingWithBackButton from '../../../components/Shared/BigHeadingWithBackButton';
import fonts from '../../../styles/fonts';
import { heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import NutritionGroup from './NutritionGroup.js'

export default function NutritionHomeScreen({ navigation }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={globalStyle.container}>
      <SafeAreaView >
       <View>
        {/* <View style={globalStyle.bigHeadingTitleContainer}>
          <Text style={globalStyle.bigHeadingTitleText}>
              Nutrition
          </Text>
        </View> */}
        <BigHeadingWithBackButton 
           bigTitleText = "Nutrition"
           isBackButton ={false}
           isBigTitle = {true}
           />
        <View style={{width:'100%',marginBottom:hp('2.5%'),marginTop:hp('0.5%')}}>
          <Text style={{color:'gray',fontFamily:fonts.standard,fontSize:wp('3%')}}>Choose your mealtime</Text>
        </View>

        {
          NutritionGroup.all.map((data,i)=>(
            <Tile
              key={i}
              title1={data.title}
              image={data.imageUrl}
              onPress={() => navigation.navigate('RecipeSelection', { meal: data.filteredMealType, title: data.title })}
              showTitle = {true}
              overlayTitle = {false}
              customContainerStyle={{height:170}}
              showTitleStyle={{marginTop:15}}
          />
          ))
        }
       
       </View>
      </SafeAreaView>
    </ScrollView> 
    
  );
}

