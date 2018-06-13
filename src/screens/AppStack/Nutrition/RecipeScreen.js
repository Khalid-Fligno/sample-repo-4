import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import Carousel from 'react-native-snap-carousel';
import Image from 'react-native-scalable-image';
import CustomButton from '../../../components/CustomButton';
import Icon from '../../../components/Icon';
import colors from '../../../styles/colors';

const db = firebase.firestore();
const { width } = Dimensions.get('window');

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
    const recipeName = this.props.navigation.getParam('recipeName', null);
    db.collection('recipes')
      .doc(recipeName)
      .get()
      .then((doc) => {
        this.setState({
          recipe: doc.data(),
          ingredients: doc.data().ingredients,
          steps: doc.data().steps,
        });
      });
  }
  toggleRecipeStart = () => {
    this.setState((prevState) => ({
      started: !prevState.started,
    }));
  }
  renderItem = ({ item, index }) => {
    const { steps } = this.state;
    return (
      <View style={styles.carouselCard}>
        <View style={styles.carouselHeaderContainer}>
          <View style={styles.carouselHeaderContentContainer}>
            <TouchableOpacity
              onPress={this.toggleRecipeStart}
              style={styles.carouselHeaderButton}
            >
              <Icon
                name="cross"
                size={14}
                color={colors.white}
              />
            </TouchableOpacity>
            <Text style={styles.carouselHeaderText}>
              Step {index + 1} of {steps.length}
            </Text>
            {
              index + 1 === steps.length ? (
                <TouchableOpacity
                  onPress={this.toggleRecipeStart}
                  style={styles.carouselHeaderButton}
                >
                  <Icon
                    name="tick"
                    size={18}
                    color={colors.white}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => this.carousel.snapToNext()}
                  style={styles.carouselHeaderButton}
                >
                  <Icon
                    name="arrow-right"
                    size={18}
                    color={colors.white}
                  />
                </TouchableOpacity>
              )
            }
          </View>
          <Image
            source={require('../../../../assets/images/recipes/baked-eggs-1024x768.png')}
            width={width - 50}
          />
        </View>
        <View style={styles.carouselTextContainer}>
          <ScrollView>
            <Text style={styles.carouselText}>
              {item}
            </Text>
          </ScrollView>
        </View>
      </View>
    );
  }
  render() {
    const { recipe, ingredients, started } = this.state;
    if (started) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: colors.white,
          }}
        >
          <Carousel
            ref={(c) => this.carousel = c}
            data={this.state.steps}
            renderItem={this.renderItem}
            sliderWidth={width}
            itemWidth={width - 50}
          />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <ScrollView>
          <Image
            source={require('../../../../assets/images/recipes/baked-eggs-1024x768.png')}
            width={width}
          />
          <View style={styles.recipeInfoContainer}>
            <Text style={styles.recipeHeading}>
              {recipe.displayName}
            </Text>
            <Text style={styles.recipeSummaryText}>
              {recipe.summary}
            </Text>

            <View style={styles.ingredientsContainer}>
              <Text style={styles.ingredientsHeading} >
                Ingredients
              </Text>
              {
                ingredients.map((ingredient) => {
                  return (
                    <Text
                      key={ingredient}
                      style={styles.ingredientsText}
                    >
                      - {ingredient}
                    </Text>
                  );
                })
              }
            </View>
          </View>
        </ScrollView>
        <View
          style={styles.startButtonContainer}
        >
          <CustomButton
            green
            title="Start Cooking"
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
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
  },
  carouselHeaderContainer: {
    backgroundColor: colors.charcoal.dark,
    borderRadius: 5,
  },
  carouselHeaderContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carouselHeaderText: {
    fontFamily: 'GothamBold',
    fontSize: 16,
    color: colors.white,
    marginTop: 3,
  },
  carouselHeaderButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselTextContainer: {
    flex: 1,
    padding: 15,
  },
  carouselText: {
    fontFamily: 'GothamBook',
    fontSize: 14,
    color: colors.charcoal.standard,
    marginBottom: 40,
  },
  recipeHeading: {
    fontFamily: 'GothamBold',
    fontSize: 28,
    color: colors.charcoal.standard,
    marginBottom: 10,
  },
  recipeSummaryText: {
    fontFamily: 'GothamBook',
    fontSize: 14,
    color: colors.charcoal.standard,
  },
  recipeInfoContainer: {
    padding: 15,
  },
  ingredientsContainer: {
    padding: 15,
    borderWidth: 2,
    borderColor: colors.charcoal.standard,
    borderRadius: 10,
    marginTop: 15,
  },
  ingredientsHeading: {
    fontFamily: 'GothamBold',
    fontSize: 18,
    color: colors.charcoal.standard,
    marginBottom: 5,
  },
  ingredientsText: {
    fontFamily: 'GothamBook',
    fontSize: 14,
    color: colors.charcoal.standard,
    marginTop: 3,
    marginBottom: 3,
  },
  startButtonContainer: {
    backgroundColor: colors.offWhite,
    borderTopColor: colors.grey.light,
    borderTopWidth: 1,
    paddingTop: 15,
    paddingBottom: 15,
  },
});
