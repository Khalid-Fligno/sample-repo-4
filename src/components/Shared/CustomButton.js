import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import PropTypes from 'prop-types';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';

const { width } = Dimensions.get('window');

const CustomButton = ({
  onPress,
  title,
  disabled,
  primary,
  secondary,
  green,
  blue,
  outline,
  loading,
}) => (
  <Button
    title={title}
    onPress={onPress}
    activeOpacity={0.7}
    loading={loading}
    disabled={disabled}
    buttonStyle={[
      styles.default,
      outline && styles.defaultOutline,
      primary && styles.primary,
      primary && outline && styles.primaryOutline,
      secondary && styles.secondary,
      secondary && outline && styles.secondaryOutline,
      green && styles.green,
      green && outline && styles.greenOutline,
      blue && styles.blue,
    ]}
    textStyle={[
      styles.whiteText,
      outline && styles.defaultOutlineText,
      primary && styles.whiteText,
      primary && outline && styles.primaryOutlineText,
      secondary && styles.whiteText,
      secondary && outline && styles.secondaryOutlineText,
      green && styles.whiteText,
      green && outline && styles.greenOutlineText,
      blue && styles.whiteText,
    ]}
    disabledStyle={[
      styles.defaultDisabled,
      outline && styles.defaultOutlineDisabled,
      primary && styles.primaryDisabled,
      primary && outline && styles.primaryOutlineDisabled,
      secondary && styles.secondaryDisabled,
      secondary && outline && styles.secondaryOutlineDisabled,
      green && styles.greenDisabled,
      green && outline && styles.greenOutlineDisabled,
    ]}
  />
);

CustomButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  primary: PropTypes.bool,
  secondary: PropTypes.bool,
  outline: PropTypes.bool,
  disabled: PropTypes.bool,
  green: PropTypes.bool,
  blue: PropTypes.bool,
  loading: PropTypes.bool,
};

CustomButton.defaultProps = {
  primary: false,
  secondary: false,
  outline: false,
  disabled: false,
  green: false,
  blue: false,
  loading: false,
};

const common = {
  button: {
    solid: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      width: width - 20,
      borderRadius: 2,
      shadowOpacity: 0.8,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 2,
    },
    outline: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      width: width - 20,
      borderRadius: 2,
      borderWidth: 4,
      shadowOpacity: 0.5,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 3,
      backgroundColor: colors.white,
    },
    outlineDisabled: {
      backgroundColor: colors.white,
      opacity: 0.5,
    },
    text: {
      fontFamily: fonts.bold,
      fontSize: 16,
      marginTop: 3,
    },
  },
};

const styles = StyleSheet.create({
  default: {
    ...common.button.solid,
    backgroundColor: colors.charcoal.dark,
    shadowColor: colors.charcoal.standard,
  },
  defaultDisabled: {
    backgroundColor: colors.charcoal.dark,
    opacity: 0.5,
  },
  whiteText: {
    color: colors.white,
    ...common.button.text,
  },
  defaultOutline: {
    ...common.button.outline,
    borderColor: colors.charcoal.dark,
    shadowColor: colors.charcoal.dark,
  },
  defaultOutlineDisabled: {
    ...common.button.outlineDisabled,
  },
  defaultOutlineText: {
    color: colors.charcoal.dark,
    ...common.button.text,
  },
  primary: {
    ...common.button.solid,
    backgroundColor: colors.coral.standard,
    shadowColor: colors.grey.dark,

  },
  primaryDisabled: {
    backgroundColor: colors.coral.standard,
    opacity: 0.5,
  },
  primaryOutline: {
    ...common.button.outline,
    borderColor: colors.coral.standard,
    shadowColor: colors.coral.standard,
  },
  primaryOutlineDisabled: {
    ...common.button.outlineDisabled,
  },
  primaryOutlineText: {
    color: colors.coral.standard,
    ...common.button.text,
  },
  secondary: {
    ...common.button.solid,
    backgroundColor: colors.violet.standard,
    shadowColor: colors.grey.dark,
  },
  secondaryDisabled: {
    backgroundColor: colors.violet.standard,
    opacity: 0.5,
  },
  secondaryOutline: {
    ...common.button.outline,
    borderColor: colors.violet.standard,
    shadowColor: colors.violet.standard,
  },
  secondaryOutlineDisabled: {
    ...common.button.outlineDisabled,
  },
  secondaryOutlineText: {
    color: colors.violet.dark,
    ...common.button.text,
  },
  green: {
    ...common.button.solid,
    backgroundColor: colors.green.standard,
    shadowColor: colors.grey.dark,
  },
  greenDisabled: {
    backgroundColor: colors.green.standard,
    opacity: 0.5,
  },
  greenOutline: {
    ...common.button.outline,
    borderColor: colors.green.standard,
    shadowColor: colors.green.standard,
  },
  greenOutlineDisabled: {
    ...common.button.outlineDisabled,
  },
  greenOutlineText: {
    color: colors.green.standard,
    ...common.button.text,
  },
  blue: {
    ...common.button.solid,
    backgroundColor: colors.blue.standard,
    shadowColor: colors.grey.dark,

  },
});

export default CustomButton;
