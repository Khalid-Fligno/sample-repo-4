import React from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { Segment } from 'expo';
import Carousel from 'react-native-snap-carousel';
import Image from 'react-native-image-progress';
import { DotIndicator } from 'react-native-indicators';
import Icon from '../../../components/Shared/Icon';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

export default class RecipeStepsScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      steps: this.props.navigation.getParam('recipe', null).steps,
      stepsImages: this.props.navigation.getParam('recipe', null).stepsImages,
    };
  }
  componentDidMount() {
    Segment.screen('Recipe Steps Screen');
  }
  renderItem = ({ item, index }) => {
    const { steps } = this.state;
    return (
      <View style={styles.carouselCard}>
        <View style={styles.carouselHeaderContainer}>
          <View style={styles.carouselHeaderContentContainer}>
            {
              index === 0 ? (
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
              ) : (
                <TouchableOpacity
                  onPress={() => this.carousel.snapToPrev()}
                  style={styles.carouselHeaderButton}
                >
                  <Icon
                    name="arrow-left"
                    size={20}
                    color={colors.violet.standard}
                  />
                </TouchableOpacity>
              )
            }
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
        </View>
        <View style={styles.carouselContentContainer}>
          <ScrollView>
            <Image
              source={{ uri: this.state.stepsImages[index] }}
              indicator={DotIndicator}
              indicatorProps={{
                color: colors.violet.standard,
                count: 3,
                size: 8,
              }}
              style={{
                width: width - 52,
                height: width - 52,
              }}
            />
            <View style={styles.carouselBottomContainer}>
              <View style={styles.carouselTextContainer}>
                <Text style={styles.carouselText}>
                  {item}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
  render() {
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
    backgroundColor: colors.offWhite,
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
    fontFamily: fonts.bold,
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
  carouselContentContainer: {
    flex: 1,
    backgroundColor: colors.offWhite,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  carouselBottomContainer: {
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
  },
  carouselTextContainer: {
    backgroundColor: colors.violet.standard,
    borderRadius: 20,
    borderBottomRightRadius: 4,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 12,
  },
  carouselText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
  },
});
