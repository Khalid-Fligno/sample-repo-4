import React from "react";
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Dimensions,
    FlatList,
    Text,
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

const { width } = Dimensions.get("window");

export default class FilterRecipeScreen extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            recipes: [],
            loading: false,
            filterIndex: 0,
            isFilterVisible: false,
            isClickVisible: false,
            veganChecked: false,
            vegetarianChecked: false,
            glutaFree: false,
            dairyFree: false,
            gutHealth: false,
            phase1: false,
            phase2: false,
            phase3: false,
            title: undefined,
            data: [],
            allData: [],
            challengeRecipe: [],
            levelButtonData: []
        };
    }

    onFocusFunction() {
        this.setState({ loading: true });
        this.setState({
            challengeRecipe: this.props.navigation.getParam("challengeAllRecipe", null),
            data: this.props.navigation.getParam("allRecipeData", null),
            allData: this.props.navigation.getParam("recipes", null),
            recipes: this.props.navigation.getParam("recipes", null),
            title: this.props.navigation.getParam("title", null),
            loading: false
        });
    }
    componentDidMount = async () => {
        this.onFocusFunction();
    };

    handleBack = () => {
        const { navigation } = this.props;
        navigation.pop();
    };

    toggleModal = () => {
        this.setState({ isClickVisible: !this.state.isClickVisible });
    }

    toggleLevelChallengeData = () => {
        const { challengeRecipe } = this.state

        this.setState({
            levelButtonData: challengeRecipe.level1
        })
    }

    toggleVegan = () => {
        this.setState({
            veganChecked: !this.state.veganChecked
        })
    }

    toggleVegetarian = () => {
        this.setState({
            vegetarianChecked: !this.state.vegetarianChecked
        })
    }

    toggleGlutaFree = () => {
        this.setState({
            glutaFree: !this.state.glutaFree
        })
    }

    toggleDairyFree = () => {
        this.setState({
            dairyFree: !this.state.dairyFree
        })
    }

    togglePhase1 = () => {
        this.setState({ 
            phase1: !this.state.phase1 
        })
    }

    togglePhase2 = () => {
        this.setState({ 
            phase2: !this.state.phase2 
        })
    }

    togglePhase3 = () => {
        this.setState({ 
            phase3: !this.state.phase3 
        })
    }

    toggleGutHealth = () => {
        this.setState({
            gutHealth: !this.state.gutHealth
        })
    }

    closeModal= () =>{
        this.setState({isFilterVisible: false})
    }
    closePhaseModal = () =>{
        this.setState({isClickVisible: false})
    }

    checkedBox = () => {
        this.setState({veganChecked: !this.state.veganChecked})
    }
    checkVegetarian =() =>{
        this.setState({vegetarianChecked: !this.state.vegetarianChecked})

    }

    checkGluta = () =>{
        this.setState({glutaFree: !this.state.glutaFree})
    }

    checkDairy = () =>{
        this.setState({dairyFree: !this.state.dairyFree})
    }

    checkGut = () =>{
        this.setState({gutHealth: !this.state.gutHealth})
    }
    filterOnBackdrop = () =>{
        this.setState({ isFilterVisible: !this.state.isFilterVisible })
        this.setState({ veganChecked: false})
        this.setState({vegetarianChecked: false})
        this.setState({glutaFree: false})
        this.setState({dairyFree: false})
        this.setState({gutHealth: false})
        this.setState({phase1: false})
        this.setState({phase2: false})
        this.setState({phase3: false})

    }

    phaseOnBackdrop = () =>{
        this.setState({ isClickVisible: !this.state.isClickVisible, isFilterVisible: false })
        this.setState({phase1: false})
        this.setState({phase2: false})
        this.setState({phase3: false})
        this.setState({ veganChecked: false})
        this.setState({vegetarianChecked: false})
        this.setState({glutaFree: false})
        this.setState({dairyFree: false})
        this.setState({gutHealth: false})



    }


    applyButton = (phases, datas, recipes) => {
        // datas all recipe

        const recipeList = []
        const tagList = []

        datas.forEach(element => {

            recipeList.push({ id: element.id, tags: element.tags })
        });

        const phaseList = sortBy(phases).filter((phase) => {

            if (this.state.phase1 === true) {
                if (phase.displayName === 'Phase1') {
                    var resList = []
                    recipeList.forEach((el) => {
                        resList.push(el.id)
                    })

                    var arr = resList.concat(phase.meals);
                    var sorted_arr = arr.sort();
                    var results = [];
                    for (var i = 0; i < arr.length; i++) {
                        if (sorted_arr[i + 1] == sorted_arr[i]) {
                            results.push({ id: sorted_arr[i] });
                        }
                    }

                    for (var i = 0; i < results.length; i++) {
                        recipeList.map(list => {
                            if (list.id === results[i].id) {
                                tagList.push(list)
                            }
                        })
                    }
                }
            }
            if (this.state.phase2 === true) {
                if (phase.displayName === 'Phase2') {
                    var resList = []
                    recipeList.forEach((el) => {
                        resList.push(el.id)
                    })

                    var arr = resList.concat(phase.meals);
                    var sorted_arr = arr.sort();
                    var results = [];
                    for (var i = 0; i < arr.length; i++) {
                        if (sorted_arr[i + 1] == sorted_arr[i]) {
                            results.push({ id: sorted_arr[i] });
                        }
                    }

                    for (var i = 0; i < results.length; i++) {
                        recipeList.map(list => {
                            if (list.id === results[i].id) {
                                tagList.push(list)
                            }
                        })
                    }
                }
            }
            if (this.state.phase3 === true) {
                if (phase.displayName === 'Phase3') {
                    var resList = []
                    recipeList.forEach((el) => {
                        resList.push(el.id)
                    })

                    var arr = resList.concat(phase.meals);
                    var sorted_arr = arr.sort();
                    var results = [];
                    for (var i = 0; i < arr.length; i++) {
                        if (sorted_arr[i + 1] == sorted_arr[i]) {
                            results.push({ id: sorted_arr[i] });
                        }
                    }

                    for (var i = 0; i < results.length; i++) {
                        recipeList.map(list => {
                            if (list.id === results[i].id) {
                                tagList.push(list)
                            }
                        })
                    }
                }
            }
        })

        const recipeLists = sortBy(tagList).filter((recipe) => {
            console.log('Tags: ', recipe.tags)

            for (let i = 0; i < recipe.tags.length; i++) {

                if (this.state.veganChecked === true) {
                    if (recipe.tags[i] === 'V') {
                        console.log('Tags: ', recipe.tags[i])
                        return recipe.tags[i]
                    }
                }

                if (this.state.vegetarianChecked === true) {
                    if (recipe.tags[i] === 'V+') {
                        return recipe.tags[i]
                    }
                }

                if (this.state.glutaFree === true) {
                    if (recipe.tags[i] === 'GF') {
                        return recipe.tags[i]
                    }
                }

                if (this.state.dairyFree === true) {
                    if (recipe.tags[i] === 'DF') {
                        return recipe.tags[i]
                    }
                }

                if (this.state.gutHealth === true) {
                    if (recipe.tags[i] === 'GH') {
                        return recipe.tags[i]
                    }
                }
            }

        });

        this.setState({
            allData: Array.isArray(recipeLists) && recipeLists.length > 0 ? recipeLists : recipes,
            isFilterVisible: false,
            isClickVisible: false
        })
    }

    renderItem = ({ item }) => {

        const color1 = []

        const tagList1 = sortBy(item.tags).filter((tag) => {

            if (tag === 'V') color1.push({name: tag, color: '#00C520'})
            if (tag === 'V+') color1.push({name: tag.replace('V+', 'VEG'), color: '#9403fc'})
            if (tag === 'GF') color1.push({name: tag, color: '#469753'})
            if (tag === 'DF') color1.push({name: tag, color: '#B7782B'})
            if (tag === 'GH') color1.push({name: tag, color: '#965734'})
            if (tag === 'L3') color1.push({name: tag, color: '#F89500'})
            if (tag === 'L2') color1.push({name: tag, color: '#fc1403'})
            if (tag === 'L1') color1.push({name: tag, color: '#03adfc'})
            if (tag === 'P3') color1.push({name: tag, color: '#c203fc'}) 
            if (tag === 'P2') color1.push({name: tag, color: '#fc0384'})
            if (tag === 'P1') color1.push({name: tag, color: '#fc8403'})

        })

        const result = color1.splice(0, 3)

        return (
            <FilterScreen
                result={result}
                item={item}
            />
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

    clickModal = (datas, data, recipes) => {

        const phase = Object(datas).phases

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
                    applyButton={() => this.applyButton(phase, data, recipes)}
                    headerButton={() => this.setState({ isClickVisible: !this.state.isClickVisible, isFilterVisible: !this.state.isFilterVisible })}
                    backButton={() => this.setState({isFilterVisible: true, isClickVisible: false })}
                    // backButton={() => this.setState({ isClickVisible: !this.state.isClickVisible })}
                    closePhaseModal={() => this.closePhaseModal()}

                    

                />
            </Modal>
        )
    }

    filterModal = (challengeRecipeData) => {
        console.log(this.state.isClickVisible);
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
                        // isClickVisible: !this.state.isClickVisible,
                        isFilterVisible: false,
                        isClickVisible: true,
                        levelButtonData: challengeRecipeData.level1
                    })}
                    onPressLevel2={() => this.setState({
                        // isClickVisible: !this.state.isClickVisible,
                        isFilterVisible: false,
                        isClickVisible: true,
                        levelButtonData: challengeRecipeData.level2
                    })}
                    onPressLevel3={() => this.setState({
                        // isClickVisible: !this.state.isClickVisible,
                        isFilterVisible: false,
                        isClickVisible: true,
                        levelButtonData: challengeRecipeData.level3
                    })}
                    veganChecked={this.state.veganChecked}
                    vegetarianChecked={this.state.vegetarianChecked}
                    glutaFreeChecked={this.state.glutaFree}
                    dairyFreeChecked={this.state.dairyFree}
                    gutHealthChecked={this.state.gutHealth}
                    toggleVegan={() => this.toggleVegan()}
                    toggleVegetarian={() => this.toggleVegetarian()}
                    toggleGlutaFree={() => this.toggleGlutaFree()}
                    toggleDairyFree={() => this.toggleDairyFree()}
                    toggleGutHealth={() => this.toggleGutHealth()}
                    closeModal={() => this.closeModal()}
                    checkedBox={() =>this.checkedBox()}
                    checkVegetarian={() =>this.checkVegetarian()}
                    checkGluta={()=> this.checkGluta()}
                    checkDairy={()  => this.checkDairy()}
                    checkGut={() =>this.checkGut()}
                />
            </Modal>
        )
    }

    keyExtractor = (index) => String(index);

    render() {
        const { recipes, loading, data, allData, challengeRecipe, levelButtonData, title } = this.state

        const tagList = []

        for (var i = 0; i < allData.length; i++) {
            data.map(list => {
                if (list.id === allData[i].id) {
                    tagList.push(list)
                }
            })
        }

        const phaseData = levelButtonData[0]

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
                            backButtonText="Back to Workout"
                            isBackButton={true}
                            customContainerStyle={{ bottom: 25 }}
                        />
                        <Text style={{ bottom: 60, fontSize: 30, fontFamily: fonts.bold }}>{title}</Text>
                    </View>

                    {/* Filter Button */}
                    <View style={{ marginTop: 10, width: 100 }}>
                        <TouchableOpacity
                            onPress={() => this.setState({ isFilterVisible: !this.state.isFilterVisible })}

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
                        data={tagList}
                        keyExtractor={(res) => res.id}
                        renderItem={(item) => this.renderItem(item)}
                        showsVerticalScrollIndicator={false}
                        removeClippedSubviews={false}
                    />
                )}
                {
                    this.state.isFilterVisible && (
                        this.filterModal(challengeRecipe)
                    )
                }
                {
                    this.state.isClickVisible && (
                        this.clickModal(phaseData, data, recipes)
                    )
                }
                {/*{this.filterModal(challengeRecipe)}*/}
                {/*{this.clickModal(phaseData, data, recipes)}*/}
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