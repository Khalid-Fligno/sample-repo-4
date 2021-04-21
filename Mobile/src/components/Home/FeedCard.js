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
import { widthPercentageToDP as wp ,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { containerPadding } from '../../styles/globalStyles';

const { width } = Dimensions.get('window');

export default class FeedCard extends React.PureComponent {
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
      cardCustomStyle,
      cardImageStyle,
      customTitleStyle,
      customBtnStyle={},
      customBtnTitleStyle={},
      btnTitle,
      image
    } = this.props;

    
    const animatedStyle = {
      transform: [{ scale: this.animatedValue }],
    };
    return (
          <View   style={[styles.cardContainer,cardCustomStyle]}>
           <ImageBackground
             source={image}
             style={[styles.image,cardImageStyle]}
             resizeMode="stretch"
           >
             <View style={styles.opacityLayer}>
               {
                  title &&
                    <View style={styles.titleContainer}>
                        <Text style={[styles.title,customTitleStyle]}>
                          {title}
                        </Text>
                        <View
                              style={{
                                borderTopWidth:4,
                                width:'15%',
                                marginBottom:wp('5%'),
                                marginTop:wp('1.5%'),
                                borderTopColor:colors.themeColor.color,
                                borderRadius:50
                              }}
                            ></View>
                      </View>
               }
            
         
               <View style={{
                  position:'absolute',
                  bottom:0,
                  alignItems:'center',
                  width:'100%',
                  marginBottom:wp('8%')
                 }}>
                <CustomBtn 
                    Title ={btnTitle}
                    customBtnStyle ={{
                      // width:"50%",
                      padding:wp('2.2%'),
                      borderRadius:50,
                      backgroundColor:colors.themeColor.color,
                      paddingHorizontal:wp('10%'),
                      ...customBtnStyle}}
                    customBtnTitleStyle = {{
                      marginTop:0,
                      fontSize:13,
                      fontFamily:fonts.boldNarrow,
                      ...customBtnTitleStyle
                    }}
                    onPress = {onPress}
                />
               </View> 
             </View>
           </ImageBackground>
          </View>
    );
  }
}

FeedCard.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string,
  // image: PropTypes.number.isRequired,
  cardCustomStyle: PropTypes.object,
  customTitleStyle:PropTypes.object
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    height: wp('110%'),
    // margin: 5,
    // shadowColor: colors.charcoal.standard,
    // shadowOpacity: 0.5,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 4,
    marginHorizontal:containerPadding,
    borderRadius:3
  },
  flexContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius:3,
    backgroundColor:'#f7f7f7'
  },
  opacityLayer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    // backgroundColor:colors.transparentBlackLightest
  },
  titleContainer: {
    // maxWidth: wp('80%'),
    paddingTop:wp('8%'),
    paddingLeft:30,
    alignItems:'flex-start'
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: wp('5.5%'),
    color: colors.black,
    textAlign:'left',
    textTransform:'uppercase'
    // shadowColor: colors.black,
    // shadowOpacity: 1,
    // shadowOffset: { width: 0, height: 0 },
    // shadowRadius: 5,
    // fontWeight:'700'
  },
//   title2: {
//     fontSize: wp('11%'),
//     color: colors.offWhite,
//     textAlign:'left',
//     // shadowColor: colors.black,
//     // shadowOpacity: 1,
//     // shadowOffset: { width: 0, height: 0 },
//     // shadowRadius: 5,
//     fontStyle:'italic',
//     fontWeight:'700'
//   },
  innerViewContainer: {
    maxWidth: width / 1.8,
    paddingTop:12,
    paddingLeft:30,
    paddingTop:5,
    flexDirection:'column',
  },
  recTextLabel:{
    color:colors.offWhite,
    fontFamily:fonts.bold,
    marginBottom:wp('1%')
  }
});
