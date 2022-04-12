import { Asset } from "expo-asset";
import { OTHERSIMG } from "./others/others";
import { HOMESCREENTILESIMG } from "./homeScreenTiles/homeScreenTiles";
import { SPLITIMG } from "./splitImages/splitImages";

export const imageAssets = () => {
    const cacheImages = [
        require("../../assets/icons/fitazfk-app-icon-gradient-dark.png"),
        require("../../assets/icons/fitazfk-splash-dark-logo.png"),
        require("../../assets/icons/fitazfk-icon-outline-white.png"),
        require("../../assets/icons/fitazfk-logo-outline-white.png"),
        require("../../assets/icons/apple-music-icon.png"),
        require("../../assets/icons/apple-icon-black.png"),
        require("../../assets/icons/spotify-icon.png"),
        require("../../assets/icons/facebook-icon-white.png"),
        OTHERSIMG.APPONBOARDINGCAROUSEL1,
        OTHERSIMG.APPONBOARDINGCAROUSEL2,
        OTHERSIMG.APPONBOARDINGCAROUSEL3,
        OTHERSIMG.APPONBOARDINGCAROUSEL4,
        OTHERSIMG.APPONBOARDINGCAROUSEL5,
        OTHERSIMG.SIGNUPSCREENBACKGROUND,
        OTHERSIMG.SUBSCRIPTIONSCREENBACKGROUND,
        OTHERSIMG.SPECIALOFFERSCREENBACKGROUND,
        HOMESCREENTILESIMG.HOMESCREENBLOG,
        HOMESCREENTILESIMG.HOMESCREENSHOPAPPARELJUMPER,
        OTHERSIMG.BLOGHEADER,
        OTHERSIMG.SHOPBUNDLES,
        OTHERSIMG.FITAZFKARMY,
        OTHERSIMG.NUTRITIONBREAKFAST,
        OTHERSIMG.NUTRITIONLUNCH,
        OTHERSIMG.NUTRITIONDINNER,
        OTHERSIMG.NUTRITIONSNACK,
        OTHERSIMG.RECIPETILESKELETON,
        OTHERSIMG.WORKOUTSGYM,
        OTHERSIMG.WORKOUTSGYMABT,
        OTHERSIMG.WORKOUTSGYMFULL,
        OTHERSIMG.WORKOUTSGYMUPPER,
        OTHERSIMG.WORKOUTSHIIT,
        OTHERSIMG.WORKOUTSHIITAIRDYNE,
        OTHERSIMG.WORKOUTSHIITROWING,
        OTHERSIMG.WORKOUTSHIITRUNNING,
        OTHERSIMG.WORKOUTSHIITSKIPPING,
        OTHERSIMG.WORKOUTSHOME,
        OTHERSIMG.WORKOUTSHOMEABT,
        OTHERSIMG.WORKOUTSHOMEFULL,
        OTHERSIMG.WORKOUTSHOMEUPPER,
        OTHERSIMG.WORKOUTSOUTDOORS,
        OTHERSIMG.WORKOUTSOUTDOORSABT,
        OTHERSIMG.WORKOUTSOUTDOORSFULL,
        OTHERSIMG.WORKOUTSHOMEUPPER,
        OTHERSIMG.WORKOUTSRESISTANCE,
        OTHERSIMG.HIITRESTPLAEHOLDER,
        OTHERSIMG.PROFILEADD,
        SPLITIMG.NINA_1,
        SPLITIMG.NINA_2,
        SPLITIMG.NINA_3,
        SPLITIMG.NINA_4,
        SPLITIMG.SHARNIE_1,
        SPLITIMG.SHARNIE_2,
        SPLITIMG.SHARNIE_3,
        SPLITIMG.SHARNIE_4,
        SPLITIMG.ELLE_1,
        SPLITIMG.ELLE_2,
        SPLITIMG.ELLE_3,
        SPLITIMG.ELLE_4,
    ]

    return cacheImages.map((image) => {
        return Asset.fromModule(image).downloadAsync();
    });
} 