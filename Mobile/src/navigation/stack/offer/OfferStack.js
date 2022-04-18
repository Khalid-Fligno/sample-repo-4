import { createStackNavigator } from "react-navigation-stack";
import { OfferScreen } from "../../../screens/offer";

const OfferStack = createStackNavigator(
  {
    Offer: OfferScreen.SpecialOfferScreen
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