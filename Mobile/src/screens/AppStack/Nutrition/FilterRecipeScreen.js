import React from "react";
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Dimensions,
    SafeAreaView,
    FlatList,
    Text,
    CheckBox,
    Button,
} from "react-native";
import * as FileSystem from "expo-file-system";
import sortBy from "lodash.sortby";
import { db } from "../../../../config/firebase";
import RecipeTile from "../../../components/Nutrition/RecipeTile";
import RecipeTileSkeleton from "../../../components/Nutrition/RecipeTileSkeleton";
import colors from "../../../styles/colors";
import fonts from '../../../styles/fonts';
import Icon from "../../../components/Shared/Icon";
import globalStyle from "../../../styles/globalStyles";
import BigHeadingWithBackButton from "../../../components/Shared/BigHeadingWithBackButton";
import CustomButtonGroup from "../../../components/Shared/CustomButtonGroup";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import CustomBtn from "../../../components/Shared/CustomBtn";
import Modal from "react-native-modal";
import { Card } from 'react-native-elements';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import AsyncStorage from "@react-native-community/async-storage";

const { width } = Dimensions.get("window");

export default class RecipeSelectionScreen extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            recipes: [],
            loading: false,
            filterIndex: 0,
            isFilterVisible: false,
            isClickVisible: false,
            meal: 'Breakfast',
            initial: 1
        };
        this.sheetRef = React.createRef();
    }

    onFocusFunction() {
        this.setState({ loading: true });
        // this.props.navigation.setParams({ handleStart: this.props.navigation.navigate('RecipeSteps', { recipe }) });
        // this.props.navigation.setParams({
        //     handleStart: () => this.handleStart(recipes),
        // });
        this.setState({
            recipes: this.props.navigation.getParam("recipes", null),
            loading: false
        });
    }
    componentDidMount = async () => {
        // this.focusListener = this.props.navigation.addListener('willFocus', () => {
        //   this.onFocusFunction()
        // })
        this.onFocusFunction();
    };

    // handleStart = (recipes) => {
    //     this.props.navigation.navigate("RecipeSteps", { recipes });
    // };

    handleBack = () => {
        const { navigation } = this.props;
        navigation.pop();
    };

    renderItem = ({ item }) => {

        const color1 = []

        const tagList1 = sortBy(item.tags).filter((tag) => {

            if(tag === 'V'){
                color1.push({
                    name: tag,
                    color: '#00C520'
                })
            }
            if(tag === 'V+'){
                color1.push({
                    name: tag.replace('V+', 'VEG'),
                    color: '#9403fc'
                })
            }
            if(tag === 'GF'){
                color1.push({
                    name: tag,
                    color: '#469753'
                })
            }
            if(tag === 'DF'){
                color1.push({
                    name: tag,
                    color: '#B7782B'
                })
            }
            if(tag === 'GH'){
                color1.push({
                    name: tag,
                    color: '#965734'
                })
            }
            if(tag === 'L3'){
                color1.push({
                    name: tag,
                    color: '#F89500'
                })
            }
            if(tag === 'L2'){
                color1.push({
                    name: tag,
                    color: '#fc1403'
                })
            }
            if(tag === 'L1'){
                color1.push({
                    name: tag,
                    color: '#03adfc'
                })
            }
            if(tag === 'P3'){
                color1.push({
                    name: tag,
                    color: '#c203fc'
                })
            }
            if(tag === 'P2'){
                color1.push({
                    name: tag,
                    color: '#fc0384'
                })
            }
            if(tag === 'P1'){
                color1.push({
                    name: tag,
                    color: '#fc8403'
                })
            }
        })

        const result = color1.splice(0, 3)

        // console.log('RecipeData: ', result)

        return (

            <View
                style={styles.cardContainer}
            >
                <Card
                    image={{ uri: item.coverImage }}
                    containerStyle={styles.card}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: -10 }}>
                            <View style={{ maxWidth: '70%' }}>
                                <Text style={{ fontFamily: fonts.bold, fontSize: 14, lineHeight: 18 }}>{item.title}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {
                                result && result.map((tag, index) => (
                                    <View
                                        style={{
                                            height: 20,
                                            width: 20,
                                            marginRight: 4,
                                            borderWidth: 0,
                                            // borderColor: colors.violet.standard,
                                            borderRadius: 14,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: tag.color,
                                        }}
                                        key={index}
                                    >
                                        <Text style={{
                                            fontFamily: fonts.bold,
                                            fontSize: 7,
                                            color: colors.white,
                                        }}>
                                            {tag.name}
                                        </Text>
                                    </View>
                                ))
                            }
                            <Text style={{ fontSize: 9 }}>+ more</Text>
                        </View>
                    </View>
                </Card>
            </View>
        )
    };

    renderItem1 = ({ }) => {

        return (
            <View
                style={{ flexDirection: 'row', marginVertical: 10, height: 20, bottom: 10, marginTop: 20 }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#e3e3e3',
                        borderRadius: 50,
                        marginRight: 7,
                    }}
                >
                    <Text style={{ marginHorizontal: 10, marginVertical: 5, fontSize: 9, }}>Vegan</Text>
                    <Icon name='cross' size={8} color={colors.black} style={{ marginRight: 10 }} />
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#e3e3e3',
                        borderRadius: 50,
                        marginRight: 7,
                    }}
                >
                    <Text style={{ marginHorizontal: 10, marginVertical: 5, fontSize: 9, }}>Vegetarian</Text>
                    <Icon name='cross' size={8} color={colors.black} style={{ marginRight: 10 }} />
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#e3e3e3',
                        borderRadius: 50,
                        marginRight: 7,
                    }}
                >
                    <Text style={{ marginHorizontal: 10, marginVertical: 5, fontSize: 9, }}>L1 - P1</Text>
                    <Icon name='cross' size={8} color={colors.black} style={{ marginRight: 10 }} />
                </View>
            </View>
        )
    }

    keyExtractor = (item, index) => String(index);

    // tagName = ["Vegetarian", "Vegan", "Gluten-Free", "Level 1", "Level 2", "Phase 1", "Phase 2", "Phase 3"]

    render() {
        const { recipes, loading, initial } = this.state

        const clickModal = (
            <Modal
                isVisible={this.state.isFilterVisible ? this.state.isClickVisible : this.state.isClickVisible}
                coverScreen={true}
                style={{ margin: 0, justifyContent: 'flex-end' }}
                animationIn="fadeInRightBig"
                animationOut="fadeOutDownBig"
                onBackdropPress={() => this.setState({ isClickVisible: !this.state.isClickVisible, isFilterVisible: !this.state.isFilterVisible })}
            >
                <SafeAreaView style={{ backgroundColor: 'white', paddingHorizontal: 20 }}>
                    <View>
                        <TouchableOpacity
                            style={styles.closeContainer}
                            onPress={() => this.setState({ isClickVisible: !this.state.isClickVisible, isFilterVisible: !this.state.isFilterVisible })}
                        >
                            <View>
                                <Text></Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}
                            onPress={() => this.setState({ isClickVisible: !this.state.isClickVisible })}
                        >
                            <Icon name='chevron-left' size={13} color={colors.black} style={{ marginRight: 10 }} />
                            <Text style={{ fontSize: 15 }}>Back</Text>
                        </TouchableOpacity>
                        <Text style={{
                            // fontFamily: 'monospace',
                            marginBottom: 20, marginVertical: 20, fontWeight: 'bold', fontSize: 20 }}>Select Phase</Text>
                        <View style={styles.tagContainer}>
                            <Text style={{ marginBottom: 10, fontSize: 15 }}>Phase 1</Text>
                            <CheckBox />
                        </View>
                        <View style={styles.tagContainer}>
                            <Text style={{ marginBottom: 10, fontSize: 15 }}>Phase 2</Text>
                            <CheckBox />
                        </View>
                        <View style={styles.tagContainer}>
                            <Text style={{ marginBottom: 10, fontSize: 15 }}>Phase 3</Text>
                            <CheckBox />
                        </View>
                        <View style={{ marginVertical: 20 }}>
                            <Button
                                title="Apply"
                                color='#4d4c4c'
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        )

        // const filterModal = (
        //     <Modal
        //         isVisible={this.state.isClickVisible ? !this.state.isFilterVisible : this.state.isFilterVisible}
        //         coverScreen={true}
        //         style={{ margin: 0, justifyContent: 'flex-end' }}
        //         animationIn="fadeInUpBig"
        //         animationOut="fadeOutDownBig"
        //         onBackdropPress={() => this.setState({ isFilterVisible: !this.state.isFilterVisible })}
        //     >
        //         <SafeAreaView style={{ backgroundColor: 'white', paddingHorizontal: 20 }}>
        //             <View>
        //                 <TouchableOpacity
        //                     style={styles.closeContainer}
        //                     onPress={() => this.setState({ isFilterVisible: !this.state.isFilterVisible })}
        //                 >
        //                     <View>
        //                         <Text></Text>
        //                     </View>
        //                 </TouchableOpacity>
        //                 <View style={{ marginTop: 10 }}>
        //                     <Text style={{ fontFamily: 'monospace', marginBottom: 20, marginTop: 10, fontWeight: 'bold', fontSize: 20 }}>Filter recipes to</Text>
        //                     <View style={styles.tagContainer}>
        //                         <View style={styles.tagContainer1}>
        //                             <View style={{
        //                                 height: 25,
        //                                 width: 25,
        //                                 marginRight: 10,
        //                                 borderWidth: 0,
        //                                 // borderColor: colors.violet.standard,
        //                                 borderRadius: 14,
        //                                 justifyContent: "center",
        //                                 alignItems: "center",
        //                                 backgroundColor: '#00C520',
        //                             }}>
        //                                 <Text style={{
        //                                     fontFamily: fonts.bold,
        //                                     fontSize: 9,
        //                                     color: colors.white,
        //                                 }}>
        //                                     V
        //                                 </Text>
        //                             </View>
        //                             <Text style={{ marginTop: 3, fontSize: 15 }}>Vegan</Text>
        //                         </View>
        //                         <CheckBox />
        //                     </View>
        //                     <View style={styles.tagContainer}>
        //                         <View style={styles.tagContainer1}>
        //                             <View style={{
        //                                 height: 25,
        //                                 width: 25,
        //                                 marginRight: 10,
        //                                 borderWidth: 0,
        //                                 // borderColor: colors.violet.standard,
        //                                 borderRadius: 14,
        //                                 justifyContent: "center",
        //                                 alignItems: "center",
        //                                 backgroundColor: '#469753',
        //                             }}>
        //                                 <Text style={{
        //                                     fontFamily: fonts.bold,
        //                                     fontSize: 9,
        //                                     color: colors.white,
        //                                 }}>
        //                                     VEG
        //                                 </Text>
        //                             </View>
        //                             <Text style={{ marginTop: 3, fontSize: 15 }}>Vegetarian</Text>
        //                         </View>
        //                         <CheckBox />
        //                     </View>
        //                     <View style={styles.tagContainer}>
        //                         <View style={styles.tagContainer1}>
        //                             <View style={{
        //                                 height: 25,
        //                                 width: 25,
        //                                 marginRight: 10,
        //                                 borderWidth: 0,
        //                                 // borderColor: colors.violet.standard,
        //                                 borderRadius: 14,
        //                                 justifyContent: "center",
        //                                 alignItems: "center",
        //                                 backgroundColor: '#9403fc',
        //                             }}>
        //                                 <Text style={{
        //                                     fontFamily: fonts.bold,
        //                                     fontSize: 9,
        //                                     color: colors.white,
        //                                 }}>
        //                                     GF
        //                                 </Text>
        //                             </View>
        //                             <Text style={{ marginTop: 3, fontSize: 15 }}>Gluta-Free</Text>
        //                         </View>
        //                         <CheckBox />
        //                     </View>
        //                     <View style={styles.tagContainer}>
        //                         <View style={styles.tagContainer1}>
        //                             <View style={{
        //                                 height: 25,
        //                                 width: 25,
        //                                 marginRight: 10,
        //                                 borderWidth: 0,
        //                                 // borderColor: colors.violet.standard,
        //                                 borderRadius: 14,
        //                                 justifyContent: "center",
        //                                 alignItems: "center",
        //                                 backgroundColor: '#B7782B',
        //                             }}>
        //                                 <Text style={{
        //                                     fontFamily: fonts.bold,
        //                                     fontSize: 9,
        //                                     color: colors.white,
        //                                 }}>
        //                                     DF
        //                                 </Text>
        //                             </View>
        //                             <Text style={{ marginTop: 3, fontSize: 15 }}>Dairy-Free</Text>
        //                         </View>
        //                         <CheckBox />
        //                     </View>
        //                     <View style={styles.tagContainer}>
        //                         <View style={styles.tagContainer1}>
        //                             <View style={{
        //                                 height: 25,
        //                                 width: 25,
        //                                 marginRight: 10,
        //                                 borderWidth: 0,
        //                                 // borderColor: colors.violet.standard,
        //                                 borderRadius: 14,
        //                                 justifyContent: "center",
        //                                 alignItems: "center",
        //                                 backgroundColor: '#965734',
        //                             }}>
        //                                 <Text style={{
        //                                     fontFamily: fonts.bold,
        //                                     fontSize: 9,
        //                                     color: colors.white,
        //                                 }}>
        //                                     GH
        //                                 </Text>
        //                             </View>
        //                             <Text style={{ marginTop: 3, fontSize: 15 }}>Gut Health</Text>
        //                         </View>
        //                         <CheckBox />
        //                     </View>
        //                     <Text style={{ fontFamily: 'monospace', marginBottom: 20, marginVertical: 30, fontWeight: 'bold', fontSize: 20 }}>Select transform level</Text>
        //                     <View style={styles.tagContainer}>
        //                         <Text style={{ marginBottom: 10, fontSize: 15 }}>Level 1</Text>
        //                         <TouchableOpacity
        //                             onPress={() => this.setState({ isClickVisible: !this.state.isClickVisible })}
        //                         >
        //                             <Icon name="chevron-right" size={12} color={colors.black} />
        //                         </TouchableOpacity>
        //                     </View>
        //                     <View style={styles.tagContainer}>
        //                         <Text style={{ marginBottom: 10, fontSize: 15 }}>Level 2</Text>
        //                         <TouchableOpacity
        //                             onPress={() => this.setState({ isClickVisible: !this.state.isClickVisible })}
        //                         >
        //                             <Icon name="chevron-right" size={12} color={colors.black} />
        //                         </TouchableOpacity>
        //                     </View>
        //                     <View style={styles.tagContainer}>
        //                         <Text style={{ marginBottom: 10, fontSize: 15 }}>Level 3</Text>
        //                         <TouchableOpacity
        //                             onPress={() => this.setState({ isClickVisible: !this.state.isClickVisible })}
        //                         >
        //                             <Icon name="chevron-right" size={12} color={colors.black} />
        //                         </TouchableOpacity>
        //                     </View>
        //                     <View style={{ marginVertical: 20 }}>
        //                         <Button
        //                             title="Apply"
        //                             color='#4d4c4c'
        //                         />
        //                     </View>
        //                 </View>
        //             </View>
        //         </SafeAreaView>
        //     </Modal>
        // )

        const renderContent = () => (
            <View
                style={{
                    backgroundColor: 'black',
                    padding: 16,
                    height: 450
                }}
            >
                <Text>Swipe down to close</Text>
            </View>
        );

        return (
            // <>
            //     <View
            //         style={{
            //             flex: 1,
            //             backgroundColor: 'papayawhip',
            //             // alignItems: 'center',
            //             // justifyContent: 'center',
            //         }}
            //     >
            //          <Button
            //              title="Open Bottom Sheet"
            //              onPress={() => this.sheetRef.current.snapTo(0)}
            //          />
            //     </View>
            //     <BottomSheet
            //         initialSnap={1}
            //         ref={this.sheetRef}
            //         snapPoints={[450, 0, 0]}
            //         borderRadius={25}
            //         renderContent={renderContent}
            //     />
            // </>
            // <View style={globalStyle.container}>
            //     <View
            //         style={styles.customContainerStyle}
            //     >
            //         {/* BigHeadText */}
            //         <View>
            //             <BigHeadingWithBackButton
            //                 isBackButton={true}
            //                 onPress={this.handleBack}
            //                 backButtonText="Back to Workout"
            //                 isBackButton={true}
            //                 customContainerStyle={{ bottom: 25 }}
            //             />
            //             <Text style={{ bottom: 60, fontSize: 30
            //                 // , fontFamily: 'monospace'
            //             }}>Breakfast</Text>
            //         </View>
            //
            //         {/* Filter Button */}
            //         {/*<View>*/}
            //         {/*    <CustomBtn*/}
            //         {/*        titleCapitalise={true}*/}
            //         {/*        Title='Filter'*/}
            //         {/*        style={styles.oblongBtnStyle}*/}
            //         {/*        isRightIcon={true}*/}
            //         {/*        customBtnTitleStyle={{ marginHorizontal: 10, fontSize: 12 }}*/}
            //         {/*        // onPress={() => this.setState({ isFilterVisible: !this.state.isFilterVisible })}*/}
            //         {/*    />*/}
            //         {/*</View>*/}
            //
            //         <View
            //             style={{
            //                 flex: 1,
            //                 backgroundColor: 'papayawhip',
            //                 alignItems: 'center',
            //                 justifyContent: 'center',
            //             }}
            //         >
            //             <Button
            //                 title="Open Bottom Sheet"
            //                 onPress={() => this.sheetRef.current.snapTo(0)}
            //             />
            //         </View>
            //     </View>
            //     <View
            //         style={{ flexDirection: 'row', marginVertical: 10, top: 10, marginBottom: 20 }}
            //     >
            //         <View
            //             style={{
            //                 flexDirection: 'row',
            //                 alignItems: 'center',
            //                 backgroundColor: '#e3e3e3',
            //                 borderRadius: 50,
            //                 marginRight: 7,
            //             }}
            //         >
            //             <Text style={{ marginHorizontal: 10, marginVertical: 5, fontSize: 9, }}>Vegan</Text>
            //             <Icon name='cross' size={8} color={colors.black} style={{ marginRight: 10 }} />
            //         </View>
            //         <View
            //             style={{
            //                 flexDirection: 'row',
            //                 alignItems: 'center',
            //                 backgroundColor: '#e3e3e3',
            //                 borderRadius: 50,
            //                 marginRight: 7,
            //             }}
            //         >
            //             <Text style={{ marginHorizontal: 10, marginVertical: 5, fontSize: 9, }}>Vegetarian</Text>
            //             <Icon name='cross' size={8} color={colors.black} style={{ marginRight: 10 }} />
            //         </View>
            //         <View
            //             style={{
            //                 flexDirection: 'row',
            //                 alignItems: 'center',
            //                 backgroundColor: '#e3e3e3',
            //                 borderRadius: 50,
            //                 marginRight: 7,
            //             }}
            //         >
            //             <Text style={{ marginHorizontal: 10, marginVertical: 5, fontSize: 9, }}>L1 - P1</Text>
            //             <Icon name='cross' size={8} color={colors.black} style={{ marginRight: 10 }} />
            //         </View>
            //     </View>
            //     {/* <FlatList
            //         horizontal
            //         showsHorizontalScrollIndicator={false}
            //         data={recipes}
            //         keyExtractor={(item) => item.id}
            //         renderItem={(item) => this.renderItem1(item)}
            //         style={{
            //             paddingVertical: wp("4%"),
            //         }}
            //     /> */}
            //     {loading ? (
            //         skeleton
            //     ) : (
            //         <FlatList
            //             contentContainerStyle={styles.scrollView}
            //             data={recipes}
            //             keyExtractor={(res) => res.id}
            //             renderItem={(item) => this.renderItem(item)}
            //             showsVerticalScrollIndicator={false}
            //             removeClippedSubviews={false}
            //         // maxToRenderPerBatch={20}
            //         />
            //     )}
            //     {/*{filterModal}*/}
            //     <BottomSheet
            //          initialSnap={1}
            //          ref={this.sheetRef}
            //          snapPoints={[450, 0, 0]}
            //          borderRadius={25}
            //          renderContent={renderContent}
            //      />
            //     {clickModal}
            // </View>
            <>
                <View style={globalStyle.container}>
                    <View
                        style={styles.customContainerStyle}
                    >
                        {/* BigHeadText */}
                        <View>
                            <BigHeadingWithBackButton
                                isBackButton={true}
                                onPress={this.handleBack}
                                backButtonText="Back to Workout"
                                isBackButton={true}
                                customContainerStyle={{ bottom: 25 }}
                            />
                            <Text style={{ bottom: 60, fontSize: 30
                                // , fontFamily: 'monospace'
                            }}>Breakfast</Text>
                        </View>

                        {/* Filter Button */}
                        {/*<View>*/}
                        {/*    <CustomBtn*/}
                        {/*        titleCapitalise={true}*/}
                        {/*        Title='Filter'*/}
                        {/*        style={styles.oblongBtnStyle}*/}
                        {/*        isRightIcon={true}*/}
                        {/*        customBtnTitleStyle={{ marginHorizontal: 10, fontSize: 12 }}*/}
                        {/*        // onPress={() => this.setState({ isFilterVisible: !this.state.isFilterVisible })}*/}
                        {/*    />*/}
                        {/*</View>*/}

                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'papayawhip',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Button
                                title="Open Bottom Sheet"
                                onPress={() => this.sheetRef.current.snapTo(0)}
                            />
                        </View>
                    </View>
                    <View
                        style={{ flexDirection: 'row', marginVertical: 10, top: 10, marginBottom: 20 }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: '#e3e3e3',
                                borderRadius: 50,
                                marginRight: 7,
                            }}
                        >
                            <Text style={{ marginHorizontal: 10, marginVertical: 5, fontSize: 9, }}>Vegan</Text>
                            <Icon name='cross' size={8} color={colors.black} style={{ marginRight: 10 }} />
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: '#e3e3e3',
                                borderRadius: 50,
                                marginRight: 7,
                            }}
                        >
                            <Text style={{ marginHorizontal: 10, marginVertical: 5, fontSize: 9, }}>Vegetarian</Text>
                            <Icon name='cross' size={8} color={colors.black} style={{ marginRight: 10 }} />
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: '#e3e3e3',
                                borderRadius: 50,
                                marginRight: 7,
                            }}
                        >
                            <Text style={{ marginHorizontal: 10, marginVertical: 5, fontSize: 9, }}>L1 - P1</Text>
                            <Icon name='cross' size={8} color={colors.black} style={{ marginRight: 10 }} />
                        </View>
                    </View>
                    {/* <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={recipes}
                    keyExtractor={(item) => item.id}
                    renderItem={(item) => this.renderItem1(item)}
                    style={{
                        paddingVertical: wp("4%"),
                    }}
                /> */}
                    {loading ? (
                        skeleton
                    ) : (
                        <FlatList
                            contentContainerStyle={styles.scrollView}
                            data={recipes}
                            keyExtractor={(res) => res.id}
                            renderItem={(item) => this.renderItem(item)}
                            showsVerticalScrollIndicator={false}
                            removeClippedSubviews={false}
                            // maxToRenderPerBatch={20}
                        />
                    )}
                    {/*{filterModal}*/}
                    {clickModal}
                </View>
                <BottomSheet
                    initialSnap={initial}
                    ref={this.sheetRef}
                    snapPoints={[450, 0, 0]}
                    borderRadius={25}
                    renderContent={renderContent}
                />
            </>
        );
    }
}

