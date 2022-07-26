
import React from 'react';
import { createStackNavigator } from 'react-navigation-stack'
import SubscriptionScreen from "../../src/screens/OnboardingStack/SubscriptionScreen";
import Header from '../../src/components/Shared/Header';

const SusbcriptionStack = createStackNavigator(
{  Subscription: SubscriptionScreen },
{     
    defaultNavigationOptions: ({ navigation }) => ({
    gesturesEnabled: true,
        // headerMode: 'none'
    header: () => {
        return (
        <Header
            stack="SusbcriptionStack"
            navigation={navigation}
            withCancelButton={true}
        />
        )
    },
    }),
})

export default SusbcriptionStack
