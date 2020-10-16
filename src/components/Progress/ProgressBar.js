import React from 'react';
import {
  StyleSheet,
  View,
  Text,Dimensions
} from 'react-native';
import PropTypes from 'prop-types';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { containerPadding } from '../../styles/globalStyles';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
const { width } = Dimensions.get('window');
export default class ProgressBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {
      title,
      completed,
      total,
      customTitleStyle,
      size,
      customProgressNumberStyle,
      customProgessTotalStyle
    } = this.props;
    return (
      <View style={styles.container}>
        {/* <Text style={styles.progressBarLabel}>
          {`${progressBarType} `}
          {completedWorkouts}/{progressBarType === 'Resistance' ? 3 : 2}
        </Text>
        <View style={styles.progressBarOuter}>
          <View
            style={[
              styles.progressBarEmpty,
              completedWorkouts === 0 && styles.progressBarEmpty,
              progressBarType === 'Resistance' && completedWorkouts === 1 && styles.resistance1,
              progressBarType === 'Resistance' && completedWorkouts === 2 && styles.resistance2,
              progressBarType === 'Resistance' && completedWorkouts >= 3 && styles.progressBarFull,
              progressBarType === 'HIIT' && completedWorkouts === 1 && styles.hiit1,
              progressBarType === 'HIIT' && completedWorkouts >= 2 && styles.progressBarFull,
            ]}
          />
          
        </View> */}
        <AnimatedCircularProgress
                  size={size}
                  width={4}
                  fill={(completed/total)*100}
                  tintColor={colors.themeColor.color}
                  onAnimationComplete={() => console.log('onAnimationComplete')}
                  backgroundColor="lightgray" 
                  rotation={0}
        >
                     {
                        (fill) => (
                          <View>
                            <Text style={[styles.progressBarLabel,customProgessTotalStyle]}>
                                <Text style={[styles.progressCircleNumber,customProgressNumberStyle]}>{completed}</Text>/{total}
                            </Text>
                            <Text style={[styles.progressCircleText,customTitleStyle]}>
                             {`${title} `}
                            </Text>
                         </View>
                        )
                      }
                      
         </AnimatedCircularProgress>         
      </View>
    );
  }
}

ProgressBar.propTypes = {
  // progressBarType: PropTypes.oneOf(['Strength', 'Circuit','Interval']).isRequired,
  title: PropTypes.any.isRequired,
  completed: PropTypes.number.isRequired,
  totalWorkouts:PropTypes.number.isRequired,
  customTitleStyle:PropTypes.object,
  size:PropTypes.any,
  customProgressNumberStyle:PropTypes.object,
  customProgessTotalStyle:PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 5,
    marginBottom: 5,
  },
  progressBarLabel: {
    fontFamily: fonts.standardNarrow,
    fontSize: hp('2%'),
    color: colors.grey.dark,
    textAlign:'center',
    marginLeft:11,
    marginTop:-20,
    marginBottom:-5,
  },

  progressCircleText:{
    textAlign:"center",
    textTransform:'uppercase',
    fontSize:wp('2.5%'),
    fontFamily:fonts.standardNarrow,
    color:colors.transparentBlackMid,
    letterSpacing:0.7,
    paddingTop:5,
  },
  progressCircleNumber:{
    fontSize:wp('19%'),
    fontFamily:fonts.standardNarrow,
    color:'#4c4d52',
    fontVariant: ['lining-nums']}
});
