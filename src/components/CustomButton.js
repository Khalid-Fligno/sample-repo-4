import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import PropTypes from 'prop-types';
import colors from '../styles/colors';
import common from '../styles/common';

const CustomButton = ({
  onPress,
  title,
  disabled,
  primary,
  secondary,
  green,
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
    ]}
    textStyle={[
      styles.whiteText,
      outline && styles.defaultOutlineText,
      primary && styles.whiteText,
      primary && outline && styles.primaryOutlineText,
      secondary && styles.whiteText,
      secondary && outline && styles.secondaryOutlineText,
      green && styles.whiteText,
      green && outline && styles.greenText,
    ]}
    disabledStyle={[
      styles.defaultDisabled,
      outline && styles.defaultOutlineDisabled,
      primary && styles.primaryDisabled,
      primary && outline && styles.primaryOutlineDisabled,
      secondary && styles.secondaryDisabled,
      secondary && outline && styles.secondaryOutline,
      green && styles.greenDisabled,
      green && outline && styles.greenOutline,
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
};

CustomButton.defaultProps = {
  primary: false,
  secondary: false,
  outline: false,
  disabled: false,
};

const styles = StyleSheet.create({
  default: {
    ...common.button.solid,
    backgroundColor: colors.charcoal.standard,
    shadowColor: colors.charcoal.standard,
  },
  defaultDisabled: {
    backgroundColor: colors.charcoal.standard,
    opacity: 0.5,
  },
  whiteText: {
    color: colors.white,
    ...common.button.text,
  },
  defaultOutline: {
    ...common.button.outline,
    borderColor: colors.charcoal.standard,
    shadowColor: colors.charcoal.standard,
  },
  defaultOutlineDisabled: {
    ...common.button.outlineDisabled,
  },
  defaultOutlineText: {
    color: colors.charcoal.standard,
    ...common.button.text,
  },
  primary: {
    ...common.button.solid,
    backgroundColor: colors.coral.standard,
    shadowColor: colors.coral.light,
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
    shadowColor: colors.violet.standard,
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
    color: colors.violet.standard,
    ...common.button.text,
  },
  green: {
    ...common.button.solid,
    backgroundColor: colors.green.standard,
    shadowColor: colors.green.standard,
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
});

export default CustomButton;
