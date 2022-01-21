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

const { width } = Dimensions.get("window");

export default class FilterScreen extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {

        const { result, item, title } = this.props

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