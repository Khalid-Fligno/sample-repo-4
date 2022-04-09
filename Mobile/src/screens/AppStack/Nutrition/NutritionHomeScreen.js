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
import { OTHERSIMG } from '../../../library/images/others/others';

const NutritionList = [
  {
    title:"breakfast",
    //imageUrl:require('../../../../assets/images/nutrition-breakfast.jpg'),
    imageUrl: OTHERSIMG.NUTRITIONBREAKFAST,
    meal: 'breakfast'
  },
  {
    title:"lunch",
    //imageUrl:require('../../../../assets/images/nutrition-lunch.jpg'),
    imageUrl: OTHERSIMG.NUTRITIONLUNCH,
    meal: 'lunch'
  },
  {
    title:"dinner",
    //imageUrl:require('../../../../assets/images/nutrition-dinner.jpg'),
    imageUrl: OTHERSIMG.NUTRITIONDINNER,
    meal: 'dinner'
  },
  {
    title:"snack",
    //imageUrl:require('../../../../assets/images/nutrition-snack.jpg'),
    imageUrl: OTHERSIMG.NUTRITIONSNACK,
    meal: 'snack'
  },
  ,
  {
    title:"Post Workout",
    //imageUrl:require('../../../../assets/images/homeScreenTiles/Post-Workout.jpg'),
    imageUrl: OTHERSIMG.NUTRITIONPOSTWORKOUT,
    meal: 'drink'
  },
  ,
  {
    title:"Pre Workout",
    //imageUrl:require('../../../../assets/images/homeScreenTiles/new_pre_workout.jpg'),
    imageUrl: OTHERSIMG.NUTRITIONPREWORKOUT,
    meal: 'preworkout'
  },
  {
    title:"treats",
    //imageUrl:require('../../../../assets/images/homeScreenTiles/Treats.jpg'),
    imageUrl: OTHERSIMG.NUTRITIONTREATS,
    meal: 'treats'
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
              onPress={() => navigation.navigate('RecipeSelection', { meal: data.meal, title:data.title })}
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

