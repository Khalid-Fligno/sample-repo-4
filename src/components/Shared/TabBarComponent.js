import React from 'react';
import { BottomTabBar } from "react-navigation-tabs"
import { 
    View,
    TouchableWithoutFeedback, 
    StyleSheet,
    Dimensions
} from "react-native"
var { height,width } = Dimensions.get("window")

const HiddenView = () => <View style={{ display: 'none' }} />
const TouchableWithoutFeedbackWrapper = ({
  onPress,
  onLongPress,
  testID,
  accessibilityLabel,
  ...props
}) => {
  return (
      <TouchableWithoutFeedback
          onPress={onPress}
          onLongPress={onLongPress}
          testID={testID}
          hitSlop={{
              left: 15,
              right: 15,
              top: 5,
              bottom: 5,
          }}
          accessibilityLabel={accessibilityLabel}
      >
          <View {...props} />
      </TouchableWithoutFeedback>
  )
}
const TabBarComponent = props => {
  return <BottomTabBar
      {...props}
      style={styles.bottomBarStyle}
      getButtonComponent={({ route }) => {
          if (route.key === "Dashboard" )
              return HiddenView
          else return TouchableWithoutFeedbackWrapper
      }}
  />
}

export default TabBarComponent


const styles = StyleSheet.create({
    bottomBarStyle: {
        // height: (height * 10.625) / 100   //your header height (10.625 is the %)
        height: (width) / 7   //your header height (10.625 is the %)
    }
  })