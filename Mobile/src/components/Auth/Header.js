import React from "react";
import {
    View,
    Image,
} from 'react-native';
import authScreenStyle from "../../screens/AuthStack/authScreenStyle";
import globalStyle from "../../styles/globalStyles";

const HeaderAuth = () => {

    return (
        <View style={authScreenStyle.imageContainer}>
            <Image
                source={require("../../assets/icons/FITAZ_BrandMark.png")}
                style={globalStyle.fitazfkIcon}
                resizeMode="contain"
            />
        </View>
    )
}

export default HeaderAuth