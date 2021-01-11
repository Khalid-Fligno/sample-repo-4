import * as React from "react"
import { widthPercentageToDP } from "react-native-responsive-screen"
import Svg, { Image } from "react-native-svg"

function DoubleRightArrow(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={19}
      height={20}
      viewBox="0 0 19 20"
      {...props}
    >
      <Image
        data-name="Rounded Rectangle 3 copy 28"
        width={props.width}
        height={props.height}
        xlinkHref="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAUCAYAAABvVQZ0AAABS0lEQVQ4jZXUr0tdYRzH8ZcODIK4YvJvMFiWLP4ADQOZhhkMBrdiMAkXBGF1YWbBmXQgoiyMibBotRhc2BjCRIMoWBQE2Xjwy+Wc67n3uX7SF96f7/twDs95Omq12ifM4x22PU2O19OJUfRgC9MVnRwvyRZwixf4gtcNnRwvyQ4xiTt0YRfjhU6Ol2QpP+IV7mNhD8OFXo6XZCn7eBsL3fiGoWfwkizlK2bxUFh41S5vlKXsYC4WenGAwXZ4lSxlE+/xDy9jYSDHm8lSNuJYpPRVHNgnvJUspb8wX+d4K9kKlmP+iTc53ky2hA8x/8YYLnO8SraIjzGfYgTn7fBGWboZVmM+i5/8b7u8KEtnZw0duIgn/nkGr8tmsB7Fy/gGvwq9HK/LpuIQpivmKoonhU6Ol2Sfo3gTV8txQyfHS7Lv8REncFTRyfHH4D9Whmlg3bBTJwAAAABJRU5ErkJggg=="
      />
    </Svg>
  )
}

export default DoubleRightArrow
