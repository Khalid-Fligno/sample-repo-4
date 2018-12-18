import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Segment } from 'expo';
import Tile from '../../../components/Shared/Tile';
import colors from '../../../styles/colors';

export default class NutritionHomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
    Segment.screen('Nutrition Home Screen');
  }
  render() {
    return (
      <View style={styles.container}>
        <Tile
          title1="BREAKFAST"
          image={require('../../../../assets/images/nutrition-breakfast.jpg')}
          onPress={() => this.props.navigation.navigate('RecipeSelection', { meal: 'breakfast' })}
        />
        <Tile
          title1="LUNCH"
          image={require('../../../../assets/images/nutrition-lunch.jpg')}
          onPress={() => this.props.navigation.navigate('RecipeSelection', { meal: 'lunch' })}
        />
        <Tile
          title1="DINNER"
          image={require('../../../../assets/images/nutrition-dinner.jpg')}
          onPress={() => this.props.navigation.navigate('RecipeSelection', { meal: 'dinner' })}
        />
        <Tile
          title1="SNACK"
          image={require('../../../../assets/images/nutrition-snack.jpg')}
          onPress={() => this.props.navigation.navigate('RecipeSelection', { meal: 'snack' })}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
  },
});
