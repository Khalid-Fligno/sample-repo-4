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
    let showRR = (exercise.recommendedResistance && !exercise.recommendedResistance.includes('N/A'))?true:false
    let showCT =  exercise.coachingTip && exercise.coachingTip.length > 0 && !exercise.coachingTip.includes("none")?true:false
    return (
      <Modal
        isVisible={exerciseInfoModalVisible}
        animationIn="fadeIn"
        animationInTiming={400}
        animationOut="fadeOut"
        animationOutTiming={400}
      >
        {/* <View style={styles.helperModalContainer}> */}
          <View style={styles.helperModalContainer}>
            <View style={WorkoutScreenStyle.exerciseTileHeaderBar}>
              <View>
                <Text style={WorkoutScreenStyle.exerciseTileHeaderTextLeft}>
                  {exercise.name.toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={WorkoutScreenStyle.exerciseDescriptionTextContainer}>
              {
                showRR && (
                  <Text style={WorkoutScreenStyle.exerciseDescriptionHeader}>Recommended resistance:</Text>
                )
              }
              {
                showRR && (
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
                  <View style={{flexDirection:"row",marginEnd:10,}} key={index}>
                    <Text  style={NutritionStyles.ingredientsText}> • </Text>
                      <Text
                        style={NutritionStyles.ingredientsText}
                      >
                        {tip.trim().replace("-","")}
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
                  <Text style={WorkoutScreenStyle.exerciseDescriptionText}>{exercise.scaledVersion}</Text>
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
                <CustomBtn
                  customBtnStyle={{borderRadius:50,marginBottom:20,marginHorizontal:8}} 
                  titleCapitalise={true}
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
  exercise: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.array,PropTypes.number])).isRequired,
};

const styles = StyleSheet.create({
  helperModalContainer: {
    flexShrink: 1,
    alignItems: 'baseline',
    justifyContent: 'flex-start',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth:colors.themeColor.themeBorderWidth,
    borderColor:colors.themeColor.themeBorderColor,
    backgroundColor:colors.themeColor.themeBackgroundColor,
    // paddingHorizontal:5
  },
  helperModalButtonContainer: {
    backgroundColor: colors.white,
    width: '100%',
  },

});
