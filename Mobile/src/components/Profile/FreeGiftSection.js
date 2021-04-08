import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Clipboard,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from '../Shared/Icon';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';
import { containerPadding } from '../../styles/globalStyles';

const { width } = Dimensions.get('window');

function FreeGiftSection({
  isUnlocked,
  giftName,
  minimumInvites,
  promoCode,
}) {
  return (
    <View style={isUnlocked ? styles.containerUnlocked : styles.containerLocked}>
      {
        isUnlocked ?
          (
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(promoCode);
                Alert.alert('', 'Promo code copied!');
              }}
              style={styles.copyButton}
            >
              <Text style={styles.promoCodeText}>
                {promoCode}
              </Text>
              <Icon
                name="copy"
                size={15}
                color={colors.white}
              />
            </TouchableOpacity>
          ) : (
            <Icon
              name="padlock"
              size={20}
              color={colors.white}
            />
          )
      }
      <Text style={styles.giftName}>
        {isUnlocked ? giftName : `Invite ${minimumInvites} friends to unlock this gift`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  containerLocked: {
    width: width - containerPadding*2,
    height: 90,
    marginTop: 5,
    marginBottom: 5,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.transparentBlackLight,
    borderColor: colors.white,
    borderWidth: 4,
    borderRadius: 4,
    opacity: 0.3,
  },
  containerUnlocked: {
    width: width - containerPadding*2,
    height: 90,
    marginTop: 5,
    marginBottom: 5,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.transparentBlackLight,
    borderColor: colors.green.forest,
    borderWidth: 4,
    borderRadius: 4,
  },
  copyButton: {
    flexDirection: 'row',
  },
  promoCodeText: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.white,
    marginRight: 5,
  },
  giftName: {
    fontFamily: fonts.standardNarrow,
    fontSize: 16,
    color: colors.white,
  },
});

FreeGiftSection.propTypes = {
  isUnlocked: PropTypes.bool,
  giftName: PropTypes.string.isRequired,
  minimumInvites: PropTypes.number.isRequired,
  promoCode: PropTypes.string.isRequired,
};

FreeGiftSection.defaultProps = {
  isUnlocked: false,
};

export default FreeGiftSection;
