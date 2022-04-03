import * as React from "react"
import Svg, { Path } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: style */

function FeedSvg(props) {
  return (
    <Svg
      id="prefix__Layer_1"
      width={15}
      height={15}
      viewBox="0 0 103 103"
      xmlSpace="preserve"
      {...props}
    >
      <Path
        className="prefix__st0"
        d={
          props.focused
            ? "M 93.7 34.4 c 2.1 5.3 3.3 11 3.3 17.1 C 97 76.6 76.6 97 51.5 97 S 6 76.6 6 51.5 S 26.4 6 51.5 6 c 9.5 0 18.3 2.9 25.6 7.9 l 4.3 -4.3 C 73 3.6 62.6 0 51.5 0 C 23.1 0 0 23.1 0 51.5 S 23.1 103 51.5 103 S 103 79.9 103 51.5 c 0 -7.7 -1.7 -15.1 -4.8 -21.6 l -4.5 4.5 z L 98 30 C 94 18 79 8 82 10 L 77 14 C 86 21 89 26 94 35 A 1 1 0 0 0 8 69 A 1 1 0 0 0 97 36"
            : "M 93.7 34.4 c 2.1 5.3 3.3 11 3.3 17.1 C 97 76.6 76.6 97 51.5 97 S 6 76.6 6 51.5 S 26.4 6 51.5 6 c 9.5 0 18.3 2.9 25.6 7.9 l 4.3 -4.3 C 73 3.6 62.6 0 51.5 0 C 23.1 0 0 23.1 0 51.5 S 23.1 103 51.5 103 S 103 79.9 103 51.5 c 0 -7.7 -1.7 -15.1 -4.8 -21.6 l -4.5 4.5 z L 98 30 C 94 18 79 8 82 10 L 77 14 C 86 21 89 26 94 35"
        }
      />
    </Svg>
  )
}

export default FeedSvg
