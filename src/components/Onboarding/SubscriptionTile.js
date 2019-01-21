import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '../../components/Shared/Icon';
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
      onPress,
      primary,
      term,
    } = this.props;
    return (
      <TouchableOpacity
        onPress={onPress}
        style={primary ? styles.subscriptionTilePrimary : styles.subscriptionTile}
      >
        <View style={primary ? styles.tileHeaderBarPrimary : styles.tileHeaderBar}>
          <Text style={primary ? styles.subscriptionTileHeaderPrimary : styles.subscriptionTileHeader}>
            {title}
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={primary ? styles.subscriptionPriceTextPrimary : styles.subscriptionPriceText}>
            {price}
          </Text>
          <Text style={primary ? styles.subscriptionTermTextPrimary : styles.subscriptionTermText}>
            {term}
          </Text>
          <Text style={primary ? styles.subscriptionPriceSubtextPrimary : styles.subscriptionPriceSubtext}>
            after 7 day FREE TRIAL
          </Text>
        </View>
        <View style={styles.bottomContainer}>
          {
            primary && (
              <Icon
                name="chevron-down"
                size={22}
                color={colors.coral.standard}
                style={styles.icon}
              />
            )
          }
          {
            primary ? (
              <View style={styles.savingsContainer}>
                <Text style={styles.savingsText}>
                  Save 41%
                </Text>
              </View>
            ) : (
              <View style={styles.blankSavingsContainer} />
            )
          }
          {
            !primary && (
              <Icon
                name="chevron-down"
                size={22}
                color={colors.charcoal.darkest}
                style={styles.icon}
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
  term: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  primary: PropTypes.bool,
};

SubscriptionTile.defaultProps = {
  primary: false,
};

const styles = StyleSheet.create({
  subscriptionTile: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    marginLeft: 5,
    marginRight: 5,
    paddingTop: 0,
    borderWidth: 3,
    borderColor: colors.charcoal.standard,
    borderRadius: 4,
    shadowColor: colors.charcoal.standard,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  subscriptionTilePrimary: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    marginLeft: 5,
    marginRight: 5,
    paddingTop: 0,
    borderWidth: 3,
    borderColor: colors.coral.dark,
    borderRadius: 4,
    shadowColor: colors.charcoal.standard,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  tileHeaderBar: {
    backgroundColor: colors.charcoal.darkest,
    width: '100%',
    alignItems: 'center',
  },
  tileHeaderBarPrimary: {
    backgroundColor: colors.coral.dark,
    width: '100%',
    alignItems: 'center',
  },
  subscriptionTileHeader: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    marginTop: 5,
    marginBottom: 3,
  },
  subscriptionTileHeaderPrimary: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    marginTop: 5,
    marginBottom: 3,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  subscriptionPriceText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.charcoal.darkest,
    marginBottom: 3,
  },
  subscriptionPriceTextPrimary: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.coral.dark,
    marginBottom: 3,
  },
  subscriptionTermText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.charcoal.darkest,
    marginBottom: 5,
  },
  subscriptionTermTextPrimary: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.coral.dark,
    marginBottom: 5,
  },
  subscriptionPriceSubtext: {
    fontFamily: fonts.standard,
    fontSize: 10,
    color: colors.charcoal.darkest,
  },
  subscriptionPriceSubtextPrimary: {
    fontFamily: fonts.standard,
    fontSize: 10,
    color: colors.coral.dark,
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingsContainer: {
    width: '100%',
    height: 18,
    backgroundColor: colors.coral.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingsText: {
    fontFamily: fonts.standard,
    fontSize: 11,
    color: colors.white,
    marginTop: 5,
  },
  blankSavingsContainer: {
    width: '100%',
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 3,
  },
});
