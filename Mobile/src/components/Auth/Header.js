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
import PropTypes from "prop-types";

const HeaderAuth = (props) => {


    return (
        <View
            style={[globalStyle.bigHeadingTitleContainer, props.customContainerStyle]}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8
                }}>
                <Image
                    source={IMAGE.BRAND_MARK}
                    style={globalStyle.fitazfkIcon}
                    resizeMode="contain"
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    defaultHeader: {
        // ...headerContainer,
        backgroundColor: colors.themeColor.headerBackgroundColor,
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight + 1 : 0,
    },
});

HeaderAuth.propTypes = {
    customContainerStyle: PropTypes.object,
};

export default HeaderAuth