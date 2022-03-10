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
import { isActiveChallenge } from "../../../utils/challenges";
import LogRocket from '@logrocket/react-native';

// images
import { IMAGE } from "../../../library/images";

const { width } = Dimensions.get("window");

export default class HomeScreenV2 extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            profile: undefined,
            email: undefined,
            id: undefined,
            name: undefined
        };
    }

    componentDidMount = () => {
        this.fetchProfile()
    };

    componentWillUnmount = () => {
        if(this.unsubscribe) this.unsubscribe();
    };

    fetchProfile = async () => {
        this.setState({ loading: true });
        const uid = await AsyncStorage.getItem("uid");
        const userRef = db.collection("users").doc(uid);
        this.unsubscribe = userRef.onSnapshot(async (doc) => {
            this.setState({
                profile: doc.data(),
                loading: false,
                email: doc.data().email,
                id: doc.data().id,
                name: doc.data().name
            });
        });

      
    };
    render() {
        const {
            loading,
            profile,
            email,
            name,
            id
        } = this.state;
        // LogRocket.identify(id, {
        //     name: name,
        //     email: email,
        //   });
        
        const bigHeadeingTitle =
            (profile && profile.firstName ? profile.firstName : "").toString()
        const lineText =
            'what do you need help with?'
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={HomeScreenStyle.scrollView}
                style={[globalStyle.container]}
            >
                <View>

                    <BigHeadingWithBackButton
                        bigTitleText={bigHeadeingTitle}
                        lineText={lineText}
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
                                    source={IMAGE.LIFESTYLE_NUTRITION}
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
                                    source={IMAGE.LIFESTYLE_WORKOUT}
                                    style={styles.image}
                                    resizeMode="cover"
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
                            onPress={() => {
                                isActiveChallenge().then((res) => {
                                    if (res) {
                                        this.props.navigation.navigate("Calendar");
                                    } else {
                                        this.props.navigation.navigate("ChallengeSubscription");
                                    }
                                });
                            }
                            }
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
        fontFamily: fonts.bold,
        fontSize: wp("6%"),
        textTransform: 'capitalize',
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
        marginVertical: hp('2%'),
        borderRadius: 8,
        borderWidth: 2,
        backgroundColor: colors.white,
        color: colors.black,
        marginHorizontal: hp('10%')
    },
});