const styles = StyleSheet.create({
    scrollView: {
        paddingBottom: 15,
    },
    recipeTileSkeletonContainer: {
        // paddingTop: 35,
    },
    rLabel: {
        fontFamily: fonts.GothamMedium,
        fontSize: 8,
        color: colors.grey.dark,
    },
    icon: {
        marginTop: 2,
    },
    icon2: {
        marginTop: 2,
    },
    customContainerStyle: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        height: 50,
        marginVertical: hp("2%"),
        marginTop: 10,
        marginBottom: hp("2.5%"),
        paddingTop: 10,
    },
    bigTitleStyle: {
        fontSize: hp("4%"),
        fontWeight: '700',
        // fontFamily: 'monospace',
        color: colors.black,
        letterSpacing: 0.5,
    },
    oblongBtnStyle: {
        alignItems: 'center',
        borderRadius: 45,
        borderWidth: 0,
        backgroundColor: colors.white,
        color: colors.black,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.48,
        shadowRadius: 11.95,
        elevation: 18,
        height: 38,
    },
    closeContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'grey',
        marginHorizontal: wp('40%'),
        marginTop: 10,
        borderRadius: 50,
        height: 5,
    },
    tagContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 2,
    },
    tagContainer1: {
        flexDirection: 'row',
    },
    cardContainer: {
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center',
        // shadowColor: colors.charcoal.standard,
        // shadowOpacity: 0.5,
        // shadowOffset: { width: 0, height: 2 },
        // shadowRadius: 4,
    },
    card: {
        width: width - 50,
        borderRadius: 3,
        overflow: 'hidden',
        borderWidth: 0,
        elevation: 0,
    },
});