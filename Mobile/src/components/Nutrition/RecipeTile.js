import React from 'react';
import {
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Animated,
  Image,
} from 'react-native';
import { Card } from 'react-native-elements';
import PropTypes from 'prop-types';
import NewRecipeBadge from './NewRecipeBadge';
import Icon from '../../components/Shared/Icon';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import Tag from './Tag';
import TimeSvg from '../../../assets/icons/time';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { sortBy } from 'lodash';

const { width } = Dimensions.get('window');

export default class RecipeTile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(1);
  }
  handlePressIn = () => {
    Animated.spring(this.animatedValue, {
      toValue: 0.92,
      useNativeDriver: true
    }).start();
  }
  handlePressOut = () => {
    Animated.spring(this.animatedValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true
    }).start();
  }
  render() {
    const {
      onPress,
      title,
      subTitle,
      image,
      tags,
      time,
      newBadge,
    } = this.props;
    const animatedStyle = {
      transform: [{ scale: this.animatedValue }],
    };
    // console.log("qwertyuio", tags)

    const tagsV = sortBy(tags).filter((tag) => {
      if (tag === 'V') {
        return tag
      } else if (tag === 'V+') {
        return tag
      }
      if (tag === 'GF') {
        return tag
      }
    })

    const tagsP = sortBy(tags).filter((tag) => {
      if (tag === 'L1') {
        return tag
      } else if (tag === 'L2') {
        return tag
      }
      if (tag === 'P1') {
        return tag
      } else if (tag === 'P2') {
        return tag
      } else if (tag === 'P3') {
        return tag
      }
    })

    return (
      <TouchableOpacity
        onPress={onPress}
        style={styles.cardContainer}
        delayPressIn={60}
        onPressIn={this.handlePressIn}
        onPressOut={this.handlePressOut}
      >
        <Animated.View
          style={[styles.flexContainer, animatedStyle]}
        >
          <Card
            image={{ uri: image }}
            containerStyle={styles.card}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: -10 }}>
              <View style={{ flexDirection: 'column' }}>
                <View
                  style={styles.recipeInfoContainer}
                >
                  <View style={styles.recipeInfoSection}>
                    {
                      tagsV && tagsV.map((tagV, index) => (
                        <Tag tag={tagV} key={index} />
                      ))
                    }
                  </View>
                  <View style={styles.recipeInfoSection}>
                    {
                      time !== '' && (

                        <View style={styles.timerContainer}>
                          <Text style={styles.timerText}>
                            {time}
                          </Text>
                          <TimeSvg width="22" height="22" />
                        </View>
                      )
                    }
                  </View>
                </View>
                <View style={[styles.titleRow]}>
                  <Text style={styles.title}>
                    {title} {newBadge && <NewRecipeBadge />}
                  </Text>
                </View>
              </View>
              <View
                style={{ flexDirection: 'row', bottom: 12 }}
              >
                <View style={styles.recipeInfoSection}>
                  {
                    tagsP && tagsP.map((tagP, index) => (
                      <Tag tag={tagP} key={index} />
                    ))
                  }
                </View>
              </View>
            </View>
          </Card>
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

RecipeTile.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  // subTitle: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  time: PropTypes.string.isRequired,
  newBadge: PropTypes.bool,
};

RecipeTile.defaultProps = {
  tags: null,
  newBadge: false,
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
    // shadowColor: colors.charcoal.standard,
    // shadowOpacity: 0.5,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 4,
  },
  flexContainer: {
    flex: 1,
  },
  card: {
    width: width - 50,
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 0,
    elevation: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '200%'
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: hp('1.6%'),
    lineHeight: 18
  },
  subTitle: {
    fontFamily: fonts.standardItalic,
    fontSize: 12,
  },
  recipeInfoContainer: {
    flexDirection: 'row',
    marginBottom: 5,
    // justifyContent: 'space-between',
  },
  recipeInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },


  timerText: {
    fontFamily: fonts.standard,
    fontSize: 12,
    color: colors.grey.dark,
    marginLeft: 4,
    alignSelf: 'center',
    marginRight: 5

  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});
