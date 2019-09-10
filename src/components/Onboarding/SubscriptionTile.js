import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '../../components/Shared/Icon';
import SavingsBadge from './SavingsBadge';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';

const tileHeaderInfoMap = {
  'com.fitazfk.fitazfkapp.sub.fullaccess.yearly': '- SAVE 40%',
  'com.fitazfk.fitazfkapp.sub.fullaccess.monthly.discount': '- DISCOUNTED',
  'com.fitazfk.fitazfkapp.sub.fullaccess.yearly.discounted': '- DISCOUNTED',
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
      priceNumber,
      onPress,
      primary,
      term,
      identifier,
      comparisonPrice,
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
                {title}<Text style={styles.yearlySubTitle}>{!primary && `${price} / ${term}`}</Text>
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
                {primary ? price : `$${(priceNumber / 12).toFixed(2)}`}{' / month '}
              </Text>
              <Text style={styles.subText}>
                {primary ? 'after 7-day FREE trial' : 'billed annually'}
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
  identifier: PropTypes.string.isRequired,
  comparisonPrice: PropTypes.string,
  priceNumber: PropTypes.number.isRequired,
};

SubscriptionTile.defaultProps = {
  primary: false,
  comparisonPrice: undefined,
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
