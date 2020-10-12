import React, { PureComponent } from 'react';
import {  View, Text, Picker ,TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import globalStyle from '../../styles/globalStyles';
import CustomBtn from '../Shared/CustomBtn';
const PickerModal = (props) => {
    let {
        metric,
        imerial,
        dataMapList,
        onValueChange,
        isVisible,
        onBackdropPress,
        selectedValue,
        onPress,
        inputType
    } = props
    let labelExtention = '';
    if((inputType === 'weight' || inputType === 'goalWeight'))
        labelExtention = metric?'kg':'lbs'
    
    if((inputType === 'waist' || inputType === 'hip' || inputType === "height" ))
        labelExtention = metric?'cm':'ft'

    return (
        <Modal
                isVisible={isVisible}
                onBackdropPress={onBackdropPress}
                animationIn="fadeIn"
                animationInTiming={600}
                animationOut="fadeOut"
                animationOutTiming={600}
                
         >
            <View style={globalStyle.modalContainer}>
          <Picker
            selectedValue={selectedValue}
            onValueChange={onValueChange}
          >
            {
              dataMapList.map((i) => (
                  <Picker.Item
                    key={i.value}
                    label={`${i.label} ${labelExtention}`}
                    value={i.value}
                  />
                ))
            }
          </Picker>

          {/* <CustomBtn 
            Title="Done"
            onPress={onPress}
            titleCapitalise={true}
            customBtnStyle={{borderRadius:50,margin:10}}
          /> */}
          <TouchableOpacity
            title="DONE"
            onPress={onPress}
            style={globalStyle.modalButton}
          >
            <Text style={globalStyle.modalButtonText}>
              DONE
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
}

PickerModal.propTypes = {
    metric:PropTypes.bool,
    imerial:PropTypes.bool,
    dataMapList:PropTypes.array,
    onValueChange:PropTypes.func,
    isVisible:PropTypes.bool,
    onBackdropPress:PropTypes.func,
    onValueChange:PropTypes.func,
    selectedValue:PropTypes.any,
    onPress:PropTypes.any,
    inputType:PropTypes.any
  };

export default PickerModal
