import * as Font from "expo-font";

export const fontAssets = () => {
    const cacheFonts = [
        {
            GothamBold: require("../../assets/fonts/gotham-bold.otf"),
        },
        {
            GothamNarrowBold: require("../../assets/fonts/gotham-narrow-bold.otf"),
        },
        {
            GothamBook: require("../../assets/fonts/gotham-book.otf"),
        },
        {
            GothamBookItalic: require("../../assets/fonts/gotham-book-italic.otf"),
        },
        {
            GothamNarrowBook: require("../../assets/fonts/gotham-narrow-book.otf"),
        },
        {
            GothamUltraItalic: require("../../assets/fonts/gotham-ultra-italic.otf"),
        },
        {
            TuesdayNight: require("../../assets/fonts/tuesday-night.otf"),
        },
        {
            GothamLight: require("../../assets/fonts/Gotham-Light.otf"),
        },
        {
            GothamThin: require("../../assets/fonts/Gotham-Thin.otf"),
        },
        {
            GothamThinItalic: require("../../assets/fonts/Gotham-ThinItalic.otf"),
        },
        {
            GothamBookItalic: require("../../assets/fonts/Gotham-BookItalic.otf"),
        },
        {
            GothamMedium: require("../../assets/fonts/Gotham-Medium.otf"),
        },
        {
            SimplonMonoLight: require("../../assets/fonts/SimplonMono-Light.otf"),
        },
        {
            SimplonMonoMedium: require("../../assets/fonts/SimplonMono-Medium-Regular.otf"),
        },
        {
            StyreneAWebRegular: require("../../assets/fonts/StyreneAWeb-Regular.ttf"),
        },
        {
            StyreneAWebThin: require("../../assets/fonts/StyreneAWeb-Thin.ttf"),
        },
        {
            icomoon: require("../../assets/fonts/icomoon.ttf"),
        },
    ]

    return cacheFonts.map((font) => {
        return Font.loadAsync(font);
    });
}