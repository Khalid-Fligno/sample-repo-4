import React from 'react';
import { Dimensions, TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native';
import { Card } from 'react-native-elements';
import PropTypes from 'prop-types';
import Icon from '../../components/Shared/Icon';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const { width } = Dimensions.get('window');

export default class RecipeTile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(1);
  }
  handlePressIn = () => {
    Animated.spring(this.animatedValue, {
      toValue: 0.92,
    }).start();
  }
  handlePressOut = () => {
    Animated.spring(this.animatedValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
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
    } = this.props;
    const animatedStyle = {
      transform: [{ scale: this.animatedValue }],
    };
    return (
      <TouchableOpacity
        onPress={onPress}
        style={styles.cardContainer}
        delayPressIn={50}
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
            <Text style={styles.title}>
              {title}
            </Text>
            <Text style={styles.subTitle}>
              {subTitle}
            </Text>
            <View
              style={styles.recipeInfoContainer}
            >
              <View style={styles.recipeInfoSection}>
                {
                  tags && tags.map((tag) => (
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
              <View style={styles.recipeInfoSection}>
                {
                  time && (
                    <View style={styles.recipeInfoSection}>
                      <Icon
                        name="timer"
                        size={25}
                        color={colors.violet.standard}
                      />
                      <Text style={styles.timerText}>
                        {time}
                      </Text>
                    </View>
                  )
                }
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
};

RecipeTile.defaultProps = {
  tags: null,
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: 0,
    width,
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
    width: width - 20,
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 0,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 16,
  },
  subTitle: {
    fontFamily: fonts.standardItalic,
    fontSize: 12,
  },
  recipeInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  recipeInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagCircle: {
    height: 28,
    width: 28,
    marginRight: 5,
    borderWidth: 2.5,
    borderColor: colors.violet.standard,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.violet.standard,
    marginTop: 4,
  },
  timerText: {
    fontFamily: fonts.standard,
    fontSize: 12,
    color: colors.violet.standard,
    marginTop: 6,
    marginLeft: 4,
  },
});
