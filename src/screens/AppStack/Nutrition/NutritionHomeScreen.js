import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo';
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
        {/* <TouchableOpacity
          onPress={() => this.props.navigation.navigate('RecipeSelection', { meal: 'breakfast' })}
          style={{
            flex: 1,
            width: width - 30,
            marginTop: 7.5,
            marginBottom: 7.5,
            borderRadius: 4,
            shadowColor: colors.black,
            shadowOpacity: 0.8,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 5,
          }}
        >
          <ImageBackground
            source={require('../../../../assets/images/recipes/baked-eggs.png')}
            style={{
              height: null,
              width: null,
              flexGrow: 1,
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.8)', 'transparent']}
              start={[0.4, 1]}
              end={[1, 0]}
              style={{
                flex: 1,
                justifyContent: 'flex-end',
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.boldItalic,
                  fontSize: 34,
                  color: colors.white,
                  marginLeft: 12,
                }}
              >
                Breakfast
              </Text>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity> */}
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
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingTop: 7.5,
    paddingBottom: 7.5,
  },
  mealButton: {
    opacity: 0.9,
    flex: 1,
    justifyContent: 'flex-end',
    width: width - 30,
    marginTop: 7.5,
    marginBottom: 7.5,
    paddingLeft: 20,
    paddingBottom: 5,
    borderRadius: 4,
    backgroundColor: colors.violet.standard,
    shadowColor: colors.black,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  mealButtonText: {
    fontFamily: fonts.boldItalic,
    fontSize: 34,
    color: colors.white,
  },
});
