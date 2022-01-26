import React from "react";
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Dimensions,
    FlatList,
    Text,
    ScrollView,
    Alert,
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
            challengeRecipe: [],
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

    onFocusFunction() {
        this.getDefaultCategoryTags()
        this.getAllRecipeData()
        this.setState({
            currentChallengeDay: this.props.navigation.getParam('currentChallengeDay', null),
            activeChallengeUserData: this.props.navigation.getParam('activeChallengeUserData', null),
            phaseDefaultTags: this.props.navigation.getParam('phaseDefaultTags', null),
            defaultLevelTags: this.props.navigation.getParam("defaultLevelTags", null),
            challengeRecipe: this.props.navigation.getParam("challengeAllRecipe", null),
            recipes: this.props.navigation.getParam("recipes", null),
            title: this.props.navigation.getParam("title", null),
        });
    }


    componentDidMount = () => {
        this.onFocusFunction();
    };

    handleBack = () => {
        const { navigation } = this.props;
        navigation.pop();
    };

    getAllRecipeData = () => {
        const allRecipeData = this.props.navigation.getParam("todayRecommendedRecipe", null)
        const dupId = []

        allRecipeData.forEach((res) => {
            dupId.push(res.id)
        })

        const uniqId = [...new Set(dupId)]

        convertRecipeData(uniqId).then(res => {
            this.setState({
                data: res.recipeResult,
            })
        })
    }

    getDefaultCategoryTags = () => {
        this.setState({ loading: true })
        const recipeData = this.props.navigation.getParam("todayRecommendedRecipe", null)

        const categoryName = []
        const dupId = []

        recipeData.forEach((res) => {
            if (res.tags) {
                res.tags.filter((item) => {
                    if (item === 'V') categoryName.push(item.replace('V', 'Vegan'))
                    if (item === 'V+') categoryName.push(item.replace('V+', 'Vegetarian'))
                    if (item === 'GF') categoryName.push(item.replace('GF', 'Gluten Free'))
                    if (item === 'DF') categoryName.push(item.replace('DF', 'Dairy Free'))
                    if (item === 'GH') categoryName.push(item.replace('GH', 'Gut Health'))
                })
            }

            dupId.push(res.id)
        })

        const uniqId = [...new Set(dupId)]

        convertRecipeData(uniqId).then(res => {
            this.setState({
                todayRecommendedRecipe: res.recipeResult,
                loading: false
            })
        })

        const uniq = [...new Set(categoryName)]
        const result = []
        uniq.forEach((res) => {
            result.push({ name: res })
        })

        this.setState({
            categoryName: result
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
        this.setState({
            vegetarianChecked: !this.state.vegetarianChecked
        })
        if (this.state.vegetarianChecked === false) {
            this.setState({ category: [...this.state.category, { name: "Vegetarian" }] })
        } else {
            this.setState({
                category: this.state.category.filter((item) => {
                    return item.name !== "Vegetarian"
                })
            })
        }
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
        this.setState({
            gutHealth: !this.state.gutHealth
        })
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
        this.setState({ isFilterVisible: !this.state.isFilterVisible })
        this.setState({ veganChecked: false })
        this.setState({ vegetarianChecked: false })
        this.setState({ glutenFree: false })
        this.setState({ dairyFree: false })
        this.setState({ gutHealth: false })
        this.setState({ phase1: false })
        this.setState({ phase2: false })
        this.setState({ phase3: false })
    }

    phaseOnBackdrop = () => {
        this.setState({ isClickVisible: !this.state.isClickVisible, isFilterVisible: false })
        this.setState({ phase1: false })
        this.setState({ phase2: false })
        this.setState({ phase3: false })
        this.setState({ veganChecked: false })
        this.setState({ vegetarianChecked: false })
        this.setState({ glutenFree: false })
        this.setState({ dairyFree: false })
        this.setState({ gutHealth: false })
    }

    applyButton = (data, challengeRecipeData) => {

        const { levelText } = this.state
        const tagList = []
        const recipePhases = []
        const recipePhaseResult = []

        if (levelText === 'L1') {
            let recipePhase = []
            challengeRecipeData.level1.forEach(res => {
                data.forEach((resTags) => {
                    try {
                        resTags.tags.filter((resTag) => {
                            if (res.levelTags === resTag) {
                                if (this.state.phase1 === true) {
                                    if (resTags.tags.includes(this.state.phaseText)) {
                                        recipePhase.push(resTags)
                                    }
                                }
                                if (this.state.phase2 === true) {
                                    if (resTags.tags.includes(this.state.phaseText)) {
                                        recipePhase.push(resTags)
                                    }
                                }
                                if (this.state.phase3 === true) {
                                    if (resTags.tags.includes(this.state.phaseText)) {
                                        recipePhase.push(resTags)
                                    }
                                }
                            }
                        })
                    } catch (err) {

                    }
                })
            })

            sortBy(recipePhase).filter((recipe) => {
                for (let i = 0; i < recipe.tags.length; i++) {
                    if (this.state.veganChecked === true) {
                        if (recipe.tags[i] === 'V') {
                            tagList.push(recipe)
                        }
                    }
                    if (this.state.vegetarianChecked === true) {
                        if (recipe.tags[i] === 'V+') {
                            tagList.push(recipe)
                        }
                    }
                    if (this.state.glutenFree === true) {
                        if (recipe.tags[i] === 'GF') {
                            tagList.push(recipe)
                        }
                    }
                    if (this.state.dairyFree === true) {
                        if (recipe.tags[i] === 'DF') {
                            tagList.push(recipe)
                        }
                    }
                    if (this.state.gutHealth === true) {
                        if (recipe.tags[i] === 'GH') {
                            tagList.push(recipe)
                        }
                    }
                }
            });

            sortBy(recipePhase).filter((recipe) => {
                for (let i = 0; i < recipe.tags.length; i++) {
                    if (this.state.phase1 === true) {
                        if (recipe.tags[i] === this.state.phaseText) {
                            recipePhases.push(recipe)
                        }
                    }
                    if (this.state.phase2 === true) {
                        if (recipe.tags[i] === this.state.phaseText) {
                            recipePhases.push(recipe)
                        }
                    }
                    if (this.state.phase3 === true) {
                        if (recipe.tags[i] === this.state.phaseText) {
                            recipePhases.push(recipe)
                        }
                    }
                }
            });

        }

        if (levelText === 'L2') {
            let recipePhase = []
            challengeRecipeData.level2.forEach(res => {
                data.forEach((resTags) => {
                    try {
                        resTags.tags.filter((resTag) => {
                            if (res.levelTags === resTag) {
                                if (this.state.phase1 === true) {
                                    recipePhase.push(resTags)
                                    recipePhases.push(resTags)
                                }
                                if (this.state.phase2 === true) {
                                    recipePhase.push(resTags)
                                    recipePhases.push(resTags)
                                }
                                if (this.state.phase3 === true) {
                                    recipePhase.push(resTags)
                                    recipePhases.push(resTags)
                                }
                            }
                        })
                    } catch (err) {

                    }
                })
            })

            sortBy(recipePhase).filter((recipe) => {
                for (let i = 0; i < recipe.tags.length; i++) {
                    if (this.state.veganChecked === true) {
                        if (recipe.tags[i] === 'V') {
                            tagList.push(recipe)
                        }
                    }
                    if (this.state.vegetarianChecked === true) {
                        if (recipe.tags[i] === 'V+') {
                            tagList.push(recipe)
                        }
                    }
                    if (this.state.glutenFree === true) {
                        if (recipe.tags[i] === 'GF') {
                            tagList.push(recipe)
                        }
                    }
                    if (this.state.dairyFree === true) {
                        if (recipe.tags[i] === 'DF') {
                            tagList.push(recipe)
                        }
                    }
                    if (this.state.gutHealth === true) {
                        if (recipe.tags[i] === 'GH') {
                            tagList.push(recipe)
                        }
                    }
                }
            });
        }

        if (levelText === 'L3') {
            let recipePhase = []

            challengeRecipeData.level3.forEach(res => {
                data.forEach((resTags) => {
                    try {
                        resTags.tags.filter((resTag) => {
                            if (res.levelTags === resTag) {
                                if (this.state.phase1 === true) {
                                    recipePhase.push(resTags)
                                    recipePhases.push(resTags)
                                }
                                if (this.state.phase2 === true) {
                                    recipePhase.push(resTags)
                                    recipePhases.push(resTags)
                                }
                                if (this.state.phase3 === true) {
                                    recipePhase.push(resTags)
                                    recipePhases.push(resTags)
                                }
                            }
                        })
                    } catch (err) {

                    }
                })
            })

            sortBy(recipePhase).filter((recipe) => {
                for (let i = 0; i < recipe.tags.length; i++) {
                    if (this.state.veganChecked === true) {
                        if (recipe.tags[i] === 'V') {
                            tagList.push(recipe)
                        }
                    }
                    if (this.state.vegetarianChecked === true) {
                        if (recipe.tags[i] === 'V+') {
                            tagList.push(recipe)
                        }
                    }
                    if (this.state.glutenFree === true) {
                        if (recipe.tags[i] === 'GF') {
                            tagList.push(recipe)
                        }
                    }
                    if (this.state.dairyFree === true) {
                        if (recipe.tags[i] === 'DF') {
                            tagList.push(recipe)
                        }
                    }
                    if (this.state.gutHealth === true) {
                        if (recipe.tags[i] === 'GH') {
                            tagList.push(recipe)
                        }
                    }
                }
            });
        }

        const uniqPhase = [...new Set(recipePhases)]
        const uniqCat = [...new Set(tagList)]

        this.setState({
            todayRecommendedRecipe: this.state.gutHealth || this.state.veganChecked || this.state.vegetarianChecked || this.state.glutenFree || this.state.dairyFree ? uniqCat : uniqPhase,
            isFilterVisible: false,
            isClickVisible: false,
            tags: [{ level: this.state.levelText, phase: this.state.phase }],
            phase: [],
            nameCat: this.state.category,
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

    onFavorite = async (item, activeChallengeUserData, title, currentChallengeDay) => {
        const recipeMeal = activeChallengeUserData.faveRecipe

        try {
            if (title.toLowerCase() === 'breakfast') {
                recipeMeal[currentChallengeDay - 1].recipeMeal.breakfast = item.id
            }
            if (title.toLowerCase() === 'lunch') {
                recipeMeal[currentChallengeDay - 1].recipeMeal.lunch = item.id
            }
            if (title.toLowerCase() === 'dinner') {
                recipeMeal[currentChallengeDay - 1].recipeMeal.dinner = item.id

            }
            if (title.toLowerCase() === 'snack') {
                recipeMeal[currentChallengeDay - 1].recipeMeal.snack = item.id

            }
            if (title.toLowerCase() === 'post workout') {
                recipeMeal[currentChallengeDay - 1].recipeMeal.drink = item.id

            }
            if (title.toLowerCase() === 'preworkout') {
                recipeMeal[currentChallengeDay - 1].recipeMeal.preworkout = item.id

            }
            if (title.toLowerCase() === 'treats') {
                recipeMeal[currentChallengeDay - 1].recipeMeal.treats = item.id

            }
        } catch (err) {

        }


        const id = activeChallengeUserData.id
        const uid = await AsyncStorage.getItem("uid");
        const activeChallengeUserRef = db
            .collection("users")
            .doc(uid)
            .collection("challenges")
            .doc(id)

        try {
            if (title.toLowerCase() === 'breakfast') {
                activeChallengeUserRef.set({ "faveRecipe": recipeMeal }, { merge: true })
            }
            if (title.toLowerCase() === 'lunch') {
                activeChallengeUserRef.set({ "faveRecipe": recipeMeal }, { merge: true })
            }
            if (title.toLowerCase() === 'dinner') {
                activeChallengeUserRef.set({ "faveRecipe": recipeMeal }, { merge: true })
            }
            if (title.toLowerCase() === 'snack') {
                activeChallengeUserRef.set({ "faveRecipe": recipeMeal }, { merge: true })
            }
            if (title.toLowerCase() === 'post workout') {
                activeChallengeUserRef.set({ "faveRecipe": recipeMeal }, { merge: true })
            }
            if (title.toLowerCase() === 'preworkout') {
                activeChallengeUserRef.set({ "faveRecipe": recipeMeal }, { merge: true })
            }
            if (title.toLowerCase() === 'treats') {
                activeChallengeUserRef.set({ "faveRecipe": recipeMeal }, { merge: true })
            }
        } catch (err) {

        }


    }

    onRemoveFavorite = async (item, activeChallengeUserData, title, currentChallengeDay) => {

        const recipeMeal = activeChallengeUserData.faveRecipe

        try {
            if (title.toLowerCase() === 'breakfast') {
                recipeMeal[currentChallengeDay - 1].recipeMeal.breakfast = ""
            }
            if (title.toLowerCase() === 'lunch') {
                recipeMeal[currentChallengeDay - 1].recipeMeal.lunch = ""
            }
            if (title.toLowerCase() === 'dinner') {
                recipeMeal[currentChallengeDay - 1].recipeMeal.dinner = ""
            }
            if (title.toLowerCase() === 'snack') {
                recipeMeal[currentChallengeDay - 1].recipeMeal.snack = ""

            }
            if (title.toLowerCase() === 'drink') {
                recipeMeal[currentChallengeDay - 1].recipeMeal.drink = ""

            }
            if (title.toLowerCase() === 'preworkout') {
                recipeMeal[currentChallengeDay - 1].recipeMeal.preworkout = ""

            }
            if (title.toLowerCase() === 'treats') {
                recipeMeal[currentChallengeDay - 1].recipeMeal.treats = ""

            }
        } catch (err) {

        }


        const id = activeChallengeUserData.id
        const uid = await AsyncStorage.getItem("uid");
        const activeChallengeUserRef = db
            .collection("users")
            .doc(uid)
            .collection("challenges")
            .doc(id)

        try {
            if (title.toLowerCase() === 'breakfast') {
                activeChallengeUserRef.set({ "faveRecipe": recipeMeal }, { merge: true })
            }
            if (title.toLowerCase() === 'lunch') {
                activeChallengeUserRef.set({ "faveRecipe": recipeMeal }, { merge: true })
            }
            if (title.toLowerCase() === 'dinner') {
                activeChallengeUserRef.set({ "faveRecipe": recipeMeal }, { merge: true })
            }
            if (title.toLowerCase() === 'snack') {
                activeChallengeUserRef.set({ "faveRecipe": recipeMeal }, { merge: true })
            }
            if (title.toLowerCase() === 'drink') {
                activeChallengeUserRef.set({ "faveRecipe": recipeMeal }, { merge: true })
            }
            if (title.toLowerCase() === 'preworkout') {
                activeChallengeUserRef.set({ "faveRecipe": recipeMeal }, { merge: true })
            }
            if (title.toLowerCase() === 'treats') {
                activeChallengeUserRef.set({ "faveRecipe": recipeMeal }, { merge: true })
            }
        } catch (err) {

        }
    }

    ifExist = (item, activeChallengeUserData, title, currentChallengeDay) => {
        let result = false
        const recipeMeal = activeChallengeUserData.faveRecipe

        try {
            try {
                if (title.toLowerCase() === 'breakfast') {
                    const res = recipeMeal[currentChallengeDay - 1].recipeMeal.breakfast
                    if (res === item.id) {
                        result = true
                    } else {
                        result = false
                    }
                }
            } catch (err) { }

            try {
                if (title.toLowerCase() === 'lunch') {
                    const res = recipeMeal[currentChallengeDay - 1].recipeMeal.lunch
                    if (res === item.id) {
                        result = true
                    } else {
                        result = false
                    }
                }
            } catch (err) { }

            try {
                if (title.toLowerCase() === 'dinner') {
                    const res = recipeMeal[currentChallengeDay - 1].recipeMeal.dinner
                    if (res === item.id) {
                        result = true
                    } else {
                        result = false
                    }
                }
            } catch (err) { }

            try {
                if (title.toLowerCase() === 'snack') {
                    const res = recipeMeal[currentChallengeDay - 1].recipeMeal.snack
                    if (res === item.id) {
                        result = true
                    } else {
                        result = false
                    }
                }
            } catch (err) { }

            try {
                if (title.toLowerCase() === 'post workout') {
                    const res = recipeMeal[currentChallengeDay - 1].recipeMeal.drink
                    if (res === item.id) {
                        result = true
                    } else {
                        result = false
                    }
                }
            } catch (err) { }

            try {
                if (title.toLowerCase() === 'preworkout') {
                    const res = recipeMeal[currentChallengeDay - 1].recipeMeal.preworkout
                    if (res === item.id) {
                        result = true
                    } else {
                        result = false
                    }
                }
            } catch (err) { }

            try {
                if (title.toLowerCase() === 'treats') {
                    const res = recipeMeal[currentChallengeDay - 1].recipeMeal.treats
                    if (res === item.id) {
                        result = true
                    } else {
                        result = false
                    }
                }
            } catch (err) { }

        } catch (err) {

        }

        this.setState({
            recipeIsExist: result
        })

    }

    ifExistRecipe = (item, activeChallengeUserData, title, currentChallengeDay) => {
        let result = false
        const recipeMeal = activeChallengeUserData.faveRecipe

        try {
            try {
                if (title.toLowerCase() === 'breakfast') {
                    const res = recipeMeal[currentChallengeDay - 1].recipeMeal.breakfast
                    if (res === item.id) {
                        result = true
                    } else {
                        result = false
                    }
                }
            } catch (err) { }

            try {
                if (title.toLowerCase() === 'lunch') {
                    const res = recipeMeal[currentChallengeDay - 1].recipeMeal.lunch
                    if (res === item.id) {
                        result = true
                    } else {
                        result = false
                    }
                }
            } catch (err) { }

            try {
                if (title.toLowerCase() === 'dinner') {
                    const res = recipeMeal[currentChallengeDay - 1].recipeMeal.dinner
                    if (res === item.id) {
                        result = true
                    } else {
                        result = false
                    }
                }
            } catch (err) { }

            try {
                if (title.toLowerCase() === 'snack') {
                    const res = recipeMeal[currentChallengeDay - 1].recipeMeal.snack
                    if (res === item.id) {
                        result = true
                    } else {
                        result = false
                    }
                }
            } catch (err) { }

            try {
                if (title.toLowerCase() === 'post workout') {
                    const res = recipeMeal[currentChallengeDay - 1].recipeMeal.drink
                    if (res === item.id) {
                        result = true
                    } else {
                        result = false
                    }
                }
            } catch (err) { }

            try {
                if (title.toLowerCase() === 'preworkout') {
                    const res = recipeMeal[currentChallengeDay - 1].recipeMeal.preworkout
                    if (res === item.id) {
                        result = true
                    } else {
                        result = false
                    }
                }
            } catch (err) { }

            try {
                if (title.toLowerCase() === 'treats') {
                    const res = recipeMeal[currentChallengeDay - 1].recipeMeal.treats
                    if (res === item.id) {
                        result = true
                    } else {
                        result = false
                    }
                }
            } catch (err) { }

        } catch (err) {

        }

        return result
    }

    onSelectHeart = (item, activeChallengeUserData, title, currentChallengeDay) => {
        if (this.state.recipeIsExist) {
            this.onRemoveFavorite(item, activeChallengeUserData, title, currentChallengeDay)
        } else {
            this.onFavorite(item, activeChallengeUserData, title, currentChallengeDay)
        }
        this.ifExist(item, activeChallengeUserData, title, currentChallengeDay)
    }

    renderItem = ({ item }) => {
        const { activeChallengeUserData, currentChallengeDay } = this.state

        const faveRecipeItem = activeChallengeUserData.faveRecipe

        const color1 = []

        const tagList1 = sortBy(item.tags).filter((tag) => {

            if (tag === 'V') color1.push({ name: tag, color: '#00C520' })
            if (tag === 'V+') color1.push({ name: tag.replace('V+', 'VEG'), color: '#9403fc' })
            if (tag === 'GF') color1.push({ name: tag, color: '#469753' })
            if (tag === 'DF') color1.push({ name: tag, color: '#B7782B' })
            if (tag === 'GH') color1.push({ name: tag, color: '#965734' })
        })

        const result = color1.splice(0, 3)
        const title = this.state.title

        return (
            <FilterScreen
                faveRecipeItem={faveRecipeItem}
                ifExistRecipe={() => this.ifExistRecipe(item, activeChallengeUserData, title, currentChallengeDay)}
                onSelectHeart={() => this.onSelectHeart(item, activeChallengeUserData, title, currentChallengeDay)}
                navigation={this.props.navigation}
                result={result}
                item={item}
                title={title}
            />
        )
    };

    clickModal = (data, challengeRecipeData) => {

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
                    applyButton={() => this.applyButton(data, challengeRecipeData)}
                    headerButton={() => this.setState({ isClickVisible: !this.state.isClickVisible, isFilterVisible: !this.state.isFilterVisible })}
                    backButton={() => this.setState({ isFilterVisible: true, isClickVisible: false })}
                    // backButton={() => this.setState({ isClickVisible: !this.state.isClickVisible })}
                    closePhaseModal={() => this.closePhaseModal()}
                />
            </Modal>
        )
    }

    filterModal = (challengeRecipeData, data) => {

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
                    phase1={this.state.phase1}
                    phase2={this.state.phase2}
                    phase3={this.state.phase3}
                    toggleVegan={() => this.toggleVegan()}
                    toggleVegetarian={() => this.toggleVegetarian()}
                    toggleGlutenFree={() => this.toggleGlutenFree()}
                    toggleDairyFree={() => this.toggleDairyFree()}
                    toggleGutHealth={() => this.toggleGutHealth()}
                    closeModal={() => this.closeModal()}
                    applyButton={() => this.applyButton(data, challengeRecipeData)}
                />
            </Modal>
        )
    }

    keyExtractor = (index) => String(index);

    render() {
        const {
            data,
            challengeRecipe,
            tags,
            nameCat,
            title,
            todayRecommendedRecipe,
            defaultLevelTags,
            phaseDefaultTags,
            categoryName,
            loading,
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
                <View
                    style={styles.customContainerStyle}
                >
                    {/* BigHeadText */}
                    <View>
                        <BigHeadingWithBackButton
                            isBigTitle={true}
                            isBackButton={true}
                            onPress={this.handleBack}
                            backButtonText="Back to Challenge"
                            isBackButton={true}
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
                                }}
                            >
                                Filter
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                // style={{
                //     paddingVertical: wp("3%"),
                // }}
                >
                    <View
                        style={{ flexDirection: 'row', marginVertical: 10, marginBottom: 20, top: 0, height: 20 }}
                    >
                        {
                            tags.length ?
                                tags.map((item) => (
                                    <View
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
                                renderItem={(item) => this.renderItem(item)}
                                showsVerticalScrollIndicator={false}
                                removeClippedSubviews={false}
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
                                    }}
                                >
                                    no recipes are available
                                </Text>
                            </View>
                }
                {
                    this.state.isFilterVisible && (
                        this.filterModal(challengeRecipe, data)
                    )
                }
                {
                    this.state.isClickVisible && (
                        this.clickModal(data, challengeRecipe)
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
    }

})