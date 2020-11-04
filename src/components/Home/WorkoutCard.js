import React from 'react';
import {
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground,
  View,
  Animated,
} from 'react-native';
import PropTypes from 'prop-types';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import CustomBtn from '../Shared/CustomBtn';

const { width } = Dimensions.get('window');

export default class WorkOutCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(1);
  }
  handlePressIn = () => {
    Animated.spring(this.animatedValue, {
      toValue: 0.92,
      useNativeDriver:true
    }).start();
  }
  handlePressOut = () => {
    Animated.spring(this.animatedValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver:true
    }).start();
  }
  render() {
    const {
      onPress,
      title,
      image,
      recommendedWorkout,
      cardCustomStyle
    } = this.props;
    const animatedStyle = {
      transform: [{ scale: this.animatedValue }],
    };
    return (
          <View   style={[styles.cardContainer,cardCustomStyle]}>
           <ImageBackground
             source={image}
             style={styles.image}
           >
             <View style={styles.opacityLayer}>
               <View style={styles.titleContainer}>
                 <Text style={styles.title}>
                   {title.toUpperCase()}
                 </Text>
               </View>
               <View style={styles.innerViewContainer}>
                    {recommendedWorkout.map(res=>(
                      <Text key={res} style={styles.recTextLabel}> {res}</Text>)
                    )}
               </View>
               <View style={{paddingLeft:30,paddingTop:12}}>
                <CustomBtn 
                    Title ="View full calender"
                    customBtnStyle ={{width:"50%",padding:3,borderRadius:50,backgroundColor:colors.coral.standard}}
                    customBtnTitleStyle = {{marginTop:0,fontSize:13,fontFamily:fonts.boldNarrow}}
                    onPress = {onPress}
                />
               </View> 
             </View>
           </ImageBackground>
          </View>
    );
  }
}

WorkOutCard.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  image: PropTypes.number.isRequired,
  recommendedWorkout: PropTypes.array,
  cardCustomStyle: PropTypes.object
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    height: (width - 30) / 2.2,
    margin: 5,
    shadowColor: colors.charcoal.standard,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  flexContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  opacityLayer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    backgroundColor:colors.transparentBlackLightest
  },
  titleContainer: {
    maxWidth: width / 1.8,
    paddingTop:10,
    paddingLeft:30
  },
  title: {
    fontFamily: fonts.boldNarrow,
    fontSize: 28,
    color: colors.offWhite,
    textAlign:'left',
    shadowColor: colors.black,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
  },
  innerViewContainer: {
    maxWidth: width / 1.8,
    paddingTop:12,
    paddingLeft:30,
    paddingTop:5,flexDirection:'row',
    
  },
  recTextLabel:{
    color:colors.themeColor.color,
    fontFamily:fonts.bold
  }
});
