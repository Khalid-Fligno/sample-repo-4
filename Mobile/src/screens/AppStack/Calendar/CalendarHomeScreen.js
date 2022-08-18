import React from "react";
import PropTypes from "prop-types";
import {
  ScrollView,
  View,
  Text,
  Alert,
  Linking,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import * as FileSystem from "expo-file-system";
import firebase from "firebase";
import ReactTimeout from "react-timeout";
import { db } from "../../../../config/firebase";
import Loader from "../../../components/Shared/Loader";
import colors from "../../../styles/colors";
import globalStyle, { containerPadding } from "../../../styles/globalStyles";
import calendarStyles from "./calendarStyle";
import * as Haptics from "expo-haptics";
import {
  fetchRecipeData,
  getCurrentPhase,
  getCurrentChallengeDay,
  getTodayRecommendedWorkout,
  isActiveChallenge,
} from "../../../utils/challenges";
import CustomCalendarStrip from "../../../components/Calendar/CustomCalendarStrip";
import ChallengeWorkoutCard from "../../../components/Calendar/ChallengeWorkoutCard";
import TodayMealsList from "../../../components/Calendar/TodayMealsList";
import Modal from "react-native-modal";
import ChallengeSetting from "../../../components/Calendar/ChallengeSetting";
import moment from "moment";
import createUserChallengeData from "../../../components/Challenges/UserChallengeData";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { NavigationActions } from "react-navigation";
import OnBoardingNotification from "../../../components/Shared/OnBoardingNotification";
import { checkVersion } from "react-native-check-version";
import { getVersion } from "react-native-device-info";
import fonts from "../../../styles/fonts";
import Svg, { Path } from "react-native-svg";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/FontAwesome";

class CalendarHomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      workout: undefined,
      loading: false,
      isSwiping: false,
      dayOfWeek: undefined,
      activeChallengeUserData: undefined,
      meals: undefined,
      activeChallengeData: undefined,
      todayRecommendedMeal: undefined,
      challengeMealsFilterList: undefined,
      isSettingVisible: false,
      CalendarSelectedDate: undefined,
      todayRcWorkout: undefined,
      loadingExercises: false,
      skipped: false,
      initialBurpeeTestCompleted: false,
      width: 0,
      AllRecipe: undefined,
      completeCha: undefined,
      todayRecommendedRecipe: undefined,
      phaseDefaultTags: undefined,
      favoriteRecipe: undefined,
      currentDay: undefined,
      downloaded: 0,
      totalToDownload: 0,
      files: undefined,
      finishdownloaded: false
    };
    this.calendarStrip = React.createRef();
  }

  toggleSetting = () => {
    this.setState({ isSettingVisible: !this.state.isSettingVisible });
  };

  componentDidMount = () => {

    this.props.navigation.setParams({
      activeChallengeSetting: () => this.handleActiveChallengeSetting(),
    });

    this.start()
  };

  start = async () => {

    this.setState({loading: true})

    // Fetch user information
    await this.fetchUserData()

    // Lets load the latest challenge
    const uid = await AsyncStorage.getItem("uid");
    let firstTime = true

    this.unsubscribeFACUD = db
      .collection("users")
      .doc(uid)
      .collection("challenges")
      .where("status", "in", ["Active"])
      .onSnapshot(async (querySnapshot) => {

        const activeUserChallenge = querySnapshot.docs[0]?.data()

        // No active challenge available
        if(!activeUserChallenge) {
          this.setState({ 
            activeChallengeUserData: undefined ,
            loading: false
          })
          return
        }

        const currentDate = moment().format("YYYY-MM-DD")
        // If challenge has completed then inform user
        if(moment(currentDate).isSameOrAfter(activeUserChallenge.endDate)) {
          this.completeChallenge(uid, activeUserChallenge)
          return
        }

        if (firstTime) {
          firstTime = false
          const [challengeDoc, AllRecipe] = await Promise.all([
            db.collection("challenges").doc(activeUserChallenge.id).get(),
            await fetchRecipeData()
          ])

          var activeChallengeData = challengeDoc.data()
          var allRecipes = AllRecipe
          var currentDay = moment(new Date()).format("YYYY-MM-DD")
          // Lets load all the recipes
          this.setState({ 
            AllRecipe: allRecipes,
            currentDay,
            currentChallengeDay: getCurrentChallengeDay(activeUserChallenge.startDate, currentDay)
          })
        } else {
          var { AllRecipe: allRecipes , activeChallengeData, currentDay } = this.state
        }

        // Update data when challenge data is modified
        this.onUserChallengeChanged(activeUserChallenge, activeChallengeData, allRecipes, currentDay)
      })
  }

  onUserChallengeChanged = async (activeUserChallenge, activeChallengeData, allRecipes, currentDay) => {

    const favouriteRecipes = this.usersFavouriteRecipesForDay(activeUserChallenge, allRecipes, currentDay)
    this.getCurrentPhaseInfo(activeUserChallenge, activeChallengeData, currentDay, allRecipes)

    this.setState({
      activeChallengeUserData: activeUserChallenge,
      favoriteRecipe: favouriteRecipes,
      activeChallengeData,
      loading: false
    })
  }

  completeChallenge = async (uid, activeChallenge) => {
    this.setState({loading: false})
    const newActiveChallengeData = createUserChallengeData({ ...activeChallenge, status: "InActive" }, new Date())
    await db
      .collection("users")
      .doc(uid)
      .collection("challenges")
      .doc(activeChallenge.id)
      .set(newActiveChallengeData, { merge: true })

    this.setState({ completeCha: false })

    Alert.alert(
      "Congratulations!",
      "You have completed your challenge",
      [
        {
          text: "OK",
          onPress: () => this.props.navigation.navigate("ChallengeSubscription", { completedChallenge: true })
        }
      ],
      { cancelable: false }
    )
  }

  usersFavouriteRecipesForDay = (usersActiveChallenge, allRecipes, dateSelected) => {

    const currentChallengeDay = getCurrentChallengeDay(usersActiveChallenge.startDate, dateSelected)
    const usersFavouriteRecipes = usersActiveChallenge
      .faveRecipe
      ?.find(day => day.day === currentChallengeDay)
      ?.recipeMeal ?? {}
    return Object
      .keys(usersFavouriteRecipes)
      .reduce((result, propertyName) => {
        // We need to perform data transformation for these properties inside the 'faveRecipe'
        // Currently the property types for breakfast, lunch, etc are just string.
        // We want to set them to be a type of Array<String> for future use.
        // We transform into an array and flatten it, if it was already an array flatting it should set to be an array still
        const ids = [usersFavouriteRecipes[propertyName]]
          .flat(1)
          .filter(r => r?.trim()) // Remove any null/undefined/empty ids

        switch (propertyName) {
          case 'drink': // Drink == post_workout, allrecipes['snack'] contains both snack and postworkout recipes
            var filteredRecipes = allRecipes['snack'].filter(recipe => ids.includes(recipe.id))
            break
          default:
            var filteredRecipes = allRecipes[propertyName].filter(recipe => ids.includes(recipe.id))
        }
        result[propertyName] = [...new Set(filteredRecipes)] // Remove any duplicate objects
        return result
      }, { 
          breakfast: [],
          lunch: [],
          dinner: [],
          snack: [],
          preworkout: [],
          treats: [],
      })
  }

  componentDidUpdate = () => {
    if (this.state.files !== undefined) {
      this.state.downloaded++;
      if (this.state.totalToDownload === this.state.downloaded) {
        this.setState({
          finishdownloaded: true,
          files: undefined
        });
      }
    }
  };

  componentWillUnmount() {
    this.setState({
      downloaded: 0,
      totalToDownload: 0,
      files: undefined,
      loadingExercises: false,
      finishdownloaded: false
    });
    if (this.unsubscribeFACUD) {
      this.unsubscribeFACUD();
    }
    if (this.unsubscribeFACD) this.unsubscribeFACD();
    if (this.unsubscribeSchedule) this.unsubscribeSchedule();
  }

  handleActiveChallengeSetting() {
    this.toggleSetting();
  }

  fetchRecipeChallenge = async () => {
    fetchRecipeData()
      .then((res) => {
        this.setState({AllRecipe: res })
      })
  }

  fetchCalendarEntries = () => {
    const selectedDate = this.calendarStrip.current.getSelectedDate();
    //Todo :call the function to get the data of current date
    this.handleDateSelected(selectedDate);
  };

  resetActiveChallengeUserData = () => {
    this.props.navigation.reset(
      [NavigationActions.navigate({ routeName: "CalendarHome" })],
      0
    );
  };

  handleDateSelected = async (date) => {
    const { activeChallengeData, activeChallengeUserData, AllRecipe} = this.state;
    
    // this.setState({ loading: false });
    const currentDayTime = new Date(date).getTime()
    const currentDayDate = date.format("YYYY-MM-DD")
    const currentDay = currentDayDate.toString()

    this.setState({
      currentDay,
      CalendarSelectedDate: date,
      currentChallengeDay: getCurrentChallengeDay(activeChallengeUserData.startDate, currentDay),
      favoriteRecipe: this.usersFavouriteRecipesForDay(activeChallengeUserData, AllRecipe, currentDay),
    })

    if (activeChallengeData && activeChallengeUserData &&
      new Date(activeChallengeUserData.startDate).getTime() <= currentDayTime &&
      new Date(activeChallengeUserData.endDate).getTime() >= currentDayTime) {
      this.getCurrentPhaseInfo(activeChallengeUserData, activeChallengeData, currentDay, AllRecipe)
    }
  }

  fetchUserData = async () => {

    const uid = await AsyncStorage.getItem("uid");
    const version = await checkVersion();
    const userRef = db .collection("users").doc(uid)

    userRef.set(
        { AppVersion: Platform.OS === "ios" ? String(version.version) : String(getVersion()) },
        { merge: true })

    userRef.onSnapshot(doc => {
      const userData = doc.data()
      if (userData?.weeklyTargets === null) {
        const data = {
          weeklyTargets: {
            resistanceWeeklyComplete: 0,
            hiitWeeklyComplete: 0,
            strength: 0,
            interval: 0,
            circuit: 0,
            currentWeekStartDate: moment()
              .startOf("week")
              .format("YYYY-MM-DD"),
          },
        }
        userRef.set(data, { merge: true });
      }
      this.setState({ initialBurpeeTestCompleted: userData?.initialBurpeeTestCompleted ?? false })
    })
  }

  // Handy function to load any amount of ids.
  // Firestore limits 'in' queries to 10 ids max, but this will chunk the ids into payloads of 10
  // Then merge all read requests together
  loadIdsForCollection = async (collectionName, ids) => {

    function spliceIntoChunks(arr, chunkSize) {
      const res = [];
      let mutableArr = [...arr]
      while (mutableArr.length > 0) {
          const chunk = mutableArr.splice(0, chunkSize);
          res.push(chunk);
      }
      return res;
    }

    const chunks = spliceIntoChunks(ids, 10)
    const results = await Promise.all(chunks.map(chunk => db.collection(collectionName).where('id', 'in', chunk).get()))
    return results.flatMap(result => result.docs.map(r => r.data()))
  }

  loadExercise = async (workoutData) => {

    const cloneWorkout = {...workoutData};

    if (!workoutData.newWorkout) {
        return (await this.downloadVideosForWorkout(workoutData))
    }

    const containsIntervalType = workoutData.filters.includes('interval')
    if(containsIntervalType) {
      var exerciseIds = workoutData.exercises.map((exercise) => exercise.id)
    } else {
      var exerciseIds = workoutData.exercises
    }
    const exercises = await this.loadIdsForCollection('Exercises', exerciseIds)

    cloneWorkout.exercises = workoutData.exercises.map(exerciseId => {
      let exercise = exercises.find(r => [exerciseId, exerciseId.id].includes(r.id))
      if(containsIntervalType) {
          exercise.duration = exerciseId.duration
      }
      return exercise
    })

    // Load Warmup Exercises
    if (workoutData.warmUpExercises) {
      const exerciseRef = (
        await db
          .collection("WarmUpCoolDownExercises") // in operator has a 10 item limit
          .where("id", "in", workoutData.warmUpExercises)
          .get()
      ).docs

      cloneWorkout.warmUpExercises = workoutData
        .warmUpExercises
        .map((id) => exerciseRef.find((ref) => ref.id === id)?.data())
    }

    // Load Cooldown Exercises
    if (workoutData.coolDownExercises) {
      const exerciseRef = (
        await db
          .collection("WarmUpCoolDownExercises")
          .where("id", "in", workoutData.coolDownExercises) // in operator has a 10 item limit
          .get()
      ).docs;

      cloneWorkout.coolDownExercises = workoutData
        .coolDownExercises
        .map((id) => exerciseRef.find((ref) => ref.id === id)?.data())
    }        
    const res = await this.downloadVideosForWorkout(cloneWorkout);
    if (res) return cloneWorkout
    else return false
  }

  downloadVideosForWorkout = async (workout) => {
    try {
      const downloadVideo = async (exercise) => {
        
        const { name, videoUrls, exerciseModel, newWorkout } = exercise

        const defer = (success) => {
          this.setState((prevState) => ({files: !prevState.files}))
          return success
        }

        if (newWorkout) var videoIndex = videoUrls.findIndex((v) => v.model == exerciseModel) ?? 0
        else var videoIndex = 0

        if(!videoUrls && videoUrls.length > videoIndex) {
          console.log(`Video at index ${videoIndex} for exercise (${exercise.id}) does not exist`)
          return defer(false)
        }

        const localLocation = `${FileSystem.cacheDirectory}${encodeURIComponent(name.replace(/[^a-z0-9]/gi, '_'))}.mp4`
        const dirInfo = await FileSystem.getInfoAsync(localLocation);

        if(!dirInfo.exists) {
          try { await FileSystem.downloadAsync(videoUrls[videoIndex].url, localLocation) }
          catch (error) {
            console.log(`Failed to download video: ${error}`)
            return defer(false)
          }
        }

        videoUrls[videoIndex].localUrl = localLocation
        return defer(true)
      }

      return Promise
        .all([workout.exercises, workout.warmUpExercises, workout.coolDownExercises]
            .flatMap(e => e)
            .map(e => downloadVideo(e)))
        .then(_ => true)
        .catch(error => {
          console.error(error)
          return false
        })

    } catch (err) {
      console.log(err);
      Alert.alert("Something went wrong", "Workout Not Available");
      return false
    }
  };

  loadExercises = async (workoutData) => {

    this.setState({
      loadingExercises: true,
      totalToDownload:
        workoutData.exercises.length +
        workoutData.warmUpExercises.length +
        workoutData.coolDownExercises.length,
    })

    const workout = await this.loadExercise(workoutData);

    if (workout) {
      if(!workout.newWorkout && this.state.totalToDownload === this.state.downloaded) {
        this.goToNext(workout);
        return
      }
    } else {
      this.setState({ loadingExercises: false });
      return
    }
    
    this.goToNext(workout)
  }

  async goToNext(workout) {
    const fitnessLevel = await AsyncStorage.getItem("fitnessLevel", null);
    const { currentChallengeDay, initialBurpeeTestCompleted } = this.state

    if (currentChallengeDay > 0) {
      Object.assign(workout, {
        displayName: `${workout.displayName} - Day ${currentChallengeDay}`,
      });
    }
    
    const requiredVideos = [workout.exercises, workout.warmUpExercises, workout.coolDownExercises]
      .map(i => i.map(v => v.videoUrls))
      .flat(2)
      .map(i => decodeURIComponent(i.localUrl.split("/").pop()))

    // Delete videos that are not used for this exercise
    FileSystem
      .readDirectoryAsync(`${FileSystem.cacheDirectory}`)
      .then((res) => {
        const deleteVideos = res
          .filter(item => !requiredVideos.includes(item) && item.split('.').pop()?.toLowerCase() == "mp4")
          .map(item => FileSystem.deleteAsync(`${FileSystem.cacheDirectory}${encodeURIComponent(item)}`, { idempotent: true }))
        return Promise.all(deleteVideos)
      })
      .catch(error => {
        console.log(`Failed to delete video: ${error}`)
      })

    if (!initialBurpeeTestCompleted) {
      
      this.props.navigation.navigate("Burpee1", {
        fromScreen: "WorkoutInfo",
        screenReturnParams: {
          workout,
          reps: workout.difficultyLevel[fitnessLevel - 1].toString(),
          workoutSubCategory: workout.workoutSubCategory,
          fitnessLevel,
          extraProps: { fromCalender: true },
        },
      })
    } else {
      this.props.navigation.navigate("WorkoutInfo", {
        workout,
        reps: workout.difficultyLevel[fitnessLevel - 1].toString(),
        workoutSubCategory: workout.workoutSubCategory,
        fitnessLevel,
        extraProps: { fromCalender: true },
        transformRoute: true,
      });
    }

    this.setState({
      downloaded: 0,
      totalToDownload: 0,
      files: undefined,
      loadingExercises: false,
      finishdownloaded: false
    })
  }

  deleteCalendarEntry = async (fieldToDelete) => {
    const uid = await AsyncStorage.getItem("uid");
    const stringDate = this.calendarStrip.current
      .getSelectedDate()
      .format("YYYY-MM-DD")
      .toString();
    this.unsubscribe = await db
      .collection("users")
      .doc(uid)
      .collection("calendarEntries")
      .doc(stringDate)
      .update({
        [fieldToDelete]: firebase.firestore.FieldValue.delete(),
      });
    this.setState({ isSwiping: false });
  };

  getCurrentPhaseInfo = async (activeChallengeUserData, activeChallengeData, currentDay, allRecipes) => {

    if(!activeChallengeUserData || !activeChallengeData) {
      console.error("No active challenge information provided")
      return
    }

    const phase = getCurrentPhase(activeChallengeUserData.phases, currentDay)
    const phaseData = activeChallengeData.phases.find(res => res.name === phase?.name)
    
    if (!phaseData)
      return // Don't load phase info, if there is no phaseData or the phase data is the same as last time

    if(this.state.phaseData?.name == phaseData?.name) {
      const todayRcWorkout = await getTodayRecommendedWorkout(activeChallengeData.workouts, activeChallengeUserData, currentDay)
      this.setState({todayRcWorkout})
      return
    }
    
    const [todayRecommendedMeal, todayRcWorkout] = await Promise.all([
      this.getTodayRecommendedMeal(allRecipes, phaseData, activeChallengeData),
      getTodayRecommendedWorkout(activeChallengeData.workouts, activeChallengeUserData, currentDay)
    ])

    this.setState({
      phaseData,
      todayRecommendedRecipe: todayRecommendedMeal.recommendedRecipe,
      todayRecommendedMeal: todayRecommendedMeal.recommendedMeal,
      challengeMealsFilterList: todayRecommendedMeal.challengeMealsFilterList,
      phaseDefaultTags: todayRecommendedMeal.phaseDefaultTags,
      favouriteRecipeConfigs: phaseData.favouriteRecipeConfigs,
      todayRcWorkout
    })
  }

  getTodayRecommendedMeal = async (allRecipes, phaseData, activeChallengeData) => {

    const findRecipeForId = (id) => {

      for (const category of Object.values(allRecipes)) {
        const recipe = category.find(r => r.id == id)
        if(recipe) return recipe
      }
      return null
    }

    const getPhaseNames = () => {
      switch (phaseData.name) {
        case 'Phase1':
          return ['P1']
        case 'Phase2':
          return ['P2']
        case 'Phase3':
          return ['P3']    
      }
    }

    const phaseNames = getPhaseNames()

    const phaseMeals = phaseData
      .meals
      .map(id => findRecipeForId(id))
      .filter(recipe => recipe.showTransform)


    /// Function takes a recipe and array of propeties as strings to look up in the recipe object 
    // to see if it matches the type of meal
    const isRecipeAllowed = (recipe) => {
      let levelName = activeChallengeData.levelTags
      switch (levelName) {
        case "L1":
          return recipe.tags?.includes(phaseNames[0]) ?? false
        case "L2":
        case "L3":
          return recipe.tags?.includes(levelName) ?? false
        default:
          return false
      }
    }

    const phaseMealsContainsBreakfast = phaseMeals.some((meal) => meal.types.includes("breakfast") && meal.breakfast)
    const phaseMealsContainsLunch = phaseMeals.some((meal) => meal.types.includes("lunch") && meal.lunch)
    const phaseMealsContainsDinner = phaseMeals.some((meal) => meal.types.includes("dinner") && meal.dinner)
    const phaseMealsContainsSnackOrDrink = phaseMeals.some((meal) => { 
        const isSnack = meal.types.includes("snack") && meal.snack
        const isDrink = meal.types.includes("drink") && meal.drink
        return isSnack || isDrink
      })
    const phaseMealsContainsPreworkout = phaseMeals.some((meal) => meal.types.includes("preworkout") && meal.preworkout)
    const phaseMealsContainsTreats = phaseMeals.some((meal) => meal.types.includes("treats") && meal.treats)

    const recommendedRecipe = {
      breakfast: phaseMealsContainsBreakfast ? allRecipes.breakfast.filter(recipe => isRecipeAllowed(recipe)) : [],
      lunch: phaseMealsContainsLunch ? allRecipes.lunch.filter(recipe => isRecipeAllowed(recipe)) : [],
      dinner: phaseMealsContainsDinner ? allRecipes.dinner.filter(recipe => isRecipeAllowed(recipe)) : [],
      snack: phaseMealsContainsSnackOrDrink ? allRecipes.snack.filter(recipe => isRecipeAllowed(recipe)) : [],
      preworkout: phaseMealsContainsPreworkout ? allRecipes.preworkout.filter(recipe => isRecipeAllowed(recipe)) : [],
      treats: phaseMealsContainsTreats ? allRecipes.treats.filter(recipe => isRecipeAllowed(recipe)) : []
    }

    // This determines what categories of meals will be present in the screen
    const breakfastList = phaseMeals.filter((res) => res.breakfastVisible)
    const lunchList = phaseMeals.filter((res) => res.lunchVisible)
    const dinnerList = phaseMeals.filter((res) => res.dinnerVisible)
    const snackList = phaseMeals.filter((res) => res.snackVisible)
    const preworkoutList = phaseMeals.filter((res) => res.preworkoutVisible)
    const treatsList = phaseMeals.filter((res) => res.treatsVisible)

    const recommendedMeal =
    {
      breakfast: breakfastList,
      snack: snackList,
      lunch: lunchList,
      dinner: dinnerList,
      preworkout: preworkoutList,
      treats: treatsList,
    }

    return {
      recommendedRecipe: recommendedRecipe,
      recommendedMeal,
      challengeMealsFilterList: phaseMeals.map((res) => res.id),
      phaseDefaultTags: phaseNames,
    }
  }

  async goToRecipe(recipeData) {
    this.setState({ loading: true });
    const fileUri = `${FileSystem.cacheDirectory}recipe-${recipeData.id}.jpg`;
    await FileSystem.getInfoAsync(fileUri)
      .then(async ({ exists }) => {
        if (!exists) {
          await FileSystem.downloadAsync(
            recipeData.coverImage,
            `${FileSystem.cacheDirectory}recipe-${recipeData.id}.jpg`
          );
          this.setState({ loading: false });
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(() => {
        this.setState({ loading: false });
        Alert.alert("", "Image download error");
      });
    this.props.navigation.navigate("Recipe", {
      recipe: recipeData,
      title: "challenge",
      extraProps: { fromCalender: true },
    });
  }

  handleBack = () => {
    const { navigation } = this.props;
    navigation.pop();
  };

  async getToFilter(data, data1, data2, title, configs) {
    const {
      activeChallengeData,
      phaseDefaultTags,
      activeChallengeUserData,
      currentChallengeDay
    } = this.state;

    const datas = activeChallengeUserData

    if (datas.faveRecipe === undefined) {

      const initialFaveRecipe = [];
      for (let i = 1; i <= 60; i++) {
        const data = {
          day: i,
          recipeMeal: {
            breakfast: "",
            lunch: "",
            dinner: "",
            snack: "",
            drink: "",
            preworkout: "",
            treats: "",
          },
        };
        initialFaveRecipe.push(data);
      }

      const id = this.state.activeChallengeUserData.id;
      const uid = await AsyncStorage.getItem("uid");
      const activeChallengeUserRef = db
        .collection("users")
        .doc(uid)
        .collection("challenges")
        .doc(id);

      await activeChallengeUserRef.set(
        { faveRecipe: initialFaveRecipe },
        { merge: true }
      );

      datas.faveRecipe = initialFaveRecipe
    }

    this.props.navigation.navigate("FilterRecipe", {
      currentChallengeDay: currentChallengeDay,
      activeChallengeUserData: datas,
      phaseDefaultTags: phaseDefaultTags,
      defaultLevelTags: activeChallengeData.levelTags,
      todayRecommendedRecipe: data2,
      configs: configs, 
      recipes: data,
      title: title,
      allRecipeData: data1,
    });
  }

  openLink = (url) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(url);
  };

  render() {
    const {
      loading,
      activeChallengeUserData,
      activeChallengeData,
      todayRecommendedMeal,
      CalendarSelectedDate,
      todayRcWorkout,
      loadingExercises,
      skipped,
      width,
      AllRecipe,
      completeCha,
      todayRecommendedRecipe,
      favoriteRecipe,
      favouriteRecipeConfigs,
      phaseData,
      currentChallengeDay,
      currentDay
    } = this.state;

    let showRC = false;
    let isOutsideSchedule = false
    if (activeChallengeData && activeChallengeUserData) {
      const isBetween = moment(currentDay).isBetween(activeChallengeUserData.startDate, activeChallengeUserData.endDate, undefined, "[]")
      showRC = this.calendarStrip.current && isBetween && todayRecommendedMeal
      isOutsideSchedule = !isBetween
    }
    
    const mealsList = showRC && (
      <>
        <Text
          style={{
            fontFamily: fonts.bold,
            fontSize: wp("6.5%"),
            color: colors.charcoal.dark,
            marginVertical: wp("4%"),
            marginLeft: wp("8%"),
            textAlign: "left",
            width: "100%",
          }}
        >
          Today's Meals
        </Text>
        {AllRecipe && todayRecommendedMeal && (
          <TodayMealsList
            recipe={AllRecipe}
            favoriteRecipe={favoriteRecipe}
            todayRecommendedRecipe={todayRecommendedRecipe}
            data={todayRecommendedMeal}
            favouriteRecipeConfigs={favouriteRecipeConfigs}
            onPress={(res) => this.goToRecipe(res)}
            filterPress={(res, res1, res2, title, favouriteRecipeConfigs) =>
              this.getToFilter(res, res1, res2, title, favouriteRecipeConfigs)
            }
          />
        )}
      </>
    );
    const workoutCard =
      todayRcWorkout && showRC ? (
        <>
          <Text style={calendarStyles.headerText}>Today's Workout</Text>
          <View style={calendarStyles.listContainer}>
            <ChallengeWorkoutCard
              onPress={() =>
                todayRcWorkout.name && todayRcWorkout.name !== "rest"
                  ? this.loadExercises(todayRcWorkout)
                  : ""
              }
              res={todayRcWorkout}
              currentDay={currentChallengeDay}
              title={activeChallengeData.displayName}
            />
          </View>
        </>
      ) : showRC ? (
        <>
          <Text style={calendarStyles.headerText}>Today's Workout</Text>
          <View style={calendarStyles.listContainer}>
            <ChallengeWorkoutCard
              onPress={() => null}
              res={""}
              currentDay={currentChallengeDay}
              title={activeChallengeData.displayName}
            />
          </View>
        </>
      ) : null;
    const getPhase = (phaseData) => {
      return (
        (
          phaseData.name.substring(0, 5) +
          " " +
          phaseData.name.substring(5, phaseData.name.length)
        )
          .charAt(0)
          .toUpperCase() +
        (
          phaseData.name.substring(0, 5) +
          " " +
          phaseData.name.substring(5, phaseData.name.length)
        ).slice(1)
      );
    };
    const Progress = () => {
      return (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 15,
            }}
          >
            <View
              style={{
                borderRadius: 3,
                backgroundColor: "rgba(0,0,0,0.1)",
                padding: 5,
                borderBottomColor: "rgba(0,0,0,0.1)",
                borderBottomWidth: 2,
              }}
            >
              <Text
                style={{
                  color: "#656565",
                  fontFamily: fonts.bold,
                }}
              >
                Day 1
              </Text>
            </View>
            <View
              style={{
                borderRadius: 3,
                backgroundColor: "rgba(0,0,0,0.1)",
                padding: 5,
                borderBottomColor: "rgba(0,0,0,0.1)",
                borderBottomWidth: 2,
              }}
            >
              <Text
                style={{
                  color: "#656565",
                  fontFamily: fonts.bold,
                }}
              >
                Day {activeChallengeData.numberOfDays}
              </Text>
            </View>
          </View>

          <View
            onLayout={(e) => {
              const newWidth = e.nativeEvent.layout.width;
              this.setState({ width: newWidth });
            }}
            style={{
              height: 10,
              backgroundColor: "rgba(0,0,0,0.1)",
              borderRadius: 10,
              overflow: "hidden",
              marginTop: 10,
            }}
          >
            <View
              style={{
                height: 10,
                width: (width * currentChallengeDay) / activeChallengeData.numberOfDays,
                borderRadius: 10,
                backgroundColor: "#fa896f",
                position: "absolute",
                left: 0,
                top: 0,
              }}
            >
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: 60,
            }}
          >
            <View
              style={{
                backgroundColor: "#ffffff",
                // width: 104,
                borderRadius: 3,
                borderBottomColor: "rgba(0,0,0,0.1)",
                borderBottomWidth: 1,
              }}
            >
              <Text
                style={{
                  // fontSize: 18,
                  fontFamily: fonts.bold,
                }}
              >
                {activeChallengeUserData.displayName + " "}
              </Text>
            </View>
            <Text
              style={{
                // fontSize: 18,
                fontFamily: fonts.bold,
              }}
            >
              {getPhase(phaseData)}
            </Text>
          </View>

          <View style={{ marginTop: 20, flex: 1 }}>
            <TouchableOpacity
              onPress={ () => {
                  if(phaseData) this.openLink(phaseData.pdfUrl)
                }
              }>
              <View style={{ flex: 1 }}>
                <Icon name="file-text-o" size={20} />
              </View>

              <View style={{ marginTop: -20 }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: fonts.bold,
                    paddingLeft: 25,
                  }}
                >
                  Phase guide doc
                </Text>
              </View>
              <View style={{ marginTop: -20 }}>
                <View style={{ paddingLeft: 20, alignItems: "flex-end" }}>
                  <Icon name="arrow-right" size={18} />
                </View>
              </View>
              <View style={{ marginTop: 10 }}>
                <View
                  style={{
                    borderBottomColor: "#cccccc",
                    borderBottomWidth: 1,
                    width: "100%",
                  }}
                ></View>
              </View>
            </TouchableOpacity>
          </View>
          <View
            elevation={5}
            style={{
              position: "absolute",
              left:
                Platform.OS === "ios"
                  ? (width * currentChallengeDay) /
                  activeChallengeData.numberOfDays +
                  11
                  : (width * currentChallengeDay) /
                  activeChallengeData.numberOfDays +
                  12,
              top: 85,
            }}
          >
            <Svg
              id="prefix__Layer_1"
              viewBox="0 0 110 90"
              xmlSpace="preserve"
              width={hp("1.5%")}
              height={hp("1.5%")}
              fill="#fa896e"
              style={{
                strokeWidth: 50,
                stroke: "#fa896e",
                strokeLinejoin: "round",
                strokeLinecap: "round",
              }}
            >
              <Path className="prefix__st0" d="M 55 46 L 87 90 L 22 90 z" />
            </Svg>
          </View>
          <View
            elevation={5}
            style={{
              position: "absolute",
              left:
                Platform.OS === "ios"
                  ? (width * currentChallengeDay) /
                  activeChallengeData.numberOfDays -
                  7
                  : (width * currentChallengeDay) /
                  activeChallengeData.numberOfDays -
                  7,
              top: Platform.OS === "ios" ? 96 : 94,
              backgroundColor: "#fa896e",
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                fontFamily: fonts.GothamMedium,
                color: "white",
                fontSize: 25,
              }}
            >
              {currentChallengeDay}
            </Text>
          </View>
        </>
      );
    };

    const dayDisplay = (
      <ScrollView
        contentContainerStyle={calendarStyles.dayDisplayContainer}
        scrollEnabled={!this.state.isSwiping}
        showsVerticalScrollIndicator={false}>
        {phaseData && showRC && (
          <>
            <View
              style={{
                paddingVertical: 20,
                width: Dimensions.get("window").width,
                paddingHorizontal: 20,
              }}
            >
              <Progress />
            </View>
          </>
        )}
        {workoutCard}
        {mealsList}
      </ScrollView>
    );

    const setting = (
      <Modal
        isVisible={this.state.isSettingVisible}
        coverScreen={true}
        style={{ margin: 0 }}
        animationIn="fadeInLeft"
        animationOut="fadeOutLeft"
        onBackdropPress={() => this.toggleSetting()}
      >
        <ChallengeSetting
          onToggle={() => this.toggleSetting()}
          currentDay={this.state.currentDay}
          activeChallengeUserData={activeChallengeUserData}
          activeChallengeData={activeChallengeData}
          isSchedule={false}
          ScheduleData={activeChallengeUserData}
          navigation={this.props.navigation}
          fetchCalendarEntries={this.fetchCalendarEntries}
          resetActiveChallengeUserData={this.resetActiveChallengeUserData}
          completeCha={completeCha}
        />
      </Modal>
    );

    return (
      <View style={[globalStyle.container, { paddingHorizontal: 0 }]}>
        <CustomCalendarStrip
          ref1={this.calendarStrip}
          onDateSelected={(date) => {
            this.handleDateSelected(date);
          }}
          CalendarSelectedDate={CalendarSelectedDate}
        />

        {activeChallengeUserData && isOutsideSchedule && !showRC && !loading && (
          <View style={{ margin: wp("5%") }}>
            <Text style={calendarStyles.scheduleTitleStyle}>
              {activeChallengeUserData.displayName}
            </Text>
            <Text style={calendarStyles.scheduleTextStyle}>
              Your challenge will start from{" "}
              {moment(activeChallengeUserData.startDate).format("DD MMM YYYY")}
            </Text>
            <Text style={calendarStyles.scheduleTextStyle}>
              You can change this in settings
            </Text>
          </View>
        )}

        {skipped && (
          <OnBoardingNotification
            navigation={this.props.navigation}
            data={activeChallengeUserData}
          />
        )}
        {dayDisplay}
        {setting}
        <Loader loading={loading} color={colors.red.standard} />
        <Loader
          progressive={true}
          loading={loadingExercises}
          downloaded={this.state.downloaded}
          totalToDownload={this.state.totalToDownload}
          color={colors.red.standard}
        />
      </View>
    );
  }
}

CalendarHomeScreen.propTypes = {
  setTimeout: PropTypes.func.isRequired,
};

export default ReactTimeout(CalendarHomeScreen);
