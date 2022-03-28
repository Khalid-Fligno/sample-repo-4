import React from "react";
import {
    View,
    Image,
} from 'react-native';
import { IMAGE } from "../../library/images";
import authScreenStyleV2 from "../../screens/AuthStack/authScreenStyleV2";
import globalStyle from "../../styles/globalStyles";

const HeaderAuth = () => {

    return (
        <View style={authScreenStyleV2.imageContainer}>
            <Image
                source={IMAGE.BRAND_MARK}
                style={globalStyle.fitazfkIcon}
                resizeMode="contain"
            />
        </View>
    )
}

export default HeaderAuth