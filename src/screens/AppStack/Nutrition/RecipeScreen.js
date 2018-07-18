import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';
import { FileSystem } from 'expo';
import { Divider } from 'react-native-elements';
import Image from 'react-native-scalable-image';
import Loader from '../../../components/Loader';
import Icon from '../../../components/Icon';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

export default class RecipeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      recipe: {},
      ingredients: [],
      utensils: [],
      loading: false,
    };
  }
  componentWillMount = async () => {
    const recipe = this.props.navigation.getParam('recipe', null);
    this.setState({
      recipe,
      ingredients: recipe.ingredients,
      utensils: recipe.utensils,
      loading: false,
    });
    this.props.navigation.setParams({
      handleStart: () => this.props.navigation.navigate('RecipeSteps', {
        steps: recipe.steps,
        recipe,
      }),
    });
  }
  render() {
    const {
      recipe,
      ingredients,
      loading,
      utensils,
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
            source={{ uri: `${FileSystem.cacheDirectory}recipe-${recipe.id}.jpg` }}
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
            <View style={styles.infoBar}>
              <Icon
                name="timer"
                size={22}
                color={colors.violet.standard}
              />
              <Text style={styles.timeText}>
                {recipe.time}
              </Text>
              {
                recipe.tags && recipe.tags.map((tag) => (
                  <View
                    style={styles.tagCircle}
                    key={tag}
                  >
                    <Text style={styles.tagText}>
                      {tag}
                    </Text>
                  </View>
                ))
              }
            </View>
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
            <View style={styles.ingredientsContainer}>
              <Text style={styles.ingredientsHeading} >
                Utensils
              </Text>
              {
                utensils.map((utensil) => {
                  return (
                    <Text
                      key={utensil}
                      style={styles.ingredientsText}
                    >
                      - {utensil}
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
  infoBar: {
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontFamily: fonts.standard,
    color: colors.violet.standard,
    marginTop: 3,
    marginLeft: 5,
    marginRight: 5,
  },
  tagCircle: {
    height: 24,
    width: 24,
    marginLeft: 10,
    borderWidth: 2.5,
    borderColor: colors.violet.standard,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.violet.standard,
    marginTop: 4,
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
