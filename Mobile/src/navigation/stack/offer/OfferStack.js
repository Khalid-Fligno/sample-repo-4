import { createStackNavigator } from "react-navigation-stack";
import { SpecialOfferScreen } from "../../../screens/offer/SpecialOfferScreen";

const OfferStack = createStackNavigator(
  {
    Offer: SpecialOfferScreen
  },
  {
    initialRouteName: 'Offer',
    transitionConfig: () => ({
      transitionSpec: fadeSpec,
      screenInterpolator: (props) => {
        return fade(props);
      },
    }),
    defaultNavigationOptions: {
      header: null,
    },
  },
)

export default OfferStack;