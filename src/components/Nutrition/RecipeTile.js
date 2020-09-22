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

const { width } = Dimensions.get('window');

export default class RecipeTile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(1);
  }
  handlePressIn = () => {
    Animated.spring(this.animatedValue, {
      toValue: 0.92,
      useNativeDriver:true
    }).start();
  }
  handlePressOut = () => {
    Animated.spring(this.animatedValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver:true
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
            <View style={{flexDirection:'row' ,justifyContent:'space-between'}}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>
                  {title} { newBadge && <NewRecipeBadge />}
                </Text>
                
              </View>
              {/* <Text style={styles.subTitle}>
                {subTitle}
              </Text> */}
              <View
                style={styles.recipeInfoContainer}
              >
                <View style={styles.recipeInfoSection}>
                  {
                    tags && tags.map((tag,index) => (
                     <Tag tag = {tag} key={index}/>
                    ))
                  }
                </View>
                <View style={styles.recipeInfoSection}>
                  {
                    time && (
                      <View style={styles.timerContainer}>
                         <Text style={styles.timerText}>
                          {time}
                        </Text>
                        <Image
                        source={require('../../../assets/icons/time.png')}
                        fadeDuration={0}
                        style={{width:32, height: 32}}
                        />
                       
                      </View>
                    )
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
  subTitle: PropTypes.string.isRequired,
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
    shadowColor: colors.charcoal.standard,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  flexContainer: {
    flex: 1,
  },
  card: {
    width: width - 40,
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth:'60%'
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight:18
  },
  subTitle: {
    fontFamily: fonts.standardItalic,
    fontSize: 12,
  },
  recipeInfoContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  recipeInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagCircle: {
    height: 22,
    width: 22,
    marginRight: 5,
    borderWidth: 0,
    // borderColor: colors.violet.standard,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:colors.themeColor.color,
    alignSelf:'baseline'
  },
  tagText: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: colors.white,
    // marginTop: 4,
  },
  timerText: {
    fontFamily: fonts.standard,
    fontSize: 12,
    color: colors.grey.dark,
    marginLeft: 4,
    alignSelf:'center',
    marginRight:5

  },
  timerContainer : {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf:'baseline',
  }
});
