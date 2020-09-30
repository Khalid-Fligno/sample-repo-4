import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Icon from '../../components/Shared/Icon';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';
import CustomBtn from '../Shared/CustomBtn';

const customBtnStyle ={
  borderRadius:50,
  marginTop:10,
  backgroundColor:colors.white,
  padding:20
 }
 const customBtnTitleStyle ={
   fontSize:14,
   fontFamily:fonts.bold,
   color:colors.transparentBlackDark}

const WorkoutPauseModal = ({
  isVisible,
  handleQuit,
  handleRestart,
  handleSkip,
  handleUnpause,
  exerciseList,
  fitnessLevel,
  currentExerciseIndex,
  reps,
}) => (
  <Modal
    isVisible={isVisible}
    animationIn="fadeIn"
    animationInTiming={800}
    animationOut="fadeOut"
    animationOutTiming={800}
  >
    <View style={{flex:0.7,justifyContent:'flex-end'}}>
      <View style={styles.pauseIconContainer}>
        <Icon
          name="pause"
          size={100}
          color={colors.white}
        />
      </View>
      <View style={styles.pauseModalContainer}>
          <CustomBtn 
            customBtnStyle={customBtnStyle}
            customBtnTitleStyle={customBtnTitleStyle}
            Title="QUIT WORKOUT"
            onPress={handleQuit}
          />
           <CustomBtn 
            customBtnStyle={customBtnStyle}
            customBtnTitleStyle={customBtnTitleStyle}
            Title="RESTART THIS SET"
            onPress={() => handleRestart(exerciseList, fitnessLevel || reps,currentExerciseIndex)}
          />
   
        {
          handleSkip && (
            <CustomBtn 
            customBtnStyle={customBtnStyle}
            customBtnTitleStyle={customBtnTitleStyle}
              Title="SKIP THIS EXERCISE"
              onPress={() => handleSkip(exerciseList, fitnessLevel || reps,currentExerciseIndex)}
            />
          )
        }
        <CustomBtn 
            customBtnStyle={customBtnStyle}
            outline={true}
            customBtnTitleStyle={{fontSize:14,fontFamily:fonts.bold}}
            Title="CONTINUE"
            onPress={handleUnpause}
        />
      </View>
    </View>
  </Modal>
);

WorkoutPauseModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  handleQuit: PropTypes.func.isRequired,
  handleRestart: PropTypes.func.isRequired,
  handleSkip: PropTypes.func,
  handleUnpause: PropTypes.func.isRequired,
  exerciseList: PropTypes.arrayOf(PropTypes.object).isRequired,
  fitnessLevel: PropTypes.string,
  reps: PropTypes.string,
};

WorkoutPauseModal.defaultProps = {
  fitnessLevel: undefined,
  reps: undefined,
  handleSkip: undefined,
};

const styles = StyleSheet.create({
  pauseModalContainer: {
    // backgroundColor: colors.white,
    borderRadius: 4,
    overflow: 'hidden',
  },
  pauseIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
  },
  // modalButtonQuit: {
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: colors.grey.standard,
  //   height: 50,
  //   width: '100%',
  //   marginBottom: 0,
  // },
  // modalButtonRestart: {
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: colors.charcoal.standard,
  //   height: 50,
  //   width: '100%',
  //   marginBottom: 0,
  // },
  // modalButtonSkip: {
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: colors.charcoal.darkest,
  //   height: 50,
  //   width: '100%',
  //   marginBottom: 0,
  // },
  // modalButtonContinue: {
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: colors.themeColor.color,
  //   height: 50,
  //   width: '100%',
  //   marginBottom: 0,
  // },
  // modalButtonText: {
  //   fontFamily: fonts.bold,
  //   fontSize: 14,
  //   color: colors.white,
  //   marginTop: 4,
  // },
  // modalButtonTextDark: {
  //   fontFamily: fonts.bold,
  //   fontSize: 14,
  //   color: colors.black,
  //   marginTop: 4,
  // },
});

export default WorkoutPauseModal;
