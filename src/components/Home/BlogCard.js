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
import PropTypes, { array } from 'prop-types';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import CustomBtn from '../Shared/CustomBtn';
import { widthPercentageToDP as wp ,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { containerPadding } from '../../styles/globalStyles';
import Carousel from 'react-native-snap-carousel';
import { Image } from 'react-native';
const { width } = Dimensions.get('window');
import * as Haptics from 'expo-haptics';
import { Linking } from 'react-native';

const Blogs =[
    {
        image:require('../../../assets/images/slideImg.png'),
        title:"How to stay on track this holiday season",
        link:""
    },
    {
        image:require('../../../assets/images/slideImg.png'),
        title:"How to stay on track this holiday season",
        link:""
    }
]


export default class BlogCard extends React.PureComponent {
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
  openLink = (url) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(url);
  }

  _renderItem = ({item, index}) => {
    return (
        <View style={styles.slide}>
            <Image 
                // source={item.image}
                source={{uri:item.coverImage}}
                resizeMode='cover'
                style={{
                  width:'100%',
                  height:'55%',
                  borderRadius:3,
                  backgroundColor:colors.grey.medium
                }}
                
            />
            <Text style={styles.slideTitle}>{ item.title }</Text>
             <View style={{
                  alignItems:'center',
                  width:'100%',
                  marginBottom:wp('5%'),
                  // position:'absolute',
                  // bottom:0
                 }}>
                <CustomBtn 
                    Title ="Find out more"
                    customBtnStyle ={{
                      // width:"50%",
                      padding:wp('2.2%'),
                      borderRadius:50,
                      backgroundColor:colors.themeColor.color,
                      paddingHorizontal:wp('10%')
                    }}
                    customBtnTitleStyle = {{
                      marginTop:0,
                      fontSize:13,
                      fontFamily:fonts.boldNarrow
                    }}
                    onPress={() => this.openLink(item.urlLink)}
                />
               </View> 
        </View>
    );
}
  render() {
    const {
      onPress,
      title,
      image,
      recommendedWorkout,
      cardCustomStyle,
      cardImageStyle,
      data
    } = this.props;
    const animatedStyle = {
      transform: [{ scale: this.animatedValue }],
    };
    return (
          <View   style={[styles.cardContainer,cardCustomStyle]}>
           <ImageBackground
            //  source={image}
             style={[styles.image,cardImageStyle]}
             resizeMode="stretch"
           >
             <View style={styles.opacityLayer}>
               <View style={styles.titleContainer}>
                 <Text style={styles.title}>
                   {title}
                 </Text>
                 <View
                      style={{
                        borderTopWidth:4,
                        width:wp('14%'),
                        marginBottom:wp('5%'),
                        marginTop:wp('1.5%'),
                        borderTopColor:colors.themeColor.color,
                        borderRadius:50
                      }}
                    ></View>
               </View>
               <Carousel
                    ref={(c) => { this._carousel = c; }}
                    data={data}
                    renderItem={this._renderItem}
                    sliderWidth={wp('100%')}
                    itemWidth={wp('75%')}
                    containerCustomStyle={{
                        // backgroundColor:'green',
                        marginTop:wp('2%')
                    }}
                    slideStyle={{
                        paddingLeft:0
                    }}
                />
              
             </View>
           </ImageBackground>
          </View>
    );
  }
}

BlogCard.propTypes = {
  // onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  cardCustomStyle: PropTypes.object
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    height: wp('130%'),
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
    backgroundColor:colors.black
  },
  opacityLayer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    // backgroundColor:colors.transparentBlackLightest
  },
  titleContainer: {
    maxWidth: wp('80%'),
    paddingTop:wp('8%'),
    paddingLeft:30
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: wp('5.5%'),
    color: colors.offWhite,
    textAlign:'left',
    // shadowColor: colors.black,
    // shadowOpacity: 1,
    // shadowOffset: { width: 0, height: 0 },
    // shadowRadius: 5,
    // fontWeight:'700'
  },
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
  },
  slide:{
      backgroundColor:colors.offWhite,
      height:'92%',
    //   width:'100%',
      borderRadius:3
  },
  slideTitle:{
    fontFamily: fonts.bold,
    fontSize: wp('5%'),
    color: colors.black,
    textAlign:'left',
    paddingHorizontal:'10%',
    paddingVertical:'8%',
    textAlign:'center',
    height:'30%',
    // backgroundColor:'green',
  }
});
