import React from 'react';
import { ListItem } from "react-native-elements"
import colors from "../../styles/colors"
import calendarStyles from "../../screens/AppStack/Calendar/calendarStyle"
import PlusCircleSvg from "../../../assets/icons/PlusCircleSvg"
import Icon from '../Shared/Icon';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { TouchableOpacity ,Text ,View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { db } from '../../../config/firebase';
import firebase from 'firebase';
import { findFocusIcon, findFocus, findWorkoutType } from '../../utils/workouts';
export const CustomListItem = (props)=>{
    const {name,index,onPress,subTitle} = props
    return (
      <ListItem
        activeOpacity ={0.5}
        underlayColor="none"
        touchSoundDisabled={false}
        key={index}
        title={name}
        subtitle={subTitle}
        onPress={onPress}
        containerStyle={calendarStyles.listItemContainer}
        chevronColor={colors.charcoal.standard}
        titleStyle={calendarStyles.blankListItemTitle}
        subtitleStyle={calendarStyles.blankListItemSubtitle}
        rightIcon={<PlusCircleSvg height={30} width={30} fill={colors.themeColor.color} />}
    />
    )
  }

 export const MealSwipable = (props)=>{
     const {
            name,
            data,
            index,
            renderRightActions,
            onSwipeableWillOpen,
            onSwipeableClose,
            stringDate,
            onPress
        } = props
    return (
      <Swipeable
              renderRightActions={ renderRightActions}
              overshootRight={false}
              onSwipeableWillOpen={onSwipeableWillOpen}
              onSwipeableClose={onSwipeableClose}
              key={index}
            >
              <ListItem
                activeOpacity ={0.5}
                underlayColor="none"
                title={data.title.toUpperCase()}
                subtitle={data.subtitle}
                onPress={onPress}
                rightTitle = {name}
                rightTitleStyle={[calendarStyles.recipeListItemSubtitle,{textTransform:'capitalize'}]}
                containerStyle={calendarStyles.listItemContainer}
                chevronColor={colors.charcoal.standard}
                titleStyle={calendarStyles.recipeListItemTitle}
                subtitleStyle={calendarStyles.recipeListItemSubtitle}
                rightIcon={<Icon name="chevron-right" size={18} color={colors.themeColor.color} />}
              />
      </Swipeable>
    )
  }

 export const RcMealListItem = (props) =>{
     const {
         res,
         index , 
         onPress,
         onSwipeableWillOpen,
         onSwipeableClose,
         renderRightActions
        } = props
    return (
        <Swipeable
            renderRightActions={renderRightActions}
            overshootRight={false}
            onSwipeableWillOpen={onSwipeableWillOpen}
            onSwipeableClose={onSwipeableClose}
            >
          <ListItem
            key = {index}
            activeOpacity ={0.5}
            underlayColor="none"
            title={`${res.displayName}`}
            rightTitle = {res.mealTitle}
            subtitle={res.subTitle}
            onPress={onPress}
            containerStyle={calendarStyles.listItemContainer}
            chevronColor={colors.charcoal.standard}
            titleStyle={calendarStyles.recipeListItemTitle}
            rightTitleStyle={[calendarStyles.recipeListItemSubtitle,{textTransform:'capitalize'}]}
            subtitleStyle={calendarStyles.recipeListItemSubtitle}
            rightIcon={<Icon name="chevron-right" size={18} color={colors.themeColor.color} />}
          />
        </Swipeable>  
    )
  }
  export const RcWorkoutListItem = (props) =>{
    const {
        res,
        index , 
        onPress,
        onSwipeableWillOpen,
        onSwipeableClose,
        renderRightActions,
        currentDay
       } = props
   return (
       <Swipeable
           renderRightActions={renderRightActions}
           overshootRight={false}
           onSwipeableWillOpen={onSwipeableWillOpen}
           onSwipeableClose={onSwipeableClose}
           >
         <ListItem
           key = {index}
           activeOpacity ={0.5}
           underlayColor="none"
           title={`${res.displayName} - Day ${currentDay}`}
           subtitle={res.name === 'rest'?"Today is your rest day":res.target}
           onPress={onPress}
           containerStyle={calendarStyles.listItemContainer}
           chevronColor={colors.charcoal.standard}
           titleStyle={calendarStyles.recipeListItemTitle}
           subtitleStyle={[calendarStyles.recipeListItemSubtitle,{textTransform:'capitalize'}]}
           rightIcon={<Icon name="chevron-right" size={18} color={colors.themeColor.color} />}
         />
       </Swipeable>  
   )
 }


  export const WorkoutSwipable = (props) =>{
      const {
        workout,
        onSwipeableWillOpen,
        onSwipeableClose,
        renderRightActions,
        onPress,
        stringDate
      } = props
      return(
        <Swipeable
            renderRightActions={renderRightActions}
            overshootRight={false}
            onSwipeableWillOpen={onSwipeableWillOpen}
            onSwipeableClose={onSwipeableClose}
            >
                <ListItem
                activeOpacity ={0.5}
                underlayColor="none"
                title={workout.displayName}
                subtitle={
                    workout.filters && workout.filters.includes('strength') ? (
                    <View style={calendarStyles.workoutSubtitleContainer}>
                        {/* <Icon
                        name={findLocationIcon()}
                        size={20}
                        color={colors.charcoal.standard}
                        /> */}
                        {/* <Text style={calendarStyles.workoutSubtitleText}>
                        {findLocation(workout)}
                        </Text> */}
                        <Icon
                        name={findFocusIcon(workout)}
                        size={20}
                        color={colors.charcoal.standard}
                        />
                        <Text style={calendarStyles.workoutSubtitleText}>
                        {findFocus(workout)}
                        </Text>
                        
                    </View>
                    ) : (
                    <View style={calendarStyles.workoutSubtitleContainer}>
                        <Icon
                        name="workouts-hiit"
                        size={18}
                        color={colors.charcoal.standard}
                        />
                        <Text style={calendarStyles.workoutSubtitleText}>
                        {findWorkoutType(workout)}
                        </Text>
                    </View>
                    )
                }
                // onPress={workout.resistance ? () => this.loadExercises(workout.id) : () => this.loadHiitExercises(workout.id)}
                onPress={onPress}
                containerStyle={calendarStyles.listItemContainer}
                chevronColor={colors.charcoal.standard}
                titleStyle={calendarStyles.workoutListItemTitle}
                rightIcon={<Icon name="chevron-right" size={18} color={colors.themeColor.color} />}
                />
        </Swipeable>
      )
  
  }



