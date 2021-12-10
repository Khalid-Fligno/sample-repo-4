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

const NutritionList = [
  {
    title:"breakfast",
    imageUrl:require('../../../../assets/images/nutrition-breakfast.jpg'),
  },
  {
    title:"lunch",
    imageUrl:require('../../../../assets/images/nutrition-lunch.jpg'),
  },
  {
    title:"dinner",
    imageUrl:require('../../../../assets/images/nutrition-dinner.jpg'),
  },
  {
    title:"snack",
    imageUrl:require('../../../../assets/images/nutrition-snack.jpg'),
  },
  ,
  {
    title:"post workout",
    imageUrl:require('../../../../assets/images/homeScreenTiles/Post-Workout.jpg'),
  },
  ,
  {
    title:"pre workout",
    imageUrl:require('../../../../assets/images/homeScreenTiles/Pre-Workout.jpg'),
  },
  {
    title:"treats",
    imageUrl:require('../../../../assets/images/homeScreenTiles/Treats.jpg'),
  },
]

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
          NutritionList.map((data,i)=>(
            <Tile
              key={i}
              title1={data.title}
              image={data.imageUrl}
              onPress={() => navigation.navigate('RecipeSelection', { meal: data.title })}
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

