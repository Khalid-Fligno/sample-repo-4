import React from "react";
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Dimensions,
    FlatList,
    Text,
    ScrollView
} from "react-native";
import sortBy from "lodash.sortby";
import colors from "../../../../styles/colors";
import fonts from '../../../../styles/fonts';
import Icon from "../../../../components/Shared/Icon";
import globalStyle from "../../../../styles/globalStyles";
import BigHeadingWithBackButton from "../../../../components/Shared/BigHeadingWithBackButton";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Modal from "react-native-modal";
import LevelModal from "./LevelModal";
import PhaseModal from "./PhaseModal";
import FilterScreen from "./FilterScreen";
import { convertRecipeData } from "../../../../utils/challenges";
import RecipeTileSkeleton from "../../../../components/Nutrition/RecipeTileSkeleton";
import { db } from "../../../../../config/firebase";
import AsyncStorage from "@react-native-community/async-storage";
const { width } = Dimensions.get("window");
import _ from "lodash";
export default class FilterRecipeScreen extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isFilterVisible: false,
            isClickVisible: false,
            veganChecked: false,
            vegetarianChecked: false,
            glutenFree: false,
            dairyFree: false,
            gutHealth: false,
            phase1: false,
            phase2: false,
            phase3: false,
            title: undefined,
            data: [],
            tags: [],
            phase: [],
            category: [],
            nameCat: [],
            levelText: "",
            phaseText: "",
            todayRecommendedRecipe: [],
            defaultLevelTags: "",
            phaseDefaultTags: "",
            categoryName: [],
            activeChallengeUserData: undefined,
            currentChallengeDay: undefined
        };
    }

    // animated

    pluralTitle = (title) => {

        switch(title) {
            case 'Lunch':
                return 'Lunches'
            default:
                return `${title}s`
        }
    } 

    componentDidMount = () => {
        this.getDefaultCategoryTags()
        this.getAllRecipeData()
        
        const title = this.props.navigation.getParam("title", null)
        const paramState = {
            currentChallengeDay: this.props.navigation.getParam('currentChallengeDay', null),
            activeChallengeUserData: this.props.navigation.getParam('activeChallengeUserData', null),
            phaseDefaultTags: this.props.navigation.getParam('phaseDefaultTags', null),
            defaultLevelTags: this.props.navigation.getParam("defaultLevelTags", null),
            recipes: this.props.navigation.getParam("recipes", null),
            title: title,
            pluralTitle: this.pluralTitle(title)
        }

        const selectedItems = this.recipeMealGroupList(paramState.activeChallengeUserData, paramState.title, paramState.currentChallengeDay)
        const canFavouriteMoreRecipes = this.canFavouriteMoreRecipes(selectedItems)
        this.setState({
            ...paramState,
            selectedItems,
            canFavouriteMoreRecipes
        })
    }

    get maximumAllowedFavourites() {
        return this.props.navigation.getParam("configs", null)?.maximumAllowedFavourites ?? 1
    }

    canFavouriteMoreRecipes = (selectedItems) => {
        return selectedItems.length < this.maximumAllowedFavourites
    }

    handleBack = () => {
        const { navigation } = this.props;
        navigation.pop();
    };

    getAllRecipeData = () => {
        const allRecipeData = this.props.navigation.getParam("allRecipeData", [])
        this.setState({data: allRecipeData})
    }

    getDefaultCategoryTags = () => {
        const recipeData = this.props.navigation.getParam("todayRecommendedRecipe", null)
        const categoryName = [... new Set(recipeData.flatMap(recipe => recipe.tags))]
            .map(tag => {
                switch(tag) {
                    case 'V':
                        return tag.replace('V', 'Vegan')
                    case 'V+':
                        return tag.replace('V+', 'Vegetarian')
                    case 'GF':
                        return tag.replace('GF', 'Gluten Free')
                    case 'DF': 
                        return tag.replace('DF', 'Dairy Free')
                    case 'GH': 
                        return tag.replace('GH', 'Gut Health')
                }
            })
            .map(tag => ({ name: tag }))

        this.setState({
            categoryName,
            todayRecommendedRecipe: recipeData
        })
    }

    toggleModal = () => {
        this.setState({ isClickVisible: !this.state.isClickVisible });
    }

    toggleVegan = () => {
        this.setState({
            veganChecked: !this.state.veganChecked,
        })
        if (this.state.veganChecked === false) {
            this.setState({ category: [...this.state.category, { name: "Vegan" }] })
        } else {
            this.setState({
                category: this.state.category.filter((item) => {
                    return item.name !== "Vegan"
                })
            })
        }
    }

    toggleVegetarian = () => {
        
        let {vegetarianChecked, category} = this.state
        
       
        if (vegetarianChecked === false) {
            var updatedCategory = [...category, { name: "Vegetarian" }]
        } else {
            var updatedCategory = category.filter((item) => item.name !== "Vegetarian")
        }

        this.setState({ 
            vegetarianChecked: !vegetarianChecked,
            category: updatedCategory
        })
    }

    toggleGlutenFree = () => {
        this.setState({
            glutenFree: !this.state.glutenFree
        })
        if (this.state.glutenFree === false) {
            this.setState({ category: [...this.state.category, { name: "Gluten Free" }] })
        } else {
            this.setState({
                category: this.state.category.filter((item) => {
                    return item.name !== "Gluten Free"
                })
            })
        }
    }

    toggleDairyFree = () => {
        this.setState({
            dairyFree: !this.state.dairyFree
        })
        if (this.state.dairyFree === false) {
            this.setState({ category: [...this.state.category, { name: "Dairy Free" }] })
        } else {
            this.setState({
                category: this.state.category.filter((item) => {
                    return item.name !== "Dairy Free"
                })
            })
        }
    }

    toggleGutHealth = () => {
        this.setState({ gutHealth: !this.state.gutHealth })
        if (this.state.gutHealth === false) {
            this.setState({ category: [...this.state.category, { name: "Gut Health" }] })
        } else {
            this.setState({
                category: this.state.category.filter((item) => {
                    return item.name !== "Gut Health"
                })
            })
        }
    }

    togglePhase1 = () => {
        this.setState({
            phase1: !this.state.phase1,
        })
        if (this.state.phase1 === false) {
            this.setState({ phase: [...this.state.phase, { phaseTag: "P1" }], phaseText: 'P1' })
        } else {
            this.setState({
                phase: this.state.phase.filter((item) => {
                    return item.phaseTag !== "P1"
                })
            })
        }
    }

    togglePhase2 = () => {
        this.setState({
            phase2: !this.state.phase2,
        })
        if (this.state.phase2 === false) {
            this.setState({ phase: [...this.state.phase, { phaseTag: "P2" }], phaseText: 'P2' })
        } else {
            this.setState({
                phase: this.state.phase.filter((item) => {
                    return item.phaseTag !== "P2"
                })
            })
        }
    }

    togglePhase3 = () => {
        this.setState({
            phase3: !this.state.phase3,
        })
        if (this.state.phase3 === false) {
            this.setState({ phase: [...this.state.phase, { phaseTag: "P3" }], phaseText: 'P3' })
        } else {
            this.setState({
                phase: this.state.phase.filter((item) => {
                    return item.phaseTag !== "P3"
                })
            })
        }
    }

    closeModal = () => {
        this.setState({ isFilterVisible: false })
    }

    closePhaseModal = () => {
        this.setState({ isClickVisible: false })
    }

    filterOnBackdrop = () => {
        this.setState({ 
            isFilterVisible: !this.state.isFilterVisible,
            veganChecked: false,
            vegetarianChecked: false,
            glutenFree: false,
            dairyFree: false,
            gutHealth: false,
            phase1: false,
            phase2: false,
            phase3: false
        })
    }

    phaseOnBackdrop = () => {
        this.setState({ 
            isClickVisible: !this.state.isClickVisible, isFilterVisible: false,
            veganChecked: false,
            vegetarianChecked: false,
            glutenFree: false,
            dairyFree: false,
            gutHealth: false,
            phase1: false,
            phase2: false,
            phase3: false
        })
    }

    applyButton = (data) => {

        const { 
            levelText, phase, category,
            veganChecked, vegetarianChecked, glutenFree, dairyFree, gutHealth } = this.state
        
        const requiredFilteredTags = [
            {tag: levelText, isSelected: true},
            {tag: "V+", isSelected: veganChecked },
            {tag: "V", isSelected: vegetarianChecked },
            {tag: "GF", isSelected: glutenFree },
            {tag: "DF", isSelected: dairyFree },
            {tag: "GH", isSelected: gutHealth }
        ]
        .filter(t => t.isSelected) // Only have tags that are enabled
        .map(t => t.tag)

        const optionalFilteredTags = phase.map(p => p.phaseTag)

        // Filter all the recipes based on the given conditions above
        const filteredRecipes = data            
            .filter(recipe => [
                requiredFilteredTags.every(t => recipe.tags.includes(t)),
                optionalFilteredTags.length > 0 ? optionalFilteredTags.some(t => recipe.tags.includes(t)) : true
            ].every(satisfied => satisfied))

        this.setState({
            todayRecommendedRecipe: [...new Set(filteredRecipes)],
            isFilterVisible: false,
            isClickVisible: false,
            tags: [{ level: levelText, phase: phase }],
            phase: [],
            nameCat: category,
            category: []
        })
    }

    onClickFilter = () => {
        this.setState({
            isFilterVisible: !this.state.isFilterVisible,
            phase1: false,
            phase2: false,
            phase3: false,
            veganChecked: false,
            vegetarianChecked: false,
            glutenFree: false,
            dairyFree: false,
            gutHealth: false,
            levelText: "",
            phaseText: "",
        });
    }

    recipeMealGroupList = (activeChallengeUserData, title, currentChallengeDay) => {
        const faveRecipeCollection = activeChallengeUserData.faveRecipe
        const challengeDayIndex = currentChallengeDay - 1
        if(challengeDayIndex >= faveRecipeCollection.length) {
            return null
        }

        // We need to migrate old single string value to a list of ids
        return [faveRecipeCollection[challengeDayIndex].recipeMeal[title.toLowerCase()]]
            .flatMap(e => e)
            .filter(e => e?.trim())
    }

    onFavorite = async (item, activeChallengeUserData, title, currentChallengeDay) => {
        const faveRecipeCollection = activeChallengeUserData.faveRecipe
        const challengeDayIndex = currentChallengeDay - 1
        if(challengeDayIndex >= faveRecipeCollection.length) {
            return // nop
        }

        const newMealList = _.union(this.recipeMealGroupList(activeChallengeUserData, title, currentChallengeDay), [item.id])

        // Set new meal list
        faveRecipeCollection[challengeDayIndex].recipeMeal[title.toLowerCase()] = newMealList

        try {
            const uid = await AsyncStorage.getItem("uid");
            db.collection("users")
                .doc(uid)
                .collection("challenges")
                .doc(activeChallengeUserData.id)
                .set({ "faveRecipe": faveRecipeCollection }, { merge: true })
        } catch (err) {
            console.error(err)
        }

        this.setState({
            selectedItems: newMealList,
            canFavouriteMoreRecipes: this.canFavouriteMoreRecipes(newMealList)
        })
    }

    onRemoveFavorite = async (item, activeChallengeUserData, title, currentChallengeDay) => {
        const faveRecipeCollection = activeChallengeUserData.faveRecipe
        const challengeDayIndex = currentChallengeDay - 1
        if(challengeDayIndex >= faveRecipeCollection.length) {
            return // nop
        }

        const mealList = this.recipeMealGroupList(activeChallengeUserData, title, currentChallengeDay)
            .filter(e => e != item.id)
    
        // Set new meal list
        faveRecipeCollection[challengeDayIndex].recipeMeal[title.toLowerCase()] = mealList

        const id = activeChallengeUserData.id
        const uid = await AsyncStorage.getItem("uid");
        db.collection("users")
            .doc(uid)
            .collection("challenges")
            .doc(id)
            .set({ "faveRecipe": faveRecipeCollection }, { merge: true })

        this.setState({
            selectedItems: mealList,
            canFavouriteMoreRecipes: this.canFavouriteMoreRecipes(mealList)
        })
    }

    ifExistRecipe = (item) => {
        return this.state.selectedItems.includes(item.id) ?? false
    }

    onSelectHeart = (item, activeChallengeUserData, title, currentChallengeDay) => {
        if (this.ifExistRecipe(item, activeChallengeUserData, title, currentChallengeDay)) {
            this.onRemoveFavorite(item, activeChallengeUserData, title, currentChallengeDay)
        } else {
            this.onFavorite(item, activeChallengeUserData, title, currentChallengeDay)
        }
    }

    renderItem = ({ item }) => {
        const { activeChallengeUserData, currentChallengeDay } = this.state

        const faveRecipeItem = activeChallengeUserData.faveRecipe

        const color1 = []

        const tagList1 = sortBy(item.tags).filter((tag) => {

            if (tag === 'V') color1.push({ name: "VEG", color: '#469753' })
            if (tag === 'V+') color1.push({ name: "V", color: '#00C520' })
            if (tag === 'GF') color1.push({ name: tag, color: '#9403fc' })
            if (tag === 'DF') color1.push({ name: tag, color: '#B7782B' })
            if (tag === 'GH') color1.push({ name: tag, color: '#965734' })
        })

        const result = color1.splice(0, 3)
        const title = this.state.title

        const isSelected = this.ifExistRecipe(item, activeChallengeUserData, title, currentChallengeDay)
        const heartDisbaled = !this.state.canFavouriteMoreRecipes && !isSelected

        return (
            <FilterScreen
                faveRecipeItem={faveRecipeItem}
                favouritingDisabled={heartDisbaled}
                ifExistRecipe={isSelected}
                onSelectHeart={() => this.onSelectHeart(item, activeChallengeUserData, title, currentChallengeDay)}
                navigation={this.props.navigation}
                result={result}
                item={item}
                title={title}
            />
        )
    }

    clickModal = (data) => {

        return (
            <Modal
                //isVisible={this.state.isClickVisible}
                isVisible={this.state.isFilterVisible ? this.state.isClickVisible : this.state.isClickVisible}
                coverScreen={true}
                style={{ margin: 0, justifyContent: 'flex-end' }}
                animationIn="fadeInRightBig"
                animationOut="fadeOutDownBig"
                onBackdropPress={this.phaseOnBackdrop}
            >
                <PhaseModal
                    phase1={this.state.phase1}
                    phase2={this.state.phase2}
                    phase3={this.state.phase3}
                    togglePhase1={() => this.togglePhase1()}
                    togglePhase2={() => this.togglePhase2()}
                    togglePhase3={() => this.togglePhase3()}
                    applyButton={() => this.applyButton(data)}
                    headerButton={() => this.setState({ isClickVisible: !this.state.isClickVisible, isFilterVisible: !this.state.isFilterVisible })}
                    backButton={() => this.setState({ isFilterVisible: true, isClickVisible: false })}
                    // backButton={() => this.setState({ isClickVisible: !this.state.isClickVisible })}
                    closePhaseModal={() => this.closePhaseModal()}
                />
            </Modal>
        )
    }

    filterModal = (data) => {

        return (
            <Modal
                isVisible={this.state.isClickVisible ? !this.state.isFilterVisible : this.state.isFilterVisible}
                //isVisible={this.state.isFilterVisible}
                coverScreen={true}
                style={{ margin: 0, justifyContent: 'flex-end' }}
                animationIn="fadeInUpBig"
                animationOut="fadeOutDownBig"
                onBackdropPress={this.filterOnBackdrop}
            >
                <LevelModal
                    onPressLevel1={() => this.setState({
                        isFilterVisible: false,
                        isClickVisible: true,
                        levelText: "L1"
                    })}
                    onPressLevel2={() => this.setState({
                        isFilterVisible: false,
                        isClickVisible: true,
                        levelText: "L2"
                    })}
                    onPressLevel3={() => this.setState({
                        isFilterVisible: false,
                        isClickVisible: true,
                        levelText: "L3"
                    })}
                    veganChecked={this.state.veganChecked}
                    vegetarianChecked={this.state.vegetarianChecked}
                    glutenFreeChecked={this.state.glutenFree}
                    dairyFreeChecked={this.state.dairyFree}
                    gutHealthChecked={this.state.gutHealth}
                    postpartumChecked={this.state.levelText == "PP"}
                    phase1={this.state.phase1}
                    phase2={this.state.phase2}
                    phase3={this.state.phase3}
                    toggleVegan={() => this.toggleVegan()}
                    toggleVegetarian={() => this.toggleVegetarian()}
                    toggleGlutenFree={() => this.toggleGlutenFree()}
                    toggleDairyFree={() => this.toggleDairyFree()}
                    toggleGutHealth={() => this.toggleGutHealth()}
                    togglePostpartumChecked={() => {
                        
                        const newisCurrentlyOn = this.state.levelText != "PP"
                        this.setState({
                            levelText: newisCurrentlyOn ? "PP" : "",
                            phase1: newisCurrentlyOn,
                            phase: newisCurrentlyOn ? [{phaseTag: "P1"}] : [],
                            phaseText: newisCurrentlyOn ? 'P1' : "",
                            phase2: false, 
                            phase3: false
                        })
                    }}
                    closeModal={() => this.closeModal()}
                    applyButton={() => this.applyButton(data)}
                />
            </Modal>
        )
    }

    keyExtractor = (index) => String(index);

    render() {
        const {
            data,
            tags,
            nameCat,
            title,
            pluralTitle,
            todayRecommendedRecipe,
            defaultLevelTags,
            phaseDefaultTags,
            categoryName,
            loading,
            selectedItems
        } = this.state

        const skeleton = (
            <View style={styles.recipeTileSkeletonContainer}>
                <RecipeTileSkeleton />
                <RecipeTileSkeleton />
                <RecipeTileSkeleton />
            </View>
        );

        return (
            <View style={globalStyle.container}>
                <View style={styles.customContainerStyle}>
                    {/* BigHeadText */}
                    <View>
                        <BigHeadingWithBackButton
                            isBigTitle={true}
                            isBackButton={true}
                            onPress={this.handleBack}
                            backButtonText="Back to Challenge"
                            customContainerStyle={{ bottom: 25 }}
                        />
                        <Text style={{ bottom: 60, fontSize: 30, fontFamily: fonts.bold }}>{title}</Text>
                    </View>

                    {/* Filter Button */}
                    <View style={{ marginTop: 10, width: 100 }}>
                        <TouchableOpacity
                            onPress={this.onClickFilter}
                            style={styles.oblongBtnStyle}>
                            <Text
                                style={{
                                    marginTop: 10,
                                    fontSize: 12,
                                    fontFamily: fonts.bold,
                                    textTransform: 'uppercase',
                                }}>
                                Filter
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    <View
                        style={{ flexDirection: 'row', marginVertical: 10, marginBottom: 20, top: 0, height: 20 }}>
                        {
                            tags.length ?
                                tags.map((item, index) => (
                                    <View
                                        key={index}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            backgroundColor: '#e3e3e3',
                                            borderRadius: 50,
                                            marginRight: 7,
                                        }}
                                    >
                                        <Text style={{ marginHorizontal: 10, marginVertical: 5, fontSize: 9, }}>{item.level} - {item.phase.map((el) => el.phaseTag + ' ')}</Text>
                                        <TouchableOpacity
                                            onPress={() => { this.setState({ tags: this.state.tags.filter((item) => item.level !== item.level) }) }}
                                        >
                                            <Icon name='cross' size={8} color={colors.black} style={{ marginRight: 10 }} />
                                        </TouchableOpacity>
                                    </View>
                                ))
                                :
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: '#e3e3e3',
                                        borderRadius: 50,
                                        marginRight: 7,
                                    }}
                                >
                                    <Text style={{ marginHorizontal: 10, marginVertical: 5, fontSize: 9, }}>{defaultLevelTags}{defaultLevelTags === 'L1' ? ' - ' + phaseDefaultTags : null}</Text>
                                </View>
                        }
                        {
                            nameCat.length ?
                                nameCat.map((cat, index) => (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            backgroundColor: '#e3e3e3',
                                            borderRadius: 50,
                                            marginRight: 7,
                                        }}
                                        key={index}
                                    >
                                        <Text style={{ marginHorizontal: 10, marginVertical: 5, fontSize: 9, }}>{cat.name}</Text>
                                        <TouchableOpacity
                                            onPress={() => { this.setState({ nameCat: this.state.nameCat.filter((item) => item.name !== cat.name) }) }}
                                        >
                                            <Icon name='cross' size={8} color={colors.black} style={{ marginRight: 10 }} />
                                        </TouchableOpacity>
                                    </View>
                                ))
                                :
                                categoryName.map((cat, index) => (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            backgroundColor: '#e3e3e3',
                                            borderRadius: 50,
                                            marginRight: 7,
                                        }}
                                        key={index}
                                    >
                                        <Text style={{ marginHorizontal: 10, marginVertical: 5, fontSize: 9, }}>{cat.name}</Text>
                                    </View>
                                ))
                        }
                    </View>
                </ScrollView>
                {this.maximumAllowedFavourites > 1 && (
                    <View style={[styles.maxRecipesBanner]}>
                        <Text style={styles.maxRecipesBannerText}>
                            You have selected {selectedItems?.length}/{this.maximumAllowedFavourites} {pluralTitle?.toLowerCase() ?? "recipes"}
                        </Text>
                        <Text style={styles.maxRecipesBannerSubheading}>
                            Deselect the recipes and choose again to change your selection.
                        </Text>
                    </View>)
                }
                {
                    loading ?
                        skeleton
                        :
                        todayRecommendedRecipe.length > 0
                            ?
                            <FlatList
                                contentContainerStyle={styles.scrollView}
                                data={todayRecommendedRecipe}
                                keyExtractor={(res) => res.id}
                                renderItem={this.renderItem}
                                showsVerticalScrollIndicator={false}
                                removeClippedSubviews={false}
                                maxToRenderPerBatch={10}
                            />
                            :
                            <View
                                style={{
                                    height: hp('65%'),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontSize: 15,
                                        fontFamily: fonts.bold,
                                        textTransform: 'uppercase',
                                    }}>
                                    no recipes are available
                                </Text>
                            </View>
                }
                {
                    this.state.isFilterVisible && (
                        this.filterModal(data)
                    )
                }
                {
                    this.state.isClickVisible && (
                        this.clickModal(data)
                    )
                }
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
        marginHorizontal: wp('45%'),
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
    },
    card: {
        width: width - 50,
        borderRadius: 3,
        overflow: 'hidden',
        borderWidth: 0,
        elevation: 0,
    },
    button: {
        alignItems: "center",
        backgroundColor: '#4d4c4c',
        padding: 10,
    },
    maxRecipesBanner: {
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: colors.white,    
        borderColor: colors.black,
        borderWidth: 1,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 11.95,
        justifyContent: 'space-between',
        marginTop: 8,
        padding: 16,
    },
    maxRecipesBannerText: {
        fontFamily: fonts.StyreneAWebRegular,
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 4
    },
    maxRecipesBannerSubheading: {
        fontSize: 10,
        fontFamily: fonts.SimplonMonoLight,
        textAlign: 'center'
    }
})