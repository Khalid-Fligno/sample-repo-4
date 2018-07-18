import React from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { FileSystem } from 'expo';
import Carousel from 'react-native-snap-carousel';
import Image from 'react-native-scalable-image';
import Loader from '../../../components/Loader';
import Icon from '../../../components/Icon';
import colors from '../../../styles/colors';

const { width } = Dimensions.get('window');

export default class RecipeStepsScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      steps: [],
      loading: false,
    };
  }
  componentWillMount = async () => {
    const steps = this.props.navigation.getParam('steps', null);
    const recipe = this.props.navigation.getParam('recipe', null);
    await this.fetchImages(recipe, steps);
  }
  fetchImages = async (recipe, steps) => {
    this.setState({ loading: true });
    await Promise.all(recipe.stepsImages.map(async (stepImage, index) => {
      await FileSystem.downloadAsync(
        stepImage,
        `${FileSystem.cacheDirectory}step-${index + 1}.jpg`,
      );
    }));
    this.setState({ loading: false, steps });
  }
  renderItem = ({ item, index }) => {
    const { steps } = this.state;
    return (
      <View style={styles.carouselCard}>
        <View style={styles.carouselHeaderContainer}>
          <View style={styles.carouselHeaderContentContainer}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={styles.carouselHeaderButton}
            >
              <Icon
                name="cross"
                size={16}
                color={colors.violet.standard}
              />
            </TouchableOpacity>
            <Text style={styles.carouselHeaderText}>
              STEP {index + 1} OF {steps.length}
            </Text>
            {
              index + 1 === steps.length ? (
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}
                  style={styles.carouselHeaderButton}
                >
                  <Icon
                    name="tick"
                    size={22}
                    color={colors.violet.standard}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => this.carousel.snapToNext()}
                  style={styles.carouselHeaderButton}
                >
                  <Icon
                    name="arrow-right"
                    size={20}
                    color={colors.violet.standard}
                  />
                </TouchableOpacity>
              )
            }
          </View>
          <Image
            source={{ uri: `${FileSystem.cacheDirectory}step-${index + 1}.jpg` }}
            width={width - 52}
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
    const { loading } = this.state;
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  carouselCard: {
    flex: 1,
    marginTop: 12,
    marginBottom: 12,
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
});
