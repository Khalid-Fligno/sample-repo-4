import React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, Button } from 'react-native';
import colors from '../../../styles/colors';
import * as firebase from 'firebase';
import 'firebase/firestore';
const db = firebase.firestore();
import Carousel from 'react-native-snap-carousel';
import Image from 'react-native-scalable-image';
import CustomButton from '../../../components/CustomButton';

const { width } = Dimensions.get('window');
var storage = firebase.storage();
var pathReference = storage.ref('recipes/baked-eggs.jpg');

export default class RecipeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      recipe: {},
      ingredients: [],
      steps: [],
      started: false,
    };
  }
  componentWillMount = async () => {
    await this.fetchRecipe();
  }
  fetchRecipe = () => {
    const recipeName = this.props.navigation.getParam('recipeName', null)
    db.collection('recipes')
      .doc(recipeName)
      .get()
      .then((doc) => {
        this.setState({
          recipe: doc.data(),
          ingredients: doc.data().ingredients,
          steps: doc.data().steps,
        })
      });
  }
  toggleRecipeStart = () => {
    this.setState(prevState => ({
      started: !prevState.started,
    }))
  }
  renderItem = ({ item, index }) => {
    return (
      <View
        style={styles.carouselCard}
      >
        <View
          style={{
            flex: 1,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 20,
              width: 20,
              margin: 10,
            }}
          >
            <Text
              style={{
                fontFamily: 'GothamBold',
                fontSize: 24,
                color: colors.charcoal.light,
              }}
            >
              {index + 1}
            </Text> 
          </View>
          <Image
            source={require('../../../../assets/images/recipes/baked-eggs-1024x768.png')}
            width={width - 60}
          />
          <View
            style={{
              padding: 10,
            }}
          >
            <Text
              style={{
                fontFamily: 'GothamBook',
                fontSize: 18,
                color: colors.charcoal.standard,
              }}
            >
              {item}
            </Text>
          </View>
        </View>
        <Button
          primary
          title="Back"
          onPress={this.toggleRecipeStart}
        />
      </View>
    )
  }
  render() {
    const { recipe, ingredients, steps, started } = this.state;
    if (started) {
      return (
        <Carousel
        ref={(c) => { this._carousel = c; }}
        data={this.state.steps}
        renderItem={this.renderItem}
        sliderWidth={width}
        itemWidth={width - 60}
      />
      )
    }
    return (
      <View style={styles.container}>
        <ScrollView
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              margin: 10,
              height: 30,
            }}
          >
            <Text
              style={{
                fontFamily: 'GothamBold',
                fontSize: 28,
                color: colors.charcoal.standard,
              }}
            >
              {recipe.displayName}
            </Text>
          </View>
          <Image
            source={require('../../../../assets/images/recipes/baked-eggs-1024x768.png')}
            width={width}
          />
          <Text>{recipe.overview}</Text>
          {
            ingredients.map((ingredient) => {
              return <Text key={ingredient}>{ingredient}</Text>
            })
          }

        </ScrollView>
        <View
          style={{
            borderTopColor: colors.grey.light,
            borderTopWidth: 1,
            paddingTop: 15,
            paddingBottom: 15,
          }}
        >
          <CustomButton
            primary
            title="Start"
            onPress={this.toggleRecipeStart}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselCard: {
    flex: 1,
    marginTop: 30,
    marginBottom: 30,
    borderRadius: 5,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
  }
});
