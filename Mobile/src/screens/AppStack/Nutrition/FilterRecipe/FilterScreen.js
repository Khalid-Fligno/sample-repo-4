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
            recipeIsExist: false
        }
    }

    componentDidMount = () => {
        this.ifExist(this.props.item, this.props.activeChallengeUserData, this.props.title)
    }

    onFavorite = async (item, activeChallengeUserData, title, currentChallengeDay) => {

        const recipeMeal = activeChallengeUserData.faveRecipe

        const favoriteClone = [...recipeMeal]
        const datasss = favoriteClone[currentChallengeDay - 1].recipeMeal.breakfast
        console.log('recipeMeal: ', recipeMeal)


        const id = activeChallengeUserData.id
        const uid = await AsyncStorage.getItem("uid");
        const activeChallengeUserRef = db
            .collection("users")
            .doc(uid)
            .collection("challenges")
            .doc(id)

        if (item.types.filter(name => name === title.toLowerCase())) {
            if (title.toLowerCase() === 'breakfast') {
                // recipeMeal.forEach(res => {
                //     activeChallengeUserRef.set({ "faveRecipe": [{ "day": currentChallengeDay, "recipeMeal": [{ 'breakfast': item.id }] }] }, { merge: true })
                // })
                activeChallengeUserRef.update({
                    ...recipeMeal,
                    faveRecipe: [favoriteClone]
                 })
            }
            if (title.toLowerCase() === 'lunch') {
                recipeMeal.forEach(res => {
                    activeChallengeUserRef.set({ "faveRecipe": [{ "day": currentChallengeDay, "recipeMeal": { 'lunch': item.id } }] }, { merge: true })
                })            }
            if (title.toLowerCase() === 'dinner') {
                recipeMeal.forEach(res => {
                    activeChallengeUserRef.set({ "faveRecipe": [{ "day": currentChallengeDay, "recipeMeal": { 'dinner': item.id } }] }, { merge: true })
                })            }
        }

    }

    onRemoveFavorite = async (item, activeChallengeUserData, title, currentChallengeDay) => {

        const recipeMeal = activeChallengeUserData.faveRecipe

        const id = activeChallengeUserData.id
        const uid = await AsyncStorage.getItem("uid");
        const activeChallengeUserRef = db
            .collection("users")
            .doc(uid)
            .collection("challenges")
            .doc(id)

        if (item.types.filter(name => name === title.toLowerCase())) {
            if (title.toLowerCase() === 'breakfast') {
                recipeMeal.forEach(res => {
                    activeChallengeUserRef.update({
                        faveRecipe: [{
                            day: currentChallengeDay,
                            recipeMeal: [
                            {
                                breakfast: ''
                            }]
                        }
                        ]
                    })
                })
            }
            if (title.toLowerCase() === 'lunch') {
                recipeMeal.forEach(res => {
                    activeChallengeUserRef.update({
                        faveRecipe: [{
                            day: currentChallengeDay,
                            recipeMeal: [...res.recipeMeal,
                            {
                                lunch: ''
                            }]
                        }
                        ]
                    })
                })
            }
            if (title.toLowerCase() === 'dinner') {
                recipeMeal.forEach(res => {
                    activeChallengeUserRef.update({
                        faveRecipe: [{
                            day: currentChallengeDay,
                            recipeMeal: [...res.recipeMeal,
                            {
                                dinner: ''
                            }]
                        }
                        ]
                    })
                })
            }
        }

    }

    ifExist = async (item, activeChallengeUserData, title) => {
        let result = false
        let resultItem = []

        const id = activeChallengeUserData.id
        const uid = await AsyncStorage.getItem("uid");
        const activeChallengeUserRef = db
            .collection("users")
            .doc(uid)
            .collection("challenges")
            .doc(id)

        const query = await activeChallengeUserRef.get()
        const data = query.data().faveRecipe

        data.forEach(res => {
            try {
                if (item.types.filter(name => name === title.toLowerCase())) {
                    try {
                        if (title.toLowerCase() === 'breakfast') {
                            // res.recipeMeal.forEach(meal => {
                            //     if (meal.breakfast === item.id) {
                            //         result = true
                            //     } else {
                            //         result = false
                            //     }
                            // })
                            if (res.recipeMeal.breakfast === item.id) {
                                result = true
                            } else {
                                result = false
                            }
                        }
                    } catch (err) { }
    
                    try {
                        if (title.toLowerCase() === 'lunch') {
                            // res.recipeMeal.forEach(meal => {
                            //     if (meal.lunch === item.id) {
                            //         result = true
                            //     } else {
                            //         result = false
                            //     }
                            // })
                            if (res.recipeMeal.lunch === item.id) {
                                result = true
                            } else {
                                result = false
                            }
                        }
                    } catch (err) { }
    
                    try {
                        if (title.toLowerCase() === 'dinner') {
                            // res.recipeMeal.forEach(meal => {
                            //     if (meal.dinner === item.id) {
                            //         result = true
                            //     } else {
                            //         result = false
                            //     }
                            // })
                            if (res.recipeMeal.dinner === item.id) {
                                result = true
                            } else {
                                result = false
                            }
                        }
                    } catch (err) { }
                }
            } catch (err) {
    
            }
        })
        

        this.setState({
            recipeIsExist: result
        })

    }

    render() {
        const { result, item, title, activeChallengeUserData, currentChallengeDay } = this.props
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
                                    this.onRemoveFavorite(item, activeChallengeUserData, title, currentChallengeDay)
                                } else {
                                    this.onFavorite(item, activeChallengeUserData, title, currentChallengeDay)
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