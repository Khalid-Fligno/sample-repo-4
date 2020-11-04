import * as React from "react"
import Svg, { Path } from "react-native-svg"

function TickSvg(props) {
  return (
    <Svg width={17} height={18} viewBox="0 0 24.5 19.312" {...props}>
      <Path
        data-name="Rounded Rectangle 3 copy 13"
        d="M23.86 3.728L8.89 18.65a2.184 2.184 0 01-3.09-3.087L20.76.641a2.187 2.187 0 113.1 3.087zm-20.2 6.7l4.7 4.658a2.147 2.147 0 01-3.04 3.032l-4.7-4.657a2.148 2.148 0 113.04-3.035z"
        fill="#f14c44"
        // fillRule="evenodd"
      />
    </Svg>
  )
}

export default TickSvg
