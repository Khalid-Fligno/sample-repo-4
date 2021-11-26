import React from "react";
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Dimensions,
    SafeAreaView,
    Text,
    Platform
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

export default class PhaseModal extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {

        return (
            <SafeAreaView style={{ backgroundColor: 'white', paddingHorizontal: 20 }}>
                <View style={{paddingLeft: Platform.OS === 'ios' ? 10 : 0, paddingRight: Platform.OS === 'ios' ? 10 : 0}}>
                    <TouchableOpacity
                        style={styles.closeContainer}
                        onPress={this.props.headerButton}
                    >
                        <View>
                            <Text></Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}
                        onPress={this.props.backButton}
                    >
                        <Icon name='chevron-left' size={13} color={colors.black} style={{ marginRight: 10 }} />
                        <Text style={{ fontSize: 15 }}>Back</Text>
                    </TouchableOpacity>
                    <Text style={{ fontFamily: fonts.bold, marginBottom: 20, marginVertical: 20, fontWeight: 'bold', fontSize: 20 }}>Select Phase</Text>
                    <View style={styles.tagContainer}>
                        <Text style={{ marginBottom: 10, fontSize: 15 }}>Phase 1</Text>
                        <CheckBox
                            boxType='square'
                            value={this.props.phase1}
                            onValueChange={this.props.togglePhase1}
                        />
                    </View>
                    <View style={styles.tagContainer}>
                        <Text style={{ marginBottom: 10, fontSize: 15 }}>Phase 2</Text>
                        <CheckBox
                            boxType='square'
                            value={this.props.phase2}
                            onValueChange={this.props.togglePhase2}
                        />
                    </View>
                    <View style={styles.tagContainer}>
                        <Text style={{ marginBottom: 10, fontSize: 15 }}>Phase 3</Text>
                        <CheckBox
                            boxType='square'
                            value={this.props.phase3}
                            onValueChange={this.props.togglePhase3}
                        />
                    </View>
                    <View style={{ marginVertical: 20 }}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={this.props.applyButton}
                        >
                            <Text style={{ color: 'white',padding: 5 , fontSize: 15}}>Apply</Text>
                        </TouchableOpacity>
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