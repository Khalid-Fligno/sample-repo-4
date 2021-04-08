import * as React from "react"
import Svg, { Path } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: style */

function ProgressSvg(props) {
  return (
    <Svg
      id="prefix__Fitness_icons"
      height={15}
      width={15}
      viewBox="0 0 71.7 65.6"
      xmlSpace="preserve"
      {...props}
    >
      <Path
        className="prefix__st0"
        d="M70.2 65.6H1.5c-.8 0-1.5-.7-1.5-1.5V1.5C0 .7.7 0 1.5 0S3 .7 3 1.5v61.1h67.2c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5z"
      />
      <Path
        className="prefix__st0"
        d="M40.4 46.5c-.6 0-1.1-.3-1.4-.9l-8.4-19-6 10.7c-.3.5-.8.8-1.3.8h-7.6c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5h6.7l7.1-12.6c.3-.5.8-.8 1.4-.8.6 0 1.1.4 1.3.9l8 18.1L49 13.3c.2-.6.8-1 1.4-1 .7 0 1.2.4 1.4 1l7.9 21.8H67c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5h-8.4c-.6 0-1.2-.4-1.4-1l-6.7-18.7-8.6 27c-.2.6-.8 1-1.5 1.1.1 0 0 0 0 0z"
      />
    </Svg>
  )
}

export default ProgressSvg
