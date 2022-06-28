
import { IMAGE } from '../../../library/images';

export default class NutritionGroup {

    static Breakfast = new NutritionGroup("Breakfast")
    static Lunch = new NutritionGroup("Lunch")
    static Dinner = new NutritionGroup("Dinner")
    static Snack = new NutritionGroup("Snack")
    static PostWorkout = new NutritionGroup("Post Workout")
    static PreWorkout = new NutritionGroup("Pre Workout")
    static Treats = new NutritionGroup("Treats")

    constructor(groupName) {
        this.groupName = groupName
    }

    get title() {
        return this.groupName
    }

    get filteredMealType() {
        switch (this) {
            case NutritionGroup.Breakfast:
                return "breakfast"
            case NutritionGroup.Lunch:
                return "lunch"
            case NutritionGroup.Dinner:
                return "dinner"
            case NutritionGroup.Snack:
                return "snack" 
            case NutritionGroup.PostWorkout:
                return "drink"
            case NutritionGroup.PreWorkout:
                return "preworkout"
            case NutritionGroup.Treats:
                return "treats"
        } 
    }

    get imageUrl() {
        switch (this) {
            case NutritionGroup.Breakfast:
                return IMAGE.NUTRITION_BREAKFAST
            case NutritionGroup.Lunch:
                return IMAGE.NUTRITION_LUNCH
            case NutritionGroup.Dinner:
                return IMAGE.NUTRITION_DINNER
            case NutritionGroup.Snack:
                return IMAGE.NUTRITION_SNACK
            case NutritionGroup.PostWorkout:
                return IMAGE.POST_WORKOUT
            case NutritionGroup.PreWorkout:
                return IMAGE.PRE_WORKOUT
            case NutritionGroup.Treats:
                return IMAGE.TREATS
        }
    }

    static get all() {
        return [
            this.Breakfast,
            this.Lunch,
            this.Dinner,
            this.Snack,
            this.PostWorkout,
            this.PreWorkout,
            this.Treats
        ]
    }
}