import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, TouchableOpacity, Text, ColorPropType } from 'react-native';
import Modal from 'react-native-modal';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';
import WorkoutScreenStyle from '../../screens/AppStack/Workouts/WorkoutScreenStyle';
import NutritionStyles from '../../screens/AppStack/Nutrition/NutritionStyles';
import CustomBtn from '../Shared/CustomBtn';

export default class ExerciseInfoModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const {
      exerciseInfoModalVisible,
      hideExerciseInfoModal,
      exercise,
    } = this.props;
    return (
      <Modal
        isVisible={exerciseInfoModalVisible}
        animationIn="fadeIn"
        animationInTiming={400}
        animationOut="fadeOut"
        animationOutTiming={400}
      >
        {/* <View style={styles.helperModalContainer}> */}
          <View style={[styles.helperModalContainer]}>
            <View style={WorkoutScreenStyle.exerciseTileHeaderBar}>
              <View>
                <Text style={[WorkoutScreenStyle.exerciseTileHeaderTextLeft,{marginLeft:10}]}>
                  {exercise.name}
                </Text>
              </View>
            </View>
            <View style={WorkoutScreenStyle.exerciseDescriptionTextContainer}>
              {
                exercise.recommendedResistance && (
                  <Text style={WorkoutScreenStyle.exerciseDescriptionHeader}>Recommended resistance:</Text>
                )
              }
              {
                exercise.recommendedResistance && (
                  <Text style={WorkoutScreenStyle.exerciseDescriptionText}> {exercise.recommendedResistance}</Text>
                )
              }
              {
                exercise.coachingTip && (
                  <Text style={WorkoutScreenStyle.exerciseDescriptionHeader}>Coaching tip:</Text>
                )
              }
              {
                exercise.coachingTip && exercise.coachingTip.map((tip,index) => (
                  // <Text
                  //   key={index}
                  //   style={WorkoutScreenStyle.exerciseDescriptionText}
                  // >
                  //   {`• ${tip}`}
                  // </Text>
                  <View style={{flexDirection:"row",marginEnd:10}} key={index}>
                    <Text  style={NutritionStyles.ingredientsText}> • </Text>
                      <Text
                        style={NutritionStyles.ingredientsText}
                      >
                        {tip}
                    </Text>
                  </View>
                  
                ))
              }
              {
                exercise.scaledVersion && (
                  <Text style={WorkoutScreenStyle.exerciseDescriptionHeader}>Scaled version:</Text>
                )
              }
              {
                exercise.scaledVersion && (
                  <Text style={styles.exerciseDescriptionText}>{exercise.scaledVersion}</Text>
                )
              }
              {
                exercise.otherInfo && exercise.otherInfo.map((text,index) => (
                  <Text
                    key={index}
                    style={WorkoutScreenStyle.exerciseDescriptionHeader}
                  >
                    {text}
                  </Text>
                ))
              }
            </View>
          
            <View style={styles.helperModalButtonContainer}>
              {/* <TouchableOpacity
                onPress={hideExerciseInfoModal}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>
                  CONTINUE
                </Text>
              </TouchableOpacity> */}
                <CustomBtn
                  customBtnStyle={{borderRadius:50,marginBottom:20}} 
                  customBtnTitleStyle={{fontSize:14,fontFamily:fonts.bold}}
                  Title="CONTINUE"
                  outline ={true}
                  onPress={hideExerciseInfoModal}
              />
            </View>
          </View>
        
        {/* </View> */}
      </Modal>
    );
  }
}

ExerciseInfoModal.propTypes = {
  exerciseInfoModalVisible: PropTypes.bool.isRequired,
  hideExerciseInfoModal: PropTypes.func.isRequired,
  exercise: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.array])).isRequired,
};

const styles = StyleSheet.create({
  helperModalContainer: {
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth:colors.themeColor.themeBorderWidth,
    borderColor:colors.themeColor.themeBorderColor,
    backgroundColor:colors.themeColor.themeBackgroundColor,
    paddingHorizontal:5
  },
  helperModalButtonContainer: {
    backgroundColor: colors.white,
    width: '100%',
  },
  // exerciseTileHeaderBar: {
  //   width: '100%',
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   padding: 8,
  //   paddingBottom: 5,
  //   backgroundColor: colors.white,
  // },
  // exerciseTileHeaderTextLeft: {
  //   fontFamily: fonts.boldNarrow,
  //   fontSize: 14,
  //   color: colors.black,
  // },
  // exerciseDescriptionContainer: {
  //   width: '100%',
  //   marginLeft: 15,
  //   marginRight: 15,
  //   borderWidth: 2,
  //   borderTopLeftRadius: 4,
  //   borderTopRightRadius: 4,
  //   borderColor: colors.coral.standard,
  //   overflow: 'hidden',
  // },
  // exerciseDescriptionTextContainer: {
  //   padding: 15,
  // },
  exerciseDescriptionHeader: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
  },
  exerciseDescriptionText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.white,
    marginTop: 5,
    marginBottom: 5,
  },
  modalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.coral.standard,
    height: 50,
    width: '100%',
  },
  modalButtonText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    marginTop: 3,
  },
});
