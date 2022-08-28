import React from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import SavingsBadge from "./SavingsBadge";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";
import RoundTick from "../../../assets/icons/RoundTick";
import EmptyRoundTick from "../../../assets/icons/EmptyRoundTick";

const SubscriptionTile = (props) => {
  const {
    title,
    price,
    priceNumber,
    onPress,
    comparisonPrice,
    selected,
    term,
    trialPeriod,
    savingsPercent,
    additionalText
  } = props;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.subscriptionTile,
        {
          borderColor: selected ? colors.themeColor.color : colors.grey.dark,
        },
      ]}
    >
      <View style={styles.subscriptionTileContainer}>
        <View style={styles.textContainer}>
          <View>
            <View style={styles.subscriptionTitleContainer}>
              {<Text>{title} </Text>}
              <Text>{savingsPercent && <SavingsBadge text={`Save ${savingsPercent}%`}/>}</Text>
            </View>
            <Text
              style={[
                styles.priceTitle,
                {
                  color: selected ? colors.themeColor.color : colors.grey.dark,
                },
              ]}>
              {price}
              <Text style={styles.yearlySubTitle}>/ {term}

              </Text>
            </Text>
          </View>
          {comparisonPrice && (
            <Text style={styles.comparisonPrice}>{comparisonPrice}</Text>
          )}
          {savingsPercent && (
            <Text style={{ marginTop: 3 }}>
              <Text style={styles.subscriptionPriceText}>
                {`${price[0]}${(priceNumber / 12).toFixed(2)}`} / month
              </Text>
            </Text>
          )}
          {trialPeriod && (
            <Text style={[styles.subText, { marginTop: 1 }]}>
              {`After ${trialPeriod} free trial`}
            </Text>
          )}
          {additionalText && (
            <Text style={[styles.subText, { marginTop: 1 }]}>
              {additionalText}
            </Text>
          )}
        </View>
        <View style={styles.iconSubscriptionTileColumn}>
          {selected && <RoundTick height={50} width={60} />}
          {!selected && <EmptyRoundTick height={50} width={60} />}
        </View>
      </View>
    </TouchableOpacity>
  );
};

SubscriptionTile.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  term: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  savingsPercent: PropTypes.string,
  comparisonPrice: PropTypes.string,
  priceNumber: PropTypes.number.isRequired,
  isDiscounted: PropTypes.bool,
  selected: PropTypes.bool,
  currencyCode: PropTypes.any,
  currencySymbol: PropTypes.any,
};

SubscriptionTile.defaultProps = {
  savingsPercent: undefined,
  comparisonPrice: undefined,
  isDiscounted: false,
  selected: false,
};

const styles = StyleSheet.create({
  subscriptionTile: {
    justifyContent: "space-between",
    backgroundColor: "transparent",
    margin: 10,
    paddingHorizontal: 25,
    paddingVertical: 15,

    borderWidth: colors.themeColor.themeBorderWidth,
    borderColor: colors.grey.standard,
    borderRadius: 2,
  },
  subscriptionTilePrimary: {
    justifyContent: "space-between",
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
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconSubscriptionTileColumn: {
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    justifyContent: "center",
    flex: 1,
  },
  subscriptionTitleRow: {
    flexDirection: "row",
  },
  subscriptionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  subscriptionTitleText: {
    letterSpacing: fonts.letterSpacing,
    fontFamily: fonts.GothamMedium,
    fontSize: 15,
    color: colors.charcoal.dark,
    marginBottom: 2,
  },
  yearlySubTitle: {
    fontFamily: fonts.GothamMedium,
    fontSize: 12,
    color: colors.grey.dark,
  },
  priceTitle: {
    fontSize: 30,
    fontFamily: fonts.bold,
  },
  comparisonPrice: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    fontFamily: fonts.standard,
    fontSize: 12,
    color: colors.grey.light,
  },
  subscriptionPriceText: {
    fontFamily: fonts.GothamMedium,
    fontSize: 12,
    color: colors.grey.dark,
  },
  subText: {
    fontFamily: fonts.GothamMedium,
    fontSize: 12,
    color: colors.grey.dark,
  },
});

export default SubscriptionTile;