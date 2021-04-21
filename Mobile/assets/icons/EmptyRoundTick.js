import * as React from "react"
import Svg, { Defs, G, Circle, Use } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function EmptyRoundTick(props) {
  return (
    <Svg width={50} height={40} viewBox="0 0 106 105.56" {...props}>
      <Defs></Defs>
      <G fill="#6d4bce" filter="url(#prefix__a)">
        <Circle
          id="prefix__b"
          data-name="Ellipse 577 copy 4"
          cx={53}
          cy={52.78}
          r={51}
          stroke="grey"
          filter="none"
          fill="transparent"
          strokeLinejoin="round"
          strokeOpacity={0.52}
          strokeWidth={4}
        />
      </G>
      <Use xlinkHref="#prefix__b" stroke="#787878" filter="none" fill="none" />
    </Svg>
  )
}

export default EmptyRoundTick
