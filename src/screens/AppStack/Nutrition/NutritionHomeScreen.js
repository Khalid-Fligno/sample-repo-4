import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Tile from '../../../components/Shared/Tile';
import colors from '../../../styles/colors';
import { ScrollView } from 'react-native-gesture-handler';

export default function NutritionHomeScreen({ navigation }) {
  return (
    <ScrollView>
    <View style={styles.container}>
      <View style={{height:70,width:'100%',marginBottom:10}}>
        <Text style={{fontSize:35,fontWeight:'bold'}}>
            Nutrition
        </Text>
      </View>
      <View style={{width:'100%',marginBottom:30}}>
        <Text style={{color:'gray'}}>Choose your mealtime</Text>
      </View>
      <Tile
        title1="Breakfast"
        image={require('../../../../assets/images/nutrition-breakfast.jpg')}
        onPress={() => navigation.navigate('RecipeSelection', { meal: 'breakfast' })}
      />
      <Tile
        title1="Lunch"
        image={require('../../../../assets/images/nutrition-lunch.jpg')}
        onPress={() => navigation.navigate('RecipeSelection', { meal: 'lunch' })}
      />
      <Tile
        title1="Dinner"
        image={require('../../../../assets/images/nutrition-dinner.jpg')}
        onPress={() => navigation.navigate('RecipeSelection', { meal: 'dinner' })}
      />
      <Tile
        title1="Snack"
        image={require('../../../../assets/images/nutrition-snack.jpg')}
        onPress={() => navigation.navigate('RecipeSelection', { meal: 'snack' })}
      />
    </View>
    </ScrollView> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
    // paddingTop: 5,
    // paddingBottom: 5,
    padding:20
  },
});
