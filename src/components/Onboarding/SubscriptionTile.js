import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '../../components/Shared/Icon';
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
      onPress,
      primary,
      term,
      identifier,
    } = this.props;
    return (
      <TouchableOpacity
        onPress={onPress}
        style={primary ? styles.subscriptionTilePrimary : styles.subscriptionTile}
      >
        <View style={primary ? styles.tileHeaderBarPrimary : styles.tileHeaderBar}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.subscriptionTileHeader}
          >
            {title} {tileHeaderInfoMap[identifier]}
          </Text>
        </View>
        <View style={styles.subscriptionTileContainer}>
          <View style={styles.blankSubscriptionTileColumn} />
          <View style={styles.textContainer}>
            <Text style={primary ? styles.subscriptionPriceTextPrimary : styles.subscriptionPriceText}>
              {price}
            </Text>
            <Text style={primary ? styles.subscriptionTermTextPrimary : styles.subscriptionTermText}>
              {term}
            </Text>
            <Text style={primary ? styles.subscriptionPriceSubtextPrimary : styles.subscriptionPriceSubtext}>
              after 7 day FREE trial
            </Text>
          </View>
          <View style={styles.iconSubscriptionTileColumn}>
            {
              primary && (
                <Icon
                  name="chevron-right"
                  size={22}
                  color={colors.coral.standard}
                />
              )
            }
            {
              !primary && (
                <Icon
                  name="chevron-right"
                  size={22}
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
};

SubscriptionTile.defaultProps = {
  primary: false,
};

const styles = StyleSheet.create({
  subscriptionTile: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.transparentWhiteLightest,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 10,
    paddingTop: 0,
    borderWidth: 3,
    borderColor: colors.black,
    borderRadius: 4,
    shadowColor: colors.black,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  subscriptionTilePrimary: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.transparentWhiteLightest,
    marginLeft: 5,
    marginRight: 5,
    paddingTop: 0,
    borderWidth: 3,
    borderColor: colors.coral.standard,
    borderRadius: 4,
    shadowColor: colors.charcoal.darkest,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  tileHeaderBar: {
    backgroundColor: colors.black,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileHeaderBarPrimary: {
    backgroundColor: colors.coral.dark,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscriptionTileHeader: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.white,
    marginTop: 5,
    marginBottom: 3,
  },
  subscriptionTileContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  blankSubscriptionTileColumn: {
    width: 30,
  },
  iconSubscriptionTileColumn: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  subscriptionPriceText: {
    fontFamily: fonts.ultraItalic,
    fontSize: 16,
    color: colors.white,
    marginBottom: 3,
  },
  subscriptionPriceTextPrimary: {
    fontFamily: fonts.ultraItalic,
    fontSize: 16,
    color: colors.white,
    marginBottom: 3,
  },
  subscriptionTermText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.white,
    marginBottom: 5,
  },
  subscriptionTermTextPrimary: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.white,
    marginBottom: 5,
  },
  subscriptionPriceSubtext: {
    fontFamily: fonts.standard,
    fontSize: 12,
    color: colors.white,
    textDecorationLine: 'underline',
  },
  subscriptionPriceSubtextPrimary: {
    fontFamily: fonts.standard,
    fontSize: 12,
    color: colors.white,
    textDecorationLine: 'underline',
  },
});
