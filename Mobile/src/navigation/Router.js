import React, { useEffect } from 'react'
import { setTopLevelNavigator } from './RootNavigation';
import SwitchNavigator from "../navigation/stack/index";

const Router = () => {

    return (
        <SwitchNavigator
            ref={(navigatorRef) => setTopLevelNavigator(navigatorRef)}
        />
    )
}

export default Router;