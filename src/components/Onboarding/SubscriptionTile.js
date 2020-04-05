import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '../../components/Shared/Icon';
import SavingsBadge from './SavingsBadge';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';

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
      priceNumber,
      onPress,
      primary,
      term,
      comparisonPrice,
      isDiscounted,
    } = this.props;
    return (
      <TouchableOpacity
        onPress={onPress}
        style={primary ? styles.subscriptionTilePrimary : styles.subscriptionTile}
      >
        <View style={styles.subscriptionTileContainer}>
          <View style={styles.textContainer}>
            <View style={styles.subscriptionTitleRow}>
              <Text style={styles.subscriptionTitleText}>
                {title}{price}<Text style={styles.yearlySubTitle}>{` / ${term}` }</Text>
              </Text>
              {!primary && <SavingsBadge text="SAVE 40%" />}
            </View>
            {
              comparisonPrice && (
                <Text style={styles.comparisonPrice}>{comparisonPrice}</Text>
              )
            }
            <Text>
              <Text style={styles.subscriptionPriceText}>
                {!primary && `$${(priceNumber / 12).toFixed(2)}`}{!primary && ' / month '}
              </Text>
              <Text style={styles.subText}>
                {primary ? `AFTER ${isDiscounted ? '1 MONTH' : '7 DAY'} FREE TRIAL` : 'billed annually'}
              </Text>
            </Text>
          </View>
          <View style={styles.iconSubscriptionTileColumn}>
            {
              primary && (
                <Icon
                  name="chevron-right"
                  size={12}
                  color={colors.white}
                />
              )
            }
            {
              !primary && (
                <Icon
                  name="chevron-right"
                  size={12}
                  color={colors.white}
                />
              )
            }
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

SubscriptionTile.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  term: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  primary: PropTypes.bool,
  comparisonPrice: PropTypes.string,
  priceNumber: PropTypes.number.isRequired,
  isDiscounted: PropTypes.bool,
};

SubscriptionTile.defaultProps = {
  primary: false,
  comparisonPrice: undefined,
  isDiscounted: false,
};

const styles = StyleSheet.create({
  subscriptionTile: {
    justifyContent: 'space-between',
    backgroundColor: colors.transparentBlackLighter,
    margin: 10,
    padding: 15,
    paddingTop: 25,
    paddingBottom: 25,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  subscriptionTilePrimary: {
    justifyContent: 'space-between',
    backgroundColor: colors.coral.standard,
    margin: 10,
    padding: 15,
    paddingTop: 25,
    paddingBottom: 25,
    borderColor: colors.coral.standard,
    borderRadius: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  subscriptionTileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconSubscriptionTileColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  subscriptionTitleRow: {
    flexDirection: 'row',
  },
  subscriptionTitleText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    marginBottom: 2,
  },
  yearlySubTitle: {
    fontFamily: fonts.standard,
  },
  comparisonPrice: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    fontFamily: fonts.standard,
    fontSize: 12,
    color: colors.grey.light,
  },
  subscriptionPriceText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.white,
  },
  subText: {
    fontFamily: fonts.standard,
    fontSize: 12,
    color: colors.white,
  },
});
