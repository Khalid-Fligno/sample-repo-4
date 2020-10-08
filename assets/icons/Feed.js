import * as React from "react"
import Svg, { Path } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: style */

function FeedSvg(props) {
  return (
    <Svg
      id="prefix__Layer_1"
      width={15}
      height={15}
      viewBox="0 0 185.6 129.4"
      xmlSpace="preserve"
      {...props}
    >
      <Path
        className="prefix__st0"
        d="M14.2 0h-1.5C5.7 0 0 5.7 0 12.8c0 7 5.7 12.8 12.8 12.8h1.5c7 0 12.8-5.7 12.8-12.8C27 5.7 21.3 0 14.2 0zM14.2 51.9h-1.5C5.7 51.9 0 57.6 0 64.7c0 7 5.7 12.8 12.8 12.8h1.5c7 0 12.8-5.7 12.8-12.8-.1-7.1-5.8-12.8-12.9-12.8zM14.2 103.9h-1.1c-6.3 0-12 4.4-12.9 10.7-1.3 8 4.9 14.8 12.6 14.8h1.1c6.3 0 12-4.4 12.9-10.7 1.3-8-4.8-14.8-12.6-14.8zM91.6 8.2H42.7v8.1h48.9V8.2zM155.2 8.2h-51.9v8.1h51.9V8.2zM166 8.2v8.1h19.6V8.2H166zM136.7 120.9h48.9v-8.1h-48.9v8.1zM73.2 120.9H125v-8.1H73.2v8.1zM42.7 120.9h19.7v-8.1H42.7v8.1zM136.7 69.4h48.9v-8.1h-48.9v8.1zM76.2 69.4H125v-8.1H76.2v8.1zM42.7 69.4h22.7v-8.1H42.7v8.1z"
      />
    </Svg>
  )
}

export default FeedSvg
