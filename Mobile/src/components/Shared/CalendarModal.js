import React, { Component } from 'react';
import { Platform } from 'react-native';
import { View, Text } from 'react-native';
import { DotIndicator } from 'react-native-indicators';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import colors from '../../styles/colors';
import globalStyle from '../../styles/globalStyles';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native';
import { add } from 'react-native-reanimated';
class CalendarModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
      const {
        isVisible,
        onBackdropPress,
        value,
        onChange,
        onPress,
        addingToCalendar,
        loading
      } = this.props
      console.log('addingToCalendar',addingToCalendar)
    return (
      <View>
                  {
              Platform.OS === 'ios' && 
              <Modal
                  isVisible={isVisible}
                  animationIn="fadeIn"
                  animationInTiming={600}
                  animationOut="fadeOut"
                  animationOutTiming={600}
                  onBackdropPress={onBackdropPress}
                >
                  <View style={globalStyle.modalContainer}>
                    
                    <DateTimePicker
                      mode="date"
                      value={value}
                      onChange={onChange}
                      minimumDate={new Date()}
                      style={{marginLeft:wp('6.5%')}}
                    />
                    
                    <TouchableOpacity
                      onPress={onPress}
                      style={globalStyle.modalButton}
                    >
                      {
                        addingToCalendar ? (
                          <DotIndicator
                            color={colors.white}
                            count={3}
                            size={6}
                          />
                        ) : (
                          <Text style={globalStyle.modalButtonText}>
                            ADD TO CALENDAR
                          </Text>
                        )
                      }
                    </TouchableOpacity>
                  </View>
                </Modal>
          }
          {
            
            Platform.OS === 'android' && isVisible && !loading && 
            <DateTimePicker
              mode="date"
              value={value}
              onChange={onChange}
              minimumDate={new Date()}
            />
          }    
      </View>
    );
  }
}
CalendarModal.propTypes = {
    isVisible:PropTypes.bool,
    onBackdropPress:PropTypes.func,
    value:PropTypes.any,
    onChange:PropTypes.func,
    onPress:PropTypes.func,
    addingToCalendar:PropTypes.bool,
    loading:PropTypes.bool
  };
export default CalendarModal;
