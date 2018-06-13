import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  Button,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Constants } from 'expo';
import * as firebase from 'firebase';
import 'firebase/firestore';
const db = firebase.firestore();
import Carousel from 'react-native-snap-carousel';
import Image from 'react-native-scalable-image';
import CustomButton from '../../../components/CustomButton';
import Icon from '../../../components/Icon';
import colors from '../../../styles/colors';

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
    const { steps } = this.state;
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
              backgroundColor: colors.charcoal.dark,
              borderRadius: 5,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <TouchableOpacity
                onPress={this.toggleRecipeStart}
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Icon
                  name="cross"
                  size={14}
                  color={colors.white}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontFamily: 'GothamBold',
                  fontSize: 16,
                  color: colors.white,
                  marginTop: 3,
                }}
              >
                Step {index + 1} of {steps.length}
              </Text>
              <TouchableOpacity
                onPress={() => this._carousel.snapToNext() }
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Icon
                  name={index + 1 === steps.length ? 'tick' : 'arrow-right'}
                  size={18}
                  color={colors.white}
                />
              </TouchableOpacity>
            </View>
            <Image
              source={require('../../../../assets/images/recipes/baked-eggs-1024x768.png')}
              width={width - 50}
            />
          </View>
          <View
            style={{
              flex: 1,
              padding: 15,
            }}
          >
            <ScrollView>
              <Text
                style={{
                  fontFamily: 'GothamBook',
                  fontSize: 14,
                  color: colors.charcoal.standard,
                  marginBottom: 40,
                }}
              >
                {item}
              </Text>
            </ScrollView>
          </View>
        </View>
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
        itemWidth={width - 50}
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
          <Image
            source={require('../../../../assets/images/recipes/baked-eggs-1024x768.png')}
            width={width}
          />
          <View
            style={{
              padding: 15,
            }}
          >
            <Text
              style={{
                fontFamily: 'GothamBold',
                fontSize: 28,
                color: colors.charcoal.standard,
                marginBottom: 10,
              }}
            >
                {recipe.displayName}
              </Text>
            <Text
              style={{
                fontFamily: 'GothamBook',
                fontSize: 14,
                color: colors.charcoal.standard,
              }}
            >
              {recipe.summary}
            </Text>

            <View
              style={{
                padding: 15,
                borderWidth: 2,
                borderColor: colors.charcoal.standard,
                borderRadius: 10,
                marginTop: 15,
              }}
            >
              <Text
                style={{
                  fontFamily: 'GothamBold',
                  fontSize: 18,
                  color: colors.charcoal.standard,
                  marginBottom: 5,
                }}
              >
                Ingredients
              </Text>
              {
                ingredients.map((ingredient) => {
                  return (
                    <Text
                      key={ingredient}
                      style={{
                        fontFamily: 'GothamBook',
                        fontSize: 14,
                        color: colors.charcoal.standard,
                        marginTop: 3,
                        marginBottom: 3,
                      }}
                    >
                      - {ingredient}
                    </Text>
                  )
                })
              }
            </View>
          </View>

        </ScrollView>
        <View
          style={{
            backgroundColor: colors.offWhite,
            borderTopColor: colors.grey.light,
            borderTopWidth: 1,
            paddingTop: 15,
            paddingBottom: 15,
          }}
        >
          <CustomButton
            green
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
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
  }
});
