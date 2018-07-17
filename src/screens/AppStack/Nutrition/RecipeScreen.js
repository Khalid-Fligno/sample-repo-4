import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Divider } from 'react-native-elements';
import Image from 'react-native-scalable-image';
import { db } from '../../../../config/firebase';
import Loader from '../../../components/Loader';
import colors from '../../../styles/colors';

const { width } = Dimensions.get('window');

export default class RecipeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      recipe: {},
      ingredients: [],
      steps: [],
      loading: false,
    };
  }
  componentWillMount = async () => {
    this.props.navigation.setParams({
      handleStart: () => this.props.navigation.navigate('RecipeSteps', {
        recipe: this.state.recipe,
        steps: this.state.steps,
      }),
    });
    await this.fetchRecipe();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchRecipe = () => {
    this.setState({ loading: true });
    const recipeId = this.props.navigation.getParam('recipeId', null);
    this.unsubscribe = db.collection('recipes')
      .doc(recipeId)
      .onSnapshot((doc) => {
        this.setState({
          recipe: doc.data(),
          ingredients: doc.data().ingredients,
          steps: doc.data().steps,
          loading: false,
        });
      });
  }
  render() {
    const {
      recipe,
      ingredients,
      loading,
    } = this.state;
    if (loading) {
      return (
        <Loader
          loading={loading}
          color={colors.violet.dark}
        />
      );
    }
    return (
      <View style={styles.container}>
        <ScrollView>
          <Image
            source={{ uri: recipe.coverImage }}
            width={width}
          />
          <View style={styles.recipeInfoContainer}>
            <Text style={styles.recipeTitle}>
              {recipe.title}
            </Text>
            <Text style={styles.recipeSubTitle}>
              {recipe.subtitle}
            </Text>
            <Divider style={styles.divider} />
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
    shadowColor: colors.violet.dark,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: colors.violet.dark,
  },
  carouselHeaderContainer: {
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  carouselHeaderContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.violet.dark,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  carouselHeaderText: {
    fontFamily: 'GothamBold',
    fontSize: 16,
    color: colors.violet.standard,
    marginTop: 3,
  },
  carouselHeaderButton: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.violet.dark,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
  },
  carouselTextContainer: {
    flex: 1,
    paddingTop: 15,
    paddingRight: 10,
    paddingBottom: 15,
    paddingLeft: 15,
  },
  carouselText: {
    fontFamily: 'GothamBook',
    fontSize: 14,
    color: colors.charcoal.standard,
  },
  recipeTitle: {
    fontFamily: 'GothamBold',
    fontSize: 28,
    color: colors.charcoal.standard,
  },
  recipeSubTitle: {
    fontFamily: 'GothamBook',
    fontSize: 16,
    color: colors.charcoal.standard,
    marginBottom: 15,
  },
  divider: {
    backgroundColor: colors.grey.light,
  },
  recipeSummaryText: {
    fontFamily: 'GothamBook',
    fontSize: 14,
    color: colors.charcoal.standard,
    marginTop: 15,
  },
  recipeInfoContainer: {
    padding: 15,
  },
  ingredientsContainer: {
    padding: 15,
    borderWidth: 1,
    borderColor: colors.grey.light,
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
});
