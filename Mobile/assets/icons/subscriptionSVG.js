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
      {/*<Path*/}
      {/*  className="prefix__st0"*/}
      {/*  d="M93.7 34.4c2.1 5.3 3.3 11 3.3 17.1C97 76.6 76.6 97 51.5 97S6 76.6 6 51.5 26.4 6 51.5 6c9.5 0 18.3 2.9 25.6 7.9l4.3-4.3C73 3.6 62.6 0 51.5 0 23.1 0 0 23.1 0 51.5S23.1 103 51.5 103 103 79.9 103 51.5c0-7.7-1.7-15.1-4.8-21.6l-4.5 4.5z"*/}
      {/*/>*/}
      {/*<Path*/}
      {/*  className="prefix__st0"*/}
      {/*  d="M93.5 20.8l-4.7-4.7-46.9 47.3-14.7-14.7-4.7 4.7 19.3 19.4 4.6-4.6v.1z"*/}
      {/*/>*/}
      <Path
          className="prefix__st0"
          // d="M14.2 0h-1.5C5.7 0 0 5.7 0 12.8c0 7 5.7 12.8 12.8 12.8h1.5c7 0 12.8-5.7 12.8-12.8C27 5.7 21.3 0 14.2 0zM14.2 51.9h-1.5C5.7 51.9 0 57.6 0 64.7c0 7 5.7 12.8 12.8 12.8h1.5c7 0 12.8-5.7 12.8-12.8-.1-7.1-5.8-12.8-12.9-12.8zM14.2 103.9h-1.1c-6.3 0-12 4.4-12.9 10.7-1.3 8 4.9 14.8 12.6 14.8h1.1c6.3 0 12-4.4 12.9-10.7 1.3-8-4.8-14.8-12.6-14.8zM91.6 8.2H42.7v8.1h48.9V8.2zM155.2 8.2h-51.9v8.1h51.9V8.2zM166 8.2v8.1h19.6V8.2H166zM136.7 120.9h48.9v-8.1h-48.9v8.1zM73.2 120.9H125v-8.1H73.2v8.1zM42.7 120.9h19.7v-8.1H42.7v8.1zM136.7 69.4h48.9v-8.1h-48.9v8.1zM76.2 69.4H125v-8.1H76.2v8.1zM42.7 69.4h22.7v-8.1H42.7v8.1z"
          d={
            props.focused
                ? "M 93.7 34.4 c 2.1 5.3 3.3 11 3.3 17.1 C 97 76.6 76.6 97 51.5 97 S 6 76.6 6 51.5 S 26.4 6 51.5 6 c 9.5 0 18.3 2.9 25.6 7.9 l 4.3 -4.3 C 73 3.6 62.6 0 51.5 0 C 23.1 0 0 23.1 0 51.5 S 23.1 103 51.5 103 S 103 79.9 103 51.5 c 0 -7.7 -1.7 -15.1 -4.8 -21.6 l -4.5 4.5 z L 98 30 C 94 18 79 8 82 10 L 77 14 C 86 21 89 26 94 35 A 1 1 0 0 0 8 69 A 1 1 0 0 0 97 36"
                : "M 93.7 34.4 c 2.1 5.3 3.3 11 3.3 17.1 C 97 76.6 76.6 97 51.5 97 S 6 76.6 6 51.5 S 26.4 6 51.5 6 c 9.5 0 18.3 2.9 25.6 7.9 l 4.3 -4.3 C 73 3.6 62.6 0 51.5 0 C 23.1 0 0 23.1 0 51.5 S 23.1 103 51.5 103 S 103 79.9 103 51.5 c 0 -7.7 -1.7 -15.1 -4.8 -21.6 l -4.5 4.5 z L 98 30 C 94 18 79 8 82 10 L 77 14 C 86 21 89 26 94 35"
          }
      />
    </Svg>
  )
}

export default SubSVG
