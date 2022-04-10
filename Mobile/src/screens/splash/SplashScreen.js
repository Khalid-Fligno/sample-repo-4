import React, { useEffect } from 'react'
import {
    ImageBackground,
    View
} from 'react-native'
import { useDispatch } from 'react-redux'
import { OTHERSIMG } from '../../library/images/others/others'
import { init } from '../../store/auth/action'
import { splashStyles } from '../../styles/splash/splashStyles'

export const SplashScreen = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(init());
    }, []);

    return (
        <View style={splashStyles.container}>
            <ImageBackground
                source={OTHERSIMG.SPLASH_IMAGE}
                style={splashStyles.background}
            />
        </View>
    )
}