import React, { useEffect } from 'react'
import { Linking } from 'react-native';
import SwitchNavigator from "../navigation/stack/index";
import { NavigationActions } from 'react-navigation';

let navigator;

export const navigate = (routeName, params) => {
    navigator.dispatch(
        NavigationActions.navigate({
            routeName,
            params,
        })
    );
};

const Router = () => {

    const setTopLevelNavigator = (navigatorRef) => {
        navigator = navigatorRef;
    };

    const handleOpenURL = (event) => {
        if (event.url === "fitazfk://special-offer") {
            navigate("SpecialOffer");
        }
    };

    useEffect(() => {
        const linkinListener = Linking
            .addEventListener("url", handleOpenURL);

        return () => {
            if (linkinListener) {
                linkinListener.remove();
            }
        };
    })

    return (
        <SwitchNavigator
            ref={(navigatorRef) => setTopLevelNavigator(navigatorRef)}
        />
    )
}

export default Router;