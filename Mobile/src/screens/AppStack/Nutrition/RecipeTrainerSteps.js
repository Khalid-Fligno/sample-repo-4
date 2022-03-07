import React from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import{ createImageProgress } from 'react-native-image-progress';
import { DotIndicator } from 'react-native-indicators';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
// import Icon from '../../../components/Shared/Icon';
import colors from '../../../styles/colors';
// import fonts from '../../../styles/fonts';
import globalStyle from '../../../styles/globalStyles';
import NutritionStyles from './NutritionStyles';
import Loader from '../../../components/Shared/Loader';
const { width } = Dimensions.get('window');
import FastImage from 'react-native-fast-image';
import HtmlText from 'react-native-html-to-text';
 
const Image = createImageProgress(FastImage);

export default class RecipeTrainerSteps extends React.PureComponent {
  constructor(props) {
    super(props);
    const data = this.props.navigation.getParam('recipe', null);
    const stepsImages = this.props.navigation.getParam('recipe', null).stepsImages
    const steps = data && data.newRecipe?data.steps:data.steps.map((res,i)=>{return{image:stepsImages[i],description:res}} )
    this.state = {
      loading: true ,
      steps:steps,
      stepsImages:stepsImages,
    };
  }
  componentDidMount = () => {
    setTimeout(() => {
      this.setState({ loading: false });
    }, 500);
    activateKeepAwake();
  }
  componentWillUnmount = () => {
    deactivateKeepAwake();
  }
  // showPrevious = () => {
  //   this.carousel.snapToPrev();
  // }
  // showNext = (index) => {
  //   this.carousel.snapToItem(index + 1);
  // }
  renderItem = ({ item, index }) => {
    const { steps } = this.state;
    return (
      <View style={NutritionStyles.carouselCard}>
        <View style={NutritionStyles.carouselHeaderContainer}>
          <View style={NutritionStyles.carouselHeaderContentContainer}>
            <View style={NutritionStyles.carouselHeaderButton} />
            {/* {
              index === 0 ? (
                <View
                  onPress={() => this.props.navigation.goBack()}
                  style={styles.carouselHeaderButton}
                >
                  <Icon
                    name="cross"
                    size={16}
                    color={colors.violet.standard}
                  />
                </View>
              ) : (
                <View
                  onPress={this.showPrevious}
                  style={styles.carouselHeaderButton}
                >
                  <Icon
                    name="arrow-left"
                    size={20}
                    color={colors.violet.standard}
                  />
                </View>
              )
            } */}
            <Text style={NutritionStyles.carouselHeaderText}>
              STEP {index + 1} OF {steps.length}
            </Text>
            <View style={NutritionStyles.carouselHeaderButton} />
            {/* {
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
                  // onPress={() => this.showNext(index)}
                  style={styles.carouselHeaderButton}
                >
                  <Icon
                    name="arrow-right"
                    size={20}
                    color={colors.violet.standard}
                  />
                </TouchableOpacity>
              )
            } */}
          </View>
        </View>
        <View style={NutritionStyles.carouselContentContainer}>
          <ScrollView>
            <Image
              // source={{ uri: this.state.stepsImages[index] }}
              source={{ uri: item.image}}
              indicator={DotIndicator}
              indicatorProps={{
                color: colors.themeColor.color,
                count: 3,
                size: 8,
              }}
              style={{
                width: width - 52,
                height: width - 52,
              }}
              resizeMode='cover'
            />
            <View style={NutritionStyles.carouselBottomContainer}>
              <View style={NutritionStyles.carouselTextContainer}>
                {/* <Text style={NutritionStyles.carouselText}>
                  {item.description}
                </Text> */}
                <HtmlText html={`${item.description}`}></HtmlText>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
  render() {
    const { steps ,loading} = this.state;
    if(loading)
      return(
                <Loader
                  loading={loading}
                  color={colors.red.standard}
                />
      )
    return (
      <View style={[globalStyle.container,{paddingHorizontal:0,alignItems: 'center'}]}>
        <Carousel
          ref={(c) => this.carousel = c}
          data={steps}
          renderItem={this.renderItem}
          sliderWidth={width}
          itemWidth={width - 50}
        />
      </View>
    );
  }
}

