import React from "react";
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Dimensions,
    SafeAreaView,
    FlatList,
    Text,
} from "react-native";
import colors from "../../../../styles/colors";
import fonts from '../../../../styles/fonts';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Card } from 'react-native-elements';
import { db } from "../../../../../config/firebase";
import AsyncStorage from "@react-native-community/async-storage";
import Icon from "react-native-vector-icons/AntDesign";
import { convertRecipeData } from "../../../../utils/challenges";

const { width } = Dimensions.get("window");

export default class FilterScreen extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            favoriteList: [],
            recipeIsExist: false
        }
    }

    componentDidMount = () => {
        this.ifExist(this.props.item, this.props.activeChallengeUserData, this.props.title)
    }

    onFavorite = async (item, activeChallengeUserData, title) => {
        this.setState({ favoriteList: [...this.state.favoriteList, item.id] })

        const id = activeChallengeUserData.id
        const uid = await AsyncStorage.getItem("uid");
        const activeChallengeUserRef = db
            .collection("users")
            .doc(uid)
            .collection("challenges")
            .doc(id)

        if (item.types.filter(name => name === title.toLowerCase())) {
            if (title.toLowerCase() === 'breakfast') {
                activeChallengeUserRef.set({ "faveRecipe": { 'breakfast': [item.id] } }, { merge: true })
            }
            if (title.toLowerCase() === 'lunch') {
                activeChallengeUserRef.set({ "faveRecipe": { 'lunch': [item.id] } }, { merge: true })
            }
            if (title.toLowerCase() === 'dinner') {
                activeChallengeUserRef.set({ "faveRecipe": { 'dinner': [item.id] } }, { merge: true })
            }
        }

    }

    onRemoveFavorite = async (item, activeChallengeUserData, title) => {
        const filteredList = this.state.favoriteList.filter(
            id => id !== item.id
        );
        this.setState({ favoriteList: filteredList })

        const id = activeChallengeUserData.id
        const uid = await AsyncStorage.getItem("uid");
        const activeChallengeUserRef = db
            .collection("users")
            .doc(uid)
            .collection("challenges")
            .doc(id)

        if (item.types.filter(name => name === title.toLowerCase())) {
            if (title.toLowerCase() === 'breakfast') {
                activeChallengeUserRef.set({ "faveRecipe": { 'breakfast': [] } }, { merge: true })
            }
            if (title.toLowerCase() === 'lunch') {
                activeChallengeUserRef.set({ "faveRecipe": { 'lunch': [] } }, { merge: true })
            }
            if (title.toLowerCase() === 'dinner') {
                activeChallengeUserRef.set({ "faveRecipe": { 'dinner': [] } }, { merge: true })
            }
        }

    }

    ifExist = async (item, activeChallengeUserData, title) => {
        let result = false

        const id = activeChallengeUserData.id
        const uid = await AsyncStorage.getItem("uid");
        const activeChallengeUserRef = db
            .collection("users")
            .doc(uid)
            .collection("challenges")
            .doc(id)

        const query = await activeChallengeUserRef.get()
        const data = query.data().faveRecipe

        if (item.types.filter(name => name === title.toLowerCase())) {
            try{
                if (title.toLowerCase() === 'breakfast') {
                    if(data.breakfast.includes(item.id)){
                        result = true
                    } else {
                        result = false
                    }
                }
            }catch(err){}

            try{
                if (title.toLowerCase() === 'lunch') {
                    if(data.lunch.includes(item.id)){
                        result = true
                    } else {
                        result = false
                    }
                }
            }catch(err){}

            try{
                if (title.toLowerCase() === 'dinner') {
                    if(data.dinner.includes(item.id)){
                        result = true
                    } else {
                        result = false
                    }
                }
            }catch(err){} 
        }

        console.log('Result: ', result)

        this.setState({
            recipeIsExist: result
        })

    }

    render() {
        const { result, item, title, activeChallengeUserData } = this.props
        const { favoriteList } = this.state
        console.log('this.state.recipeIsExist: ', this.state.recipeIsExist)
        return (
            <View
                style={styles.cardContainer}
            >
                <TouchableOpacity
                    onPress={() =>
                        this.props.navigation.push("Recipe", {
                            recipe: item,
                            backTitle: false,
                            title: title,

                        })
                    }
                >
                    <Card
                        image={{ uri: item.coverImage }}
                        containerStyle={styles.card}
                    >
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                bottom: 160,
                                left: 320
                            }}
                            onPress={() => {
                                if (this.state.recipeIsExist) {
                                    this.onRemoveFavorite(item, activeChallengeUserData, title)
                                } else {
                                    this.onFavorite(item, activeChallengeUserData, title)
                                }
                                this.ifExist(item, activeChallengeUserData, this.props.title)
                            }

                                // this.state.recipeIsExist ?
                                //     this.onRemoveFavorite(item, activeChallengeUserData, title)
                                //     :
                                //     this.onFavorite(item, activeChallengeUserData, title)
                            }

                        >
                            <Icon name={this.state.recipeIsExist ? 'heart' : 'hearto'} size={30} color={'red'} />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: -10, maxWidth: '50%' }}>
                                <Text style={{ fontFamily: fonts.bold, fontSize: 14, lineHeight: 18 }}>{item.title}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {
                                    result && result.map((tag, index) => (
                                        <View
                                            style={{
                                                height: 20,
                                                width: 20,
                                                marginRight: 4,
                                                borderWidth: 0,
                                                borderRadius: 14,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                backgroundColor: tag.color,
                                            }}
                                            key={index}
                                        >
                                            <Text style={{
                                                fontFamily: fonts.bold,
                                                fontSize: 7,
                                                color: colors.white,
                                            }}>
                                                {tag.name}
                                            </Text>
                                        </View>
                                    ))
                                }
                                <Text style={{ fontSize: 9 }}>+ more</Text>
                            </View>
                        </View>
                    </Card>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    scrollView: {
        paddingBottom: 15,
    },
    recipeTileSkeletonContainer: {
        // paddingTop: 35,
    },
    rLabel: {
        fontFamily: fonts.GothamMedium,
        fontSize: 8,
        color: colors.grey.dark,
    },
    icon: {
        marginTop: 2,
    },
    icon2: {
        marginTop: 2,
    },
    customContainerStyle: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        height: 50,
        marginVertical: hp("2%"),
        marginTop: 10,
        marginBottom: hp("2.5%"),
        paddingTop: 10,
    },
    bigTitleStyle: {
        fontSize: hp("4%"),
        fontWeight: '700',
        fontFamily: 'monospace',
        color: colors.black,
        letterSpacing: 0.5,
    },
    oblongBtnStyle: {
        alignItems: 'center',
        borderRadius: 45,
        borderWidth: 0,
        backgroundColor: colors.white,
        color: colors.black,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.48,
        shadowRadius: 11.95,
        elevation: 18,
        height: 38,
    },
    closeContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'grey',
        marginHorizontal: wp('45%'),
        marginTop: 10,
        borderRadius: 50,
        height: 5,
    },
    tagContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 2,
    },
    tagContainer1: {
        flexDirection: 'row',
    },
    cardContainer: {
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: width - 50,
        borderRadius: 3,
        overflow: 'hidden',
        borderWidth: 0,
        elevation: 0,
    },
    button: {
        alignItems: "center",
        backgroundColor: '#4d4c4c',
        padding: 10,
    }

})