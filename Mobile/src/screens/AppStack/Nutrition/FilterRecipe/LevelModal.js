import React from "react";
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Dimensions,
    SafeAreaView,
    Text,
    Platform,
} from "react-native";
import CheckBox from '@react-native-community/checkbox';
import colors from "../../../../styles/colors";
import fonts from '../../../../styles/fonts';
import Icon from "../../../../components/Shared/Icon";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const { width } = Dimensions.get("window");

export default class LevelModal extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <SafeAreaView style={{ backgroundColor: 'white', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
                <View style={{ paddingLeft: 10 }}>
                    <TouchableOpacity
                        onPress={this.props.closeModal}
                    >
                        <View style={{ height: 50 }}>
                            <View style={styles.closeContainer}>

                            </View>
                        </View>

                    </TouchableOpacity>
                    <View style={{ marginTop: 10, marginRight: 10, }}>
                        <Text style={{ fontFamily: fonts.bold, marginBottom: 20, marginTop: 10, fontWeight: 'bold', fontSize: 20 }}>Filter recipes to</Text>

                        <TouchableOpacity onPress={this.props.toggleVegan} value={this.props.veganChecked}>
                            <View style={styles.tagContainer}>
                                <View style={styles.tagContainer1}>
                                    <View style={{
                                        height: 25,
                                        width: 25,
                                        marginRight: 10,
                                        borderWidth: 0,
                                        borderRadius: 14,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: '#00C520',
                                    }}>
                                        <Text style={{
                                            fontFamily: fonts.bold,
                                            fontSize: 9,
                                            color: colors.white,
                                        }}>
                                            V
                                        </Text>
                                    </View>
                                    <Text style={{ marginTop: 3, fontSize: 15 }}>Vegan</Text>
                                </View>
                                {Platform.OS == 'ios' ?
                                    (<CheckBox
                                        boxType='square'
                                        value={this.props.veganChecked}
                                    />
                                    ) : (
                                        <CheckBox
                                            boxType='square'
                                            value={this.props.veganChecked}
                                            onValueChange={this.props.toggleVegan}
                                        />
                                    )}

                            </View>
                        </TouchableOpacity>
                        <View>

                        </View>
                        <TouchableOpacity onPress={this.props.toggleVegetarian} value={this.props.vegetarianChecked}>
                            <View style={styles.tagContainer}>
                                <View style={styles.tagContainer1}>
                                    <View style={{
                                        height: 25,
                                        width: 25,
                                        marginRight: 10,
                                        borderWidth: 0,
                                        borderRadius: 14,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: '#469753',
                                    }}>
                                        <Text style={{
                                            fontFamily: fonts.bold,
                                            fontSize: 9,
                                            color: colors.white,
                                        }}>
                                            VEG
                                        </Text>
                                    </View>
                                    <Text style={{ marginTop: 3, fontSize: 15 }}>Vegetarian</Text>
                                </View>
                                {Platform.OS == 'ios' ?
                                    (<CheckBox
                                        boxType='square'
                                        value={this.props.vegetarianChecked}
                                    />
                                    ) : (
                                        <CheckBox
                                            boxType='square'
                                            value={this.props.vegetarianChecked}
                                            onValueChange={this.props.toggleVegetarian}
                                        />
                                    )}

                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.props.toggleGlutaFree} value={this.props.glutaFreeChecked}>
                            <View style={styles.tagContainer}>
                                <View style={styles.tagContainer1}>
                                    <View style={{
                                        height: 25,
                                        width: 25,
                                        marginRight: 10,
                                        borderWidth: 0,
                                        borderRadius: 14,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: '#9403fc',
                                    }}>
                                        <Text style={{
                                            fontFamily: fonts.bold,
                                            fontSize: 9,
                                            color: colors.white,
                                        }}>
                                            GF
                                        </Text>
                                    </View>
                                    <Text style={{ marginTop: 3, fontSize: 15 }}>Gluta-Free</Text>
                                </View>
                                {Platform.OS == 'ios' ?
                                    (<CheckBox
                                        boxType='square'
                                        value={this.props.glutaFreeChecked}
                                    />
                                    ) : (
                                        <CheckBox
                                            boxType='square'
                                            value={this.props.glutaFreeChecked}
                                            onChange={this.props.toggleGlutaFree}
                                        />
                                    )}

                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.props.toggleDairyFree} value={this.props.dairyFreeChecked}>
                            <View style={styles.tagContainer}>
                                <View style={styles.tagContainer1}>
                                    <View style={{
                                        height: 25,
                                        width: 25,
                                        marginRight: 10,
                                        borderWidth: 0,
                                        borderRadius: 14,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: '#B7782B',
                                    }}>
                                        <Text style={{
                                            fontFamily: fonts.bold,
                                            fontSize: 9,
                                            color: colors.white,
                                        }}>
                                            DF
                                        </Text>
                                    </View>
                                    <Text style={{ marginTop: 3, fontSize: 15 }}>Dairy-Free</Text>
                                </View>
                                {Platform.OS == 'ios' ?
                                    (<CheckBox
                                        boxType='square'
                                        value={this.props.dairyFreeChecked}
                                    />
                                    ) : (
                                        <CheckBox
                                            boxType='square'
                                            value={this.props.dairyFreeChecked}
                                            onValueChange={this.props.toggleDairyFree}
                                        />
                                    )}

                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.props.toggleGutHealth} value={this.props.gutHealthChecked}>
                            <View style={styles.tagContainer}>
                                <View style={styles.tagContainer1}>
                                    <View style={{
                                        height: 25,
                                        width: 25,
                                        marginRight: 10,
                                        borderWidth: 0,
                                        borderRadius: 14,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: '#965734',
                                    }}>
                                        <Text style={{
                                            fontFamily: fonts.bold,
                                            fontSize: 9,
                                            color: colors.white,
                                        }}>
                                            GH
                                        </Text>
                                    </View>
                                    <Text style={{ marginTop: 3, fontSize: 15 }}>Gut Health</Text>
                                </View>
                                {Platform.OS == 'ios' ?
                                    (<CheckBox
                                        boxType='square'
                                        value={this.props.gutHealthChecked}
                                    />
                                    ) : (
                                        <CheckBox
                                            boxType='square'
                                            value={this.props.gutHealthChecked}
                                            onValueChange={this.props.toggleGutHealth}
                                        />
                                    )}

                            </View>
                        </TouchableOpacity>
                        <Text style={{ fontFamily: fonts.bold, marginBottom: 20, marginVertical: 30, fontWeight: 'bold', fontSize: 20 }}>Select Level</Text>
                        <TouchableOpacity
                            onPress={this.props.onPressLevel1}
                        // onPress={() => console.log('levelBUttonData: ', challengeRecipeData.level1)}
                        >

                            <View style={styles.tagContainer}>
                                <Text style={{ marginBottom: 10, fontSize: 15 }}>Level 1</Text>
                                <Icon name="chevron-right" size={12} color={colors.black} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.props.onPressLevel2}
                        >

                            <View style={styles.tagContainer}>
                                <Text style={{ marginBottom: 10, fontSize: 15 }}>Level 2</Text>
                                <Icon name="chevron-right" size={12} color={colors.black} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.props.onPressLevel3}
                        >

                            <View style={styles.tagContainer}>
                                <Text style={{ marginBottom: 10, fontSize: 15 }}>Level 3</Text>
                                <Icon name="chevron-right" size={12} color={colors.black} />
                            </View>
                        </TouchableOpacity>

                        <View style={{ marginVertical: 20 }, !this.props.phase3 && !this.props.phase2 && !this.props.phase1 ? {opacity: 0.7} : null}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={this.props.applyButton}
                                disabled={true ? !this.props.phase3 && !this.props.phase2 && !this.props.phase1 : true}
                            >
                                <Text style={{ color: 'white', padding: 5, fontSize: 15 }}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
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
        marginBottom: 10,
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
        borderRadius: 10,
        height: 50,

    }

})