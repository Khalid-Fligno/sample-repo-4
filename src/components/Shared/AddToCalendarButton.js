import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';
import Icon from '../../components/Shared/Icon';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CalenderSvg from '../../../assets/icons/calender';

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
        activeOpacity={0.8}
      >
        {/* <Icon
          name="add-to-calendar"
          size={22}
          color={colors.themeColor.color}
        /> */}
        <CalenderSvg />
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
    padding: 3,
    borderWidth: 2,
    backgroundColor:colors.themeColor.themeBackgroundColor,
    borderColor: colors.grey.standard,
    borderRadius: 50,
    shadowColor: colors.charcoal.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    padding:5,
    paddingLeft:15,
    paddingRight:10,
  },
  addToCalendarButtonText: {
    // fontFamily: fonts.standard,
    letterSpacing:0.5,
    fontSize: 14,
    color: colors.themeColor.color,
    marginLeft: 8,
    marginRight: 5,
    fontWeight:'600'
  },
});
