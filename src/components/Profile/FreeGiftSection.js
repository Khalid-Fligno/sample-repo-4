import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Dimensions, Clipboard, TouchableOpacity, Alert } from 'react-native';
import Icon from '../Shared/Icon';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';

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
                Alert.alert('Promo code copied!');
              }}
              style={styles.copyButton}
            >
              <Text style={styles.promoCodeText}>{promoCode}</Text>
              <Icon name="copy" size={15} color={colors.grey.standard} />
            </TouchableOpacity>
          ) : (
            <Icon
              name="padlock"
              size={20}
              color={colors.black}
            />
          )
      }
      <Text style={{ fontFamily: fonts.standardNarrow }}>{isUnlocked ? giftName : `Invite ${minimumInvites} friends to unlock this gift`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  containerLocked: {
    width: width - 20,
    height: 80,
    marginTop: 5,
    marginBottom: 5,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderColor: colors.black,
    borderWidth: 3,
    borderRadius: 3,
    opacity: 0.2,
  },
  containerUnlocked: {
    width: width - 20,
    height: 80,
    marginTop: 5,
    marginBottom: 5,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderColor: colors.black,
    borderWidth: 3,
    borderRadius: 3,
  },
  copyButton: {
    flexDirection: 'row',
  },
  promoCodeText: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.black,
    marginRight: 5,
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
