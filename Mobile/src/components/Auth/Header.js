import React from "react";
import {
    View,
    Image,
} from 'react-native';
import globalStyle from "../../styles/globalStyles";

const HeaderAuth = () => {

    return (
        <View style={{
            alignItems: "center",
            padding: 10
        }}>
            <Image
                source={require("../../assets/icons/FITAZ_BrandMark.png")}
                style={globalStyle.fitazfkIcon}
                resizeMode="contain"
            />
        </View>
    )
}

export default HeaderAuth