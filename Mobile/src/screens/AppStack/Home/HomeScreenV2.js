import React from "react";
import {
    View,
    ScrollView,
    Text,
    Dimensions,
    StyleSheet,
    ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import Loader from "../../../components/Shared/Loader";
import { db } from "../../../../config/firebase";
import colors from "../../../styles/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import globalStyle from "../../../styles/globalStyles";
import HomeScreenStyle from "./HomeScreenStyleV2";
import BigHeadingWithBackButton from "../../../components/Shared/BigHeadingWithBackButton";
import fonts from "../../../styles/fonts";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import CustomBtn from "../../../components/Shared/CustomBtn";
const { width } = Dimensions.get("window");

export default class HomeScreenV2 extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            profile: undefined,
        };
    }

    componentDidMount = () => {
        this.unsubscribe = this.props.navigation.addListener("didFocus", () => {
          this.onFocus();
        });
      };
    
      onFocus = () => {
        this.fetchProfile();
      };
    
      componentWillUnmount = () => {
        this.unsubscribe();
      };

    fetchProfile = async () => {
        this.setState({ loading: true });
        const uid = await AsyncStorage.getItem("uid");
        const userRef = db.collection("users").doc(uid);
        this.unsubscribe = userRef.onSnapshot(async (doc) => {
          this.setState({
            profile: doc.data(),
            loading: false
          });
        });
      };

    render() {
        const {
            loading,
            profile,
        } = this.state;

        const bigHeadeingTitle =
            (profile && profile.firstName ? profile.firstName : "").toString() + ', what do you need help with?'

        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={HomeScreenStyle.scrollView}
                style={[globalStyle.container]}
            >
                <View>

                    <BigHeadingWithBackButton
                        bigTitleText={bigHeadeingTitle}
                        isBackButton={false}
                        isBigTitle={true}
                        customContainerStyle={{ height: hp('15%') }}
                        // customContainerStyle={{ height: hp("5%") }}
                        // bigTitleStyle={{ textTransform: 'none', }}
                    />

                    <View
                        // style={{ marginTop: hp('12%') }}
                        >
                        <View style={styles.cardContainer}>
                            <TouchableOpacity style={styles.cardContainer} onPress={() => this.props.navigation.navigate("Nutrition")}>
                                <ImageBackground
                                    source={require("../../../../assets/images/Calendar/phaseCardBg.png")}
                                    style={styles.image}
                                >
                                    <View style={styles.opacityLayer}>
                                        <View style={styles.titleContainer}>
                                            <Text style={styles.title}>Nutrition</Text>
                                        </View>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.cardContainer}>
                            <TouchableOpacity style={styles.cardContainer} onPress={() => this.props.navigation.navigate("Workouts")}>
                                <ImageBackground
                                    source={require("../../../../assets/images/Calendar/phaseCardBg.png")}
                                    style={styles.image}
                                >
                                     <View style={styles.opacityLayer}>
                                        <View style={styles.titleContainer}>
                                            <Text style={styles.title}>Workout</Text>
                                        </View>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.lookContainer}>
                        <Text style={styles.title1}>Looking for more?</Text>
                        <Text style={{ fontFamily: fonts.StyreneAWebRegular }}>Start a challenge</Text>
                    </View>

                    <View>
                        <CustomBtn
                            titleCapitalise={true}
                            Title='Explore a challenge'
                            customBtnStyle={styles.oblongBtnStyle}
                            onPress={() => this.props.navigation.navigate("Calendar")}
                            // style={styles.oblongBtnStyle}
                            // isRightIcon={true}
                            // customBtnTitleStyle={{ marginHorizontal: hp('1%'), fontSize: wp("3%"), marginVertical: hp('20%') }}
                        />
                    </View>

                    <Loader loading={loading} color={colors.charcoal.standard} />
                </View>
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 30,
        height: wp("40%"),
        marginBottom: 18
    },
    flexContainer: {
        flex: 1,
    },
    image: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: colors.grey.medium,
        borderRadius: 3,
    },
    opacityLayer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
        paddingHorizontal: wp("5%"),
        paddingVertical: wp("4%"),
    },
    titleContainer: {
        maxWidth: width / 1.8,
    },
    title: {
        fontFamily: fonts.boldNarrow,
        fontSize: wp("6%"),
        color: colors.offWhite,
    },
    lookContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp('2%')
    },
    title1: {
        fontFamily: fonts.StyreneAWebRegular,
        fontWeight: '800',
        fontSize: wp("5%"),
        color: colors.black,
    },
    oblongBtnStyle: {
        alignItems: 'center',
        marginTop: hp('2%'),
        borderRadius: 8,
        borderWidth: 2,
        backgroundColor: colors.white,
        color: colors.black,
        height: hp('6%'),
        marginHorizontal: hp('10%')
    },
});
