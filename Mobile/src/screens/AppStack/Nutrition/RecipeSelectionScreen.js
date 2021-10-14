import React from "react";
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Dimensions,
    Alert,
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
import { SafeAreaView } from "react-navigation";

const { width } = Dimensions.get("window");

export default class RecipeSelectionScreen extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            recipes: [],
            loading: false,
            filterIndex: 0,
            isFilterVisible: false,
            isClickable: false,
            meal: 'Breakfast',
        };
    }

    onFocusFunction = async () => {
        const { meal } = this.state;
        const newMeal = this.props.navigation.getParam("meal", null);
        // if(meal && meal !== newMeal || !meal){
        this.setState({ meal: newMeal });
        await this.fetchRecipes();
        // }
    };

    componentDidMount = async () => {
        // this.setState({ loading: true });
        // this.focusListener = this.props.navigation.addListener('willFocus', async () => {
        //     this.onFocusFunction()
        // })
        await this.fetchRecipes();
    };

    componentWillUnmount = async () => {
        // this.focusListener.remove()
        if (this.unsubscribe) await this.unsubscribe();
    };

    fetchRecipes = async () => {
        this.setState({ loading: true });
        const meal = this.props.navigation.getParam("meal", null);
        const challengeMealsFilterList = this.props.navigation.getParam(
            "challengeMealsFilterList",
            null
        );
        this.unsubscribe = await db
            .collection("recipes")
            .where('breakfast', "==", true)
            .onSnapshot(async (querySnapshot) => {
                const recipes = [];
                await querySnapshot.forEach(async (doc) => {
                    //   console.log(doc.data().title)
                    if (doc.data().active) {
                        if (challengeMealsFilterList && challengeMealsFilterList.length > 0) {
                            if (challengeMealsFilterList.includes(doc.data().id))
                                await recipes.push(await doc.data());
                        } else {
                            await recipes.push(await doc.data());
                        }
                    }
                });

                Promise.all(
                    recipes.map(async (recipe) => {
                        const fileUri = `${FileSystem.cacheDirectory}recipe-${recipe.id}.jpg`;
                        await FileSystem.getInfoAsync(fileUri)
                            .then(async ({ exists }) => {
                                if (!exists) {
                                    await FileSystem.downloadAsync(
                                        recipe.coverImage,
                                        `${FileSystem.cacheDirectory}recipe-${recipe.id}.jpg`
                                    );
                                }
                            })
                            .catch((reason) => {
                                this.setState({ loading: false });
                                Alert.alert("Error", `Error: ${reason}`);
                            });
                    })
                );
                // OLD CODE - DOWNLOADING ALL IMAGES EVERY TIME
                // await Promise.all(recipes.map(async (recipe) => {
                //   await FileSystem.downloadAsync(
                //     recipe.coverImage,
                //     `${FileSystem.cacheDirectory}recipe-${recipe.id}.jpg`,
                //   );
                // }));

                // console.log(recipes.sort((a, b) => {
                //   if (a.order === b.order)
                //     return 0;
                //   else if (a.order === 0)  
                //     return 1;
                //   else if (b.order === 0) 
                //     return -1;
                //   else                  
                //     return 1
                // }));

                // this.setState({ recipes: sortBy(recipes, "order"), loading: false });
                this.setState({
                    recipes: recipes.sort((a, b) => {
                        if (a.order === b.order)
                            return 0;
                        else if (a.order === 0)
                            return 1;
                        else if (b.order === 0)
                            return -1;
                        else
                            return 1
                    }), loading: false
                });
            });
    };

    updateFilter = (filterIndex) => {
        this.setState({ filterIndex });
    };

    keyExtractor = (item, index) => String(index);

    renderItem = ({ item }) => (
        <RecipeTile
            onPress={() =>
                this.props.navigation.push("Recipe", {
                    recipe: item,
                    backTitle: this.props.navigation.getParam("meal", null),
                })
            }
            // image={
            //   `${FileSystem.cacheDirectory}recipe-${item.id}.jpg` || item.coverImage
            // }
            image={item.coverImage}
            title={item.title.toUpperCase()}
            tags={item.tags}
            subTitle={item.subtitle}
            time={item.time}
            newBadge={item.newBadge}
        />
    );

    handleBack = () => {
        const { navigation } = this.props;
        navigation.pop();
    };

    render() {
        const meal = this.props.navigation.getParam("meal", null);
        const { recipes, loading, filterIndex } = this.state;
        const filterButtons = [
            {
                id: '1',
                data: ["All", "Vegetarian", "Vegan", "Gluten-Free", "Level 1", "Level 2", "Phase 1", "Phase 2", "Phase 3"]
            }
        ]

        // console.log('recipes', recipes)

        const renderItem1 = ({ item: items }) =>
        (
            <CustomButtonGroup
                onPress={this.updateFilter}
                selectedIndex={filterIndex}
                buttons={filterButtons[0].data}
            />
        );

        const recipeList = sortBy(recipes, "newBadge").filter((recipe) => {
            // console.log(recipe.title)
            if (recipe.tags === undefined) return recipes;
            if (filterIndex === 1) {
                return recipe.tags.includes("V");
            } else if (filterIndex === 2) {
                return recipe.tags.includes("V+");
            }
            if (filterIndex === 3) {
                return recipe.tags.includes("GF");
            }
            if (filterIndex === 4) {
                return recipe.tags.includes("L1");
            } else if (filterIndex === 5) {
                return recipe.tags.includes("L2");
            }
            if (filterIndex === 6) {
                return recipe.tags.includes("P1");
            } else if (filterIndex === 7) {
                return recipe.tags.includes("P2");
            } else if (filterIndex === 8) {
                return recipe.tags.includes("P3");
            }

            return recipes;
        });

        const skeleton = (
            <View style={styles.recipeTileSkeletonContainer}>
                <RecipeTileSkeleton />
                <RecipeTileSkeleton />
                <RecipeTileSkeleton />
            </View>
        );

        const clickModal = (
            <Modal
                isVisible={this.state.isClickable}
                // isVisible={true}
                coverScreen={true}
                style={{ margin: 0 }}
                animationIn="fadeInRightBig"
                animationOut="fadeOutDownBig"
                onBackdropPress={() => this.setState({ isClickable: !this.state.isClickable, isFilterVisible: !this.state.isFilterVisible })}
            >
                <View style={{ backgroundColor: 'white', height: hp('50%'), marginTop: 320 }}>
                    <View style={globalStyle.container}>
                        <View style={styles.closeContainer}><Text></Text></View>
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                top: 20,
                            }}
                            onPress={() => this.setState({ isClickable: !this.state.isClickable })}
                        >
                            <Icon name="chevron-left" size={14} color={colors.black} />
                            <Text style={{ marginLeft: 7 }}>Back</Text>
                        </TouchableOpacity>
                        <Text style={{ fontFamily: 'monospace', marginBottom: 20, marginVertical: 40, fontWeight: 'bold' }}>Select Phase</Text>
                        <View style={styles.tagContainer}>
                                <Text style={{ marginBottom: 8 }}>Phase 1</Text>
                                <CheckBox/>
                            </View>
                            <View style={styles.tagContainer}>
                                <Text style={{ marginBottom: 8 }}>Phase 2</Text>
                                <CheckBox/>
                            </View>
                            <View style={styles.tagContainer}>
                                <Text style={{ marginBottom: 8 }}>Phase 3</Text>
                                <CheckBox/>
                            </View>
                            <View style={{ marginTop: 50 }}>
                                <Button 
                                    title="Apply"
                                    color='grey'
                                />
                            </View>
                    </View>
                </View>
            </Modal>
        )

        const filterModal = (
            <Modal
                isVisible={this.state.isClickable ? !this.state.isFilterVisible : this.state.isFilterVisible}
                coverScreen={true}
                style={{ margin: 0 }}
                animationIn="fadeInUpBig"
                animationOut="fadeOutDownBig"
                onBackdropPress={() => this.setState({ isFilterVisible: !this.state.isFilterVisible })}
            >
                <View style={{ backgroundColor: 'white', height: hp('80%'), marginTop: 200, }}>
                    <View style={globalStyle.container}>
                        <View style={styles.closeContainer}><Text></Text></View>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontFamily: 'monospace', marginBottom: 20, marginTop:10, fontWeight: 'bold' }}>Filter receipes to</Text>
                            <View style={styles.tagContainer}>
                                <View style={styles.tagContainer1}>
                                    <View style={{ 
                                        height: 25,
                                        width: 25,
                                        marginRight: 10,
                                        borderWidth: 0,
                                        // borderColor: colors.violet.standard,
                                        borderRadius: 14,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: '#00C520',
                                    }}>
                                        <Text style={{ 
                                            fontFamily: fonts.bold,
                                            fontSize: 9,
                                            color: colors.white, 
                                        }}>
                                        V
                                        </Text>
                                    </View>
                                    <Text style={{ marginTop: 4 }}>Vegan</Text>
                                </View>
                                <CheckBox/>
                            </View>
                            <View style={styles.tagContainer}>
                                <View style={styles.tagContainer1}>
                                    <View style={{ 
                                        height: 25,
                                        width: 25,
                                        marginRight: 10,
                                        borderWidth: 0,
                                        // borderColor: colors.violet.standard,
                                        borderRadius: 14,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: '#469753',
                                    }}>
                                        <Text style={{ 
                                            fontFamily: fonts.bold,
                                            fontSize: 9,
                                            color: colors.white,
                                        }}>
                                        VEG
                                        </Text>
                                    </View>
                                    <Text style={{ marginTop: 4 }}>Vegetarian</Text>
                                </View>
                                <CheckBox/>
                            </View>
                            <View style={styles.tagContainer}>
                                <View style={styles.tagContainer1}>
                                    <View style={{ 
                                        height: 25,
                                        width: 25,
                                        marginRight: 10,
                                        borderWidth: 0,
                                        // borderColor: colors.violet.standard,
                                        borderRadius: 14,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: '#469753',
                                    }}>
                                        <Text style={{ 
                                            fontFamily: fonts.bold,
                                            fontSize: 9,
                                            color: colors.white, 
                                        }}>
                                        GF
                                        </Text>
                                    </View>
                                    <Text style={{ marginTop: 4 }}>Gluta-Free</Text>
                                </View>
                                <CheckBox/>
                            </View>
                            <View style={styles.tagContainer}>
                                <View style={styles.tagContainer1}>
                                    <View style={{ 
                                        height: 25,
                                        width: 25,
                                        marginRight: 10,
                                        borderWidth: 0,
                                        // borderColor: colors.violet.standard,
                                        borderRadius: 14,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: '#B7782B',
                                    }}>
                                        <Text style={{ 
                                            fontFamily: fonts.bold,
                                            fontSize: 9,
                                            color: colors.white, 
                                        }}>
                                        DF
                                        </Text>
                                    </View>
                                    <Text style={{ marginTop: 4 }}>Dairy-Free</Text>
                                </View>
                                <CheckBox/>
                            </View>
                            <View style={styles.tagContainer}>
                                <View style={styles.tagContainer1}>
                                    <View style={{ 
                                        height: 25,
                                        width: 25,
                                        marginRight: 10,
                                        borderWidth: 0,
                                        // borderColor: colors.violet.standard,
                                        borderRadius: 14,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: '#965734',
                                    }}>
                                        <Text style={{ 
                                            fontFamily: fonts.bold,
                                            fontSize: 9,
                                            color: colors.white, 
                                        }}>
                                        GH
                                        </Text>
                                    </View>
                                    <Text style={{ marginTop: 4 }}>Gut Health</Text>
                                </View>
                                <CheckBox/>
                            </View>
                            <Text style={{ fontFamily: 'monospace', marginBottom: 20, marginVertical: 30, fontWeight: 'bold' }}>Select transform level</Text>
                            <View style={styles.tagContainer}>
                                <Text style={{ marginBottom: 8 }}>Level 1</Text>
                                <TouchableOpacity
                                    onPress={() => this.setState({ isClickable: !this.state.isClickable })}
                                >
                                    
                                    <Icon name="chevron-right" size={12} color={colors.black} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.tagContainer}>
                                <Text style={{ marginBottom: 8 }}>Level 2</Text>
                                <TouchableOpacity
                                    onPress={() => this.setState({ isClickable: !this.state.isClickable })}
                                >
                                    
                                    <Icon name="chevron-right" size={12} color={colors.black} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.tagContainer}>
                                <Text style={{ marginBottom: 8 }}>Level 3</Text>
                                <TouchableOpacity
                                    onPress={() => this.setState({ isClickable: !this.state.isClickable })}
                                >
                                    
                                    <Icon name="chevron-right" size={12} color={colors.black} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: 30 }}>
                                <Button 
                                    title="Apply"
                                    color='grey'
                                />
                            </View>
                        </View>
                    </View>
                </View>
                {/* {clickModal} */}
            </Modal>
        )

        return (
            <View style={globalStyle.container}>
                <View
                    style={styles.customContainerStyle}
                >
                    {/* BigHeadText */}
                    <Text
                        style={styles.bigTitleStyle}
                    >
                        Breakfast
                    </Text>

                    {/* Filter Button */}
                    <View>
                        <CustomBtn
                            titleCapitalise={true}
                            Title='Filter'
                            style={styles.oblongBtnStyle}
                            isRightIcon={true}
                            customBtnTitleStyle={{ marginHorizontal: 10, fontSize: 13, height: 50, bottom: 5 }}
                            onPress={() => this.setState({ isFilterVisible: !this.state.isFilterVisible })}
                        />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', top: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#d9dbda', borderRadius: 50, marginRight: 10 }}>
                        <Text style={{ marginVertical: 4, marginHorizontal: 8, fontSize: 13 }}>Vegan</Text>
                        <Icon name='cross' size={9} color={colors.black} style={{ marginRight: 10 }}/>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#d9dbda', borderRadius: 50, marginRight: 10 }}>
                        <Text style={{ marginVertical: 4, marginHorizontal: 8, fontSize: 13 }}>Vegetarian</Text>
                        <Icon name='cross' size={9} color={colors.black} style={{ marginRight: 10 }}/>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#d9dbda', borderRadius: 50, marginRight: 10 }}>
                        <Text style={{ marginVertical: 4, marginHorizontal: 8, fontSize: 13 }}>L1 - P1</Text>
                        <Icon name='cross' size={9} color={colors.black} style={{ marginRight: 10 }}/>
                    </View>
                </View>
                <View>
                    
                </View>
                {/* <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={filterButtons}
                    keyExtractor={(item) => item.id}
                    renderItem={(item) => renderItem1(item)}
                    style={{
                        paddingVertical: wp("4%"),
                    }}
                /> */}
                {/* {loading ? (
                    skeleton
                ) : (
                    <FlatList
                        contentContainerStyle={styles.scrollView}
                        data={recipeList}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderItem}
                        showsVerticalScrollIndicator={false}
                        removeClippedSubviews={false}
                    // maxToRenderPerBatch={20}
                    />
                )} */}
                {filterModal}
                {clickModal}
            </View>
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
        fontFamily: 'monospace',
        color: colors.black,
        letterSpacing: 0.5,
    },
    oblongBtnStyle: {
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
        height: 40
    },
    closeContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'grey',
        marginHorizontal: 160,
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
    }
});