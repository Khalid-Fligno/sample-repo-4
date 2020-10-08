import * as React from "react"
import Svg, { Path } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: style */

function SubSVG(props) {
  return (
    <Svg
      id="prefix__Layer_1"
      height = {15}
      width = {15}
      viewBox="0 0 103 103"
      xmlSpace="preserve"
      {...props}
    >
      <Path
        className="prefix__st0"
        d="M93.7 34.4c2.1 5.3 3.3 11 3.3 17.1C97 76.6 76.6 97 51.5 97S6 76.6 6 51.5 26.4 6 51.5 6c9.5 0 18.3 2.9 25.6 7.9l4.3-4.3C73 3.6 62.6 0 51.5 0 23.1 0 0 23.1 0 51.5S23.1 103 51.5 103 103 79.9 103 51.5c0-7.7-1.7-15.1-4.8-21.6l-4.5 4.5z"
      />
      <Path
        className="prefix__st0"
        d="M93.5 20.8l-4.7-4.7-46.9 47.3-14.7-14.7-4.7 4.7 19.3 19.4 4.6-4.6v.1z"
      />
    </Svg>
  )
}

export default SubSVG
