import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '../../components/Shared/Icon';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';

const fullPriceMap = {
  '$15.99': '$19.99',
  '$39.99': '$49.99',
  '$111.99': '$139.99',
};

export default class SubscriptionTile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const {
      title,
      price,
      onPress,
      active,
      foundation,
    } = this.props;
    return (
      <TouchableOpacity
        onPress={onPress}
        style={active ? styles.subscriptionTileActive : styles.subscriptionTileInactive}
      >
        <Text style={active ? styles.subscriptionTileHeaderActive : styles.subscriptionTileHeaderInactive}>
          {title}
        </Text>
        {
          foundation && (
          <Text style={active ? styles.subscriptionPriceTextActiveStrikethrough : styles.subscriptionPriceTextInactiveStrikethrough}>
            {fullPriceMap[price]}
          </Text>
        )
        }
        <Text style={active ? styles.subscriptionPriceTextActive : styles.subscriptionPriceTextInactive}>
          {price}
        </Text>
        <View style={active ? styles.tickCircleActive : styles.tickCircleInactive}>
          {
            active && (
              <Icon
                name="tick-heavy"
                size={25}
                color={active ? colors.charcoal.standard : colors.grey.standard}
              />
            )
          }
        </View>
      </TouchableOpacity>
    );
  }
}

SubscriptionTile.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  foundation: PropTypes.bool,
};

SubscriptionTile.defaultProps = {
  foundation: false,
};

const styles = StyleSheet.create({
  subscriptionTileInactive: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
    marginLeft: 5,
    marginRight: 5,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 2,
    borderColor: colors.grey.light,
    borderRadius: 4,
  },
  subscriptionTileActive: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
    marginLeft: 5,
    marginRight: 5,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 2,
    borderColor: colors.charcoal.standard,
    borderRadius: 4,
    shadowColor: colors.charcoal.standard,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  subscriptionTileHeaderInactive: {
    fontFamily: fonts.bold,
    fontSize: 14,
    textAlign: 'center',
    color: colors.grey.standard,
    marginBottom: 5,
  },
  subscriptionTileHeaderActive: {
    fontFamily: fonts.bold,
    fontSize: 14,
    textAlign: 'center',
    color: colors.charcoal.standard,
    marginBottom: 5,
  },
  subscriptionPriceTextInactiveStrikethrough: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.grey.standard,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  subscriptionPriceTextActiveStrikethrough: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.standard,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  subscriptionPriceTextInactive: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.grey.standard,
    marginBottom: 5,
  },
  subscriptionPriceTextActive: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.charcoal.standard,
    marginBottom: 5,
  },
  tickCircleInactive: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderWidth: 5,
    borderColor: colors.grey.light,
    borderRadius: 25,
  },
  tickCircleActive: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderWidth: 5,
    borderColor: colors.coral.standard,
    borderRadius: 25,
  },
});
