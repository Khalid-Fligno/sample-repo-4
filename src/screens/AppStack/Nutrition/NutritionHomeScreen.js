import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Tile from '../../../components/Shared/Tile';
import colors from '../../../styles/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-navigation';
import globalStyle from '../../../styles/globalStyles';
import BigHeadingWithBackButton from '../../../components/Shared/BigHeadingWithBackButton';

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
        <View style={{width:'100%',marginBottom:30}}>
          <Text style={{color:'gray'}}>Choose your mealtime</Text>
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
            height={200}
          />
          ))
         
        }
        {/* <Tile
          title1="Lunch"
          image={require('../../../../assets/images/nutrition-lunch.jpg')}
          onPress={() => navigation.navigate('RecipeSelection', { meal: 'lunch' })}
          showTitle = {true}
          overlayTitle = {false}
          height={200}
        />
        <Tile
          title1="Dinner"
          image={require('../../../../assets/images/nutrition-dinner.jpg')}
          onPress={() => navigation.navigate('RecipeSelection', { meal: 'dinner' })}
          showTitle = {true}
          overlayTitle = {false}
          height={200}
        />
        <Tile
          title1="Snack"
          image={require('../../../../assets/images/nutrition-snack.jpg')}
          onPress={() => navigation.navigate('RecipeSelection', { meal: 'snack' })}
          showTitle = {true}
          overlayTitle = {false}
          height={200}
        /> */}
       </View>
      </SafeAreaView>
    </ScrollView> 
    
  );
}

