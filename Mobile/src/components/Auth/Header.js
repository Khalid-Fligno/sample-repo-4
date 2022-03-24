import React from "react";
import {
    View,
    SafeAreaView,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TextInput,
    Dimensions,
    Platform,
    StatusBar,
    Image,
} from 'react-native';
import { IMAGE } from "../../library/images";
import colors from "../../styles/colors";
import globalStyle from "../../styles/globalStyles";

const HeaderAuth = (props) => {


    return (
        <SafeAreaView style={[globalStyle.noShadow]}>
            <StatusBar barStyle="light-content" />
            <View style={[styles.defaultHeader]}>
                <View style={globalStyle.headerContentContainer}>
                    <Image
                        source={IMAGE.BRAND_MARK}
                        style={globalStyle.fitazfkIcon}
                        resizeMode="contain"
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    defaultHeader: {
        // ...headerContainer,
        backgroundColor: colors.themeColor.headerBackgroundColor,
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight + 1 : 0,
    },
});

export default HeaderAuth