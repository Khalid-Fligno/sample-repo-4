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
      progressBarType,
      completedWorkouts,
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
                  size={wp('39%')}
                  width={4}
                  fill={(completedWorkouts/(progressBarType === 'Strength' ? 5 : 5))*100}
                  tintColor={colors.coral.darkest}
                  onAnimationComplete={() => console.log('onAnimationComplete')}
                  backgroundColor="lightgray" >
                     {
                        (fill) => (
                          <View>
                            <Text style={styles.progressBarLabel}>
                                <Text style={styles.progressCircleNumber}>{completedWorkouts}</Text>/{progressBarType === 'Strength' ? 5 : 5}
                            </Text>
                            <Text style={styles.progressCircleText}>
                             {`${progressBarType} `}
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
  progressBarType: PropTypes.oneOf(['Strength', 'Circuit','Interval']).isRequired,
  completedWorkouts: PropTypes.number.isRequired,
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
    color: colors.grey.medium,
    textAlign:'center',
    marginLeft:11,
    marginTop:-25,
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
