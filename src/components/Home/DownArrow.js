import * as React from "react"
import { heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen"
import Svg, { Path } from "react-native-svg"

function DownArrow(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={wp('6%')}
      height={hp('6%')}
      viewBox="0 0 41.376 103.78"
      {...props}
      style={{zIndex:1}}
    >
      <Path
        d="M17.188 0h6v97.09h-6V0zm19.931 79.42l4.242 4.24-20.1 20.1-4.242-4.24zm-37.1 4.24l4.242-4.24 20.105 20.1-4.244 4.24z"
        fill="#c2c2c2"
      />
    </Svg>
  )
}

export default DownArrow