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
      solid,
      term,
    } = this.props;
    return (
      <TouchableOpacity
        onPress={onPress}
        style={solid ? styles.subscriptionTileSolid : styles.subscriptionTile}
      >
        {
          solid && (
            <View style={styles.invisibleView}>
              <View style={styles.savingsBox}>
                <Text style={styles.savingsText}>
                  Save 41%
                </Text>
              </View>
            </View>
          )
        }
        <View style={styles.subscriptionTileContent}>
          <View>
            <Text style={solid ? styles.subscriptionTileHeaderSolid : styles.subscriptionTileHeader}>
              {title}
            </Text>
            <Text style={solid ? styles.subscriptionPriceTextSolid : styles.subscriptionPriceText}>
              {price} / {term} <Text style={solid ? styles.subscriptionPriceSubtextSolid : styles.subscriptionPriceSubtext}>after 7 day FREE TRIAL</Text>
            </Text>
          </View>
          <Icon
            name="chevron-right"
            size={20}
            color={solid ? colors.white : colors.coral.standard}
          />
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
  solid: PropTypes.bool,
};

SubscriptionTile.defaultProps = {
  solid: false,
};

const styles = StyleSheet.create({
  subscriptionTile: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.white,
    margin: 5,
    padding: 10,
    paddingLeft: 15,
    borderWidth: 2,
    borderColor: colors.coral.standard,
    borderRadius: 4,
  },
  subscriptionTileSolid: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.coral.standard,
    margin: 5,
    padding: 10,
    paddingLeft: 15,
    borderWidth: 2,
    borderColor: colors.coral.standard,
    borderRadius: 4,
    shadowColor: colors.charcoal.standard,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  invisibleView: {
    height: 0,
    width: '100%',
    alignItems: 'flex-end',
  },
  savingsBox: {
    position: 'absolute',
    marginTop: -35,
    backgroundColor: colors.coral.dark,
    borderRadius: 4,
  },
  savingsText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.white,
    marginTop: 8,
    marginRight: 10,
    marginBottom: 5,
    marginLeft: 10,
  },
  subscriptionTileContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subscriptionTileHeader: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.coral.standard,
    marginBottom: 5,
  },
  subscriptionTileHeaderSolid: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.white,
    marginBottom: 5,
  },
  subscriptionPriceText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.coral.standard,
  },
  subscriptionPriceTextSolid: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
  },
  subscriptionPriceSubtext: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.coral.standard,
  },
  subscriptionPriceSubtextSolid: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.white,
  },
});
