import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PropTypes, { number } from 'prop-types';
import { PieChart } from 'react-native-svg-charts';
import Icon from '../Shared/Icon';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import { AnimatedCircularProgress } from 'react-native-circular-progress';


class WorkoutProgressBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { currentExercise, currentSet ,exerciseList,workoutReps} = this.props;
    let dataValue= 100/workoutReps;
    let dataSet=[]
    for(i=0;i<workoutReps;i++){
        dataSet.push(dataValue);
    }
    console.log(currentExercise, currentSet)
 
    let getFill =(index)=>{
        return(
            currentExercise === index+1 ?(currentSet/(workoutReps))*100:
            currentExercise > index + 1?100:0
        )
    }
    return (
      <View style={styles.container}>
        {
          exerciseList.map((res,index)=>(
              <View style={styles.exercise} key={index}>
                    <AnimatedCircularProgress
                            size={45}
                            width={5}
                            fill={getFill(index) }
                            rotation={0}
                            tintColor={colors.coral.darkest}
                            onAnimationComplete={() => console.log('onAnimationComplete')}
                            backgroundColor="lightgray" >
                            {
                                (fill) => (
                                    <View>
                                    <Text >
                                        {
                                        currentExercise === index+1 &&(
                                            <Text style={styles.currentSetText}>{currentSet}</Text>
                                        )
                                        }
                                        {
                                        currentExercise > index+1 && (
                                            ( <Icon
                                            name="tick-heavy"
                                            color={colors.charcoal.dark}
                                            size={22}
                                            />)
                                        )
                                        }
                                        
                                        
                                    </Text>
                                    
                                </View>
                                )
                                }
                    </AnimatedCircularProgress> 
              </View>

              
          ))
        }
        
      </View>
    );
  }
}

WorkoutProgressBar.propTypes = {
  currentExercise: PropTypes.number.isRequired,
  currentSet: PropTypes.number.isRequired,
  exerciseList: PropTypes.array.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex:0.5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: 48,
    // paddingLeft: 5,
    // paddingRight: 5,
    backgroundColor: colors.white,
  },
  exercise: {
    paddingLeft: 10,
    paddingRight: 10,
    marginTop:5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieChart: {
    height: 48,
    width: 48,
  },
  invisibleView: {
    height: 0,
  },
  tickContainer: {
    marginTop: -36,
  },
  currentSetTextContainer: {
    marginTop: -37,
  },
  currentSetText: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.charcoal.dark,
  },
});

export default WorkoutProgressBar;
