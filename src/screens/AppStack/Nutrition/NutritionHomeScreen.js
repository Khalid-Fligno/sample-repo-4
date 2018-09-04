import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Dimensions } from 'react-native';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

export default class NutritionHomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('RecipeSelection', { meal: 'breakfast' })}
          style={styles.mealButton}
        >
          <Text style={styles.mealButtonText}>
            Breakfast
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('RecipeSelection', { meal: 'lunch' })}
          style={styles.mealButton}
        >
          <Text style={styles.mealButtonText}>
            Lunch
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('RecipeSelection', { meal: 'dinner' })}
          style={styles.mealButton}
        >
          <Text style={styles.mealButtonText}>
            Dinner
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('RecipeSelection', { meal: 'snack' })}
          style={styles.mealButton}
        >
          <Text style={styles.mealButtonText}>
            Snack
          </Text>
        </TouchableOpacity>
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
  mealButton: {
    opacity: 0.9,
    flex: 1,
    justifyContent: 'flex-end',
    width: width - 20,
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 20,
    paddingBottom: 5,
    borderRadius: 1,
    backgroundColor: colors.violet.standard,
  },
  mealButtonText: {
    fontFamily: fonts.boldItalic,
    fontSize: 34,
    color: colors.white,
  },
});
