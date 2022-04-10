import { useEffect } from 'react';
import { Linking } from 'react-native'
import { NavigationActions } from 'react-navigation';

export const setTopLevelNavigator = (navigatorRef) => {
    navigator = navigatorRef;
};

export const navigate = (routeName, params) => {
    navigator.dispatch(
        NavigationActions.navigate({
            routeName,
            params,
        })
    );
};

let navigator;

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