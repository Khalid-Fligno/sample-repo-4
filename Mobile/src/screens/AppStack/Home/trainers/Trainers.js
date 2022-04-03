import React from 'react';
import {
        Image,
        View,
        Text,
        ScrollView,
        FlatList,
        TouchableOpacity,
        Linking,
        } from'react-native';
 import {
         widthPercentageToDP as wp,
         heightPercentageToDP as hp,
        } from "react-native-responsive-screen";
 import { db } from "../../../../config/firebase";

import fonts from "../../../../styles/fonts";
import * as Haptics from "expo-haptics";
import TimeSvg from "../../../../../assets/icons/time";
import * as FileSystem from "expo-file-system";




export default class Trainers extends React.PureComponent {
    constructor(props){
        super(props);
        this.state={
            recipe: undefined
        }
    }

    onFocusFunction(){
        this.setState({
            name : this.props.navigation.getParam("name",null),
            title : this.props.navigation.getParam("title",null),
            about : this.props.navigation.getParam("about",null),
            profile: this.props.navigation.getParam("profile",null),
            coverImage: this.props.navigation.getParam("coverImage",null)


        })
    }



    componentDidMount(){
        this.onFocusFunction();
        this.fetchFavoriteRecipe();
    }

    fetchFavoriteRecipe = async() =>{
        const id = this.props.navigation.getParam("id",null)
        const snapshot = await db
        .collection("recipes")
        .where("favorite", "array-contains", id)
        .get();
      let recipe = [];
      snapshot.forEach((doc) => {
        // if (doc.data().startDay <= cDay && doc.data().endDay >= cDay)
        recipe.unshift(doc.data());
      });
      this.setState({ recipe, loading: false });
  
    }

render(){
    const {name,title,about,profile,recipe,coverImage} = this.state;


return(
    <ScrollView style={{}}>
        <View style={{ marginBottom: wp("10%"), flex: 1,alignItems:'center' }}>
            <View style={{alignContent:'center',flex: 1}}>
                <Image
                style={{height: wp('70%'),width: wp('100%')}}
                resizeMode='cover'
                source={{
                    uri: coverImage
                }
                }
                />
                <View style={{position: 'absolute'}}>
                <Image
                    style={{
                        height: wp('30%'),
                        width: wp('30%'),
                        borderRadius: 100,
                        left: 50,
                        top: hp('25%'),
                        bottom: 0,
                        borderColor: 'white',
                        overflow: 'hidden',
                        borderWidth: 5
                    }}
                    resizeMode='cover'
                    source={{
                        uri: profile
                    }}
                />
                </View>
                <View style={{
                    justifyContent:'center',
                    alignItems:'center',
                    paddingTop: hp('8%')
                    }}>
                        <View style={{alignSelf:'flex-start',paddingLeft: wp('15%'),paddingRight: wp('15%')}}>
                           <Text style={{
                                fontSize: wp("5.5%"),
                                fontFamily: fonts.bold,
                                fontWeight: "bold",
                                }}
                            >
                            {name}
                          </Text>
                          <Text style={{
                                fontSize: wp("4.5%"),
                                fontFamily: fonts.bold,
                                fontWeight: "bold",
                                paddingTop: hp('1%')
                                }}
                            >
                                {title}
                          </Text>
                          <Text style={{
                                fontSize: wp("4.5%"),
                                fontFamily: fonts.bold,
                                fontWeight: "bold",
                                paddingTop: hp('3%')
                                }}
                            >
                                About
                          </Text>
                         <View style={{justifyContent:'center',alignItems:'center',paddingTop: hp('3%')}}>
                          <Text style={{
                                fontSize: wp("3.5%"),
                                fontFamily: fonts.bold,
                                fontWeight: "bold",
                                }}
                            >
                                {about}
                          </Text>
                          </View>

                          <View style={{paddingTop: hp('3%')}}>
                          <Text style={{
                                fontSize: wp("5.5%"),
                                fontFamily: fonts.bold,
                                fontWeight: "bold",
                                }}
                            >
                            {name}'s favorite recipe
                          </Text>
                          <View style={{alignItems:'flex-end'}}>
                          <Text
                            style={{
                                fontSize: wp("3.2%"),
                                fontFamily: fonts.bold,
                                fontWeight: "bold",
                                }}
                          >Scroll for more {'>'}{'>'} </Text>
                          </View>
                                
                         </View>
                        </View>
                        <View style={{ flex: 1,width: wp('75%')}}>
                              <FlatList
                               horizontal
                                style={{
                                    flex: 1
                                }}
                                data={recipe}
                                renderItem={({item})=>{
                                    return(
                                  <TouchableOpacity  onPress={() =>
                                        this.props.navigation.push("RecipeTrainer", {
                                        recipe: item,
                                        title: this.props.navigation.getParam("meal", null),
                                        })
                                    }
                                    image={
                                        `${FileSystem.cacheDirectory}recipe-${item.id}.jpg` || item.coverImage
                                    }
                                    title={item.title.toUpperCase()}
                                    tags={item.tags}
                                    subTitle={item.subtitle}
                                    time={item.time}
                                    newBadge={item.newBadge}>
                                     <View style={{ 
                                          paddingRight: wp('10%'),
                                          paddingTop: hp('3%')
                                     }}>
                                       <Image
                                        style={{
                                            overflow:'hidden',
                                            width: wp('70%'),
                                            height: hp('20%'),
                                            borderRadius: 10
                                        }}
                                        source={{
                                            uri: item.coverImage
                                        }}
                                        resizeMode='cover'
                                       />
                                    <View style={{paddingTop: hp('2%')}}>
                                        <Text style={{
                                                    fontSize: wp("4.0%"),
                                                    fontFamily: fonts.bold,
                                                    fontWeight: "bold",
                                                    }}
                                                >
                                                {item.title}

                                        </Text>

                                     </View>
                                    <View style={{flexDirection:'row',paddingTop: hp('1%')}}>
                                        <View> 
                                             <TimeSvg width="22" height="22" />
                                        </View>
                                        <View style={{paddingLeft: wp('2%')}}>
                                             <Text>{item.time}</Text>
                                        </View>
                                    </View>
                                    </View>
                                    </TouchableOpacity>
                                    );
                                }}
                                /> 
                         </View>
                 </View>
            </View>
        </View>
    </ScrollView>
)
}



}