import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import Header from '../../../components/Shared/Header';
import { TabScreen } from "../../../screens/tab/index";
import { EditMeasurement } from '../../../screens/tab/you/userProgressEdit/editMeasurement/EditMeasurement';
import UserProgressEditScreen from "../../../screens/tab/you/userProgressEdit/UserProgressEditScreen";

const progressBackButtonMap = {
  ProgressHome: false,
  ProgressEdit: true,
  Progress1: true
};

const ProgressStack = createStackNavigator(
  {
    ProgressHome: TabScreen.YouScreen,
    ProgressEdit: UserProgressEditScreen,
    Progress1: EditMeasurement,
  },
  {
    initialRouteName: 'ProgressHome',
    defaultNavigationOptions: ({ navigation }) => ({
      header: () => {
        const { routeName } = navigation.state;
        
        return (
          <Header
            navigation={navigation}
            withBackButton={progressBackButtonMap[routeName]}
            stack="progress"
            withProfileButton={routeName === 'ProgressHome'}
          />
        );
      },
    }),
  },
);

export default ProgressStack;
