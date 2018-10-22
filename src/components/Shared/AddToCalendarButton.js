import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '../../components/Shared/Icon';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';

export default class AddToCalendarButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { onPress } = this.props;
    return (
      <TouchableOpacity
        onPress={onPress}
        style={styles.addToCalendarButton}
      >
        <Icon
          name="add-to-calendar"
          size={25}
          color={colors.charcoal.standard}
        />
        <Text style={styles.addToCalendarButtonText}>
          Add to calendar
        </Text>
      </TouchableOpacity>
    );
  }
}

AddToCalendarButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  addToCalendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.white,
    padding: 3,
    borderWidth: 2,
    borderColor: colors.charcoal.light,
    borderRadius: 4,
    shadowColor: colors.charcoal.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  addToCalendarButtonText: {
    fontFamily: fonts.standard,
    fontSize: 13,
    color: colors.charcoal.light,
    marginTop: 4,
    marginLeft: 5,
    marginRight: 5,
  },
});
