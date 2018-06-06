import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
// import CustomButton from '../../../components/CustomButton';
import colors from '../../../styles/colors';
import firebase from '../../../../config/firebase';

export default class NutritionHomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // recipes: [],
    };
  }
  componentWillMount = async () => {
    // await this.fetchRecipes();
  }
  // fetchRecipes = async () => {
  //   await firebase.database().ref('recipes/').once('value', (snapshot) => {
  //     const recipes = snapshot.val();
  //     this.setState({
  //       recipes,
  //     });
  //   });
  // }
  render() {
    // const recipeList = Object.keys(this.state.recipes).map((recipe) => (
    //   <Text key={recipe}>{recipe}</Text>
    // ));
    // const placeholder = <Text>No recipes</Text>;
    return (
      <View style={styles.container}>
        <Text>
          NutritionHomeScreen
        </Text>
        {/* {
          recipeList || placeholder
        } */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
