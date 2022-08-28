import React from "react";
import {
    View,
    Image,
} from 'react-native';
import { IMAGE } from "../../library/images";
import authScreenStyle from "../../screens/AuthStack/authScreenStyle";
import globalStyle from "../../styles/globalStyles";

const HeaderAuth = () => {

    return (
        <View style={authScreenStyle.imageContainer}>
            <Image
                source={IMAGE.BRAND_MARK}
                style={globalStyle.fitazfkIcon}
                resizeMode="contain"
            />
        </View>
    )
}

export default HeaderAuth