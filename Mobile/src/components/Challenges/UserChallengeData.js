import moment from 'moment';
import momentTimezone from 'moment-timezone';
import { getCurrentChallengeDay } from '../../utils/challenges';

export default createUserChallengeData =(data,challengeDate, stringDate3, TODAY1, recipeId)=>{

    //TODO calculate current challenge day
    const currentChallengeDay = getCurrentChallengeDay(
        stringDate3,
        TODAY1
      );

    // console.log('TODAY1: ', TODAY1)
    // console.log('stringDate3: ', stringDate3)
    // console.log('currentChallengeDay: ', currentChallengeDay)

    console.log("recipeId111",recipeId)

    const phases = data.phases.map((res)=>{
        return (
            {
                "name":res.name,
                "displayName":res.displayName,
                "startDate":moment(challengeDate, 'YYYY-MM-DD').add(res.startDay-1,'days').format('YYYY-MM-DD'),
                "endDate":moment(challengeDate, 'YYYY-MM-DD').add(res.endDay-1,'days').format('YYYY-MM-DD'),
                "startDay":res.startDay,
                "endDay":res.endDay,
                "pdfUrl":res.pdfUrl
            }
        )
    })
    // "status":data.status?data.status":"InActive",
    const challenge = {
        "name":data.name,
        "displayName":data.displayName,
        "id":data.id,
        "tag":data.tag,
        "startDate":moment(challengeDate).format('YYYY-MM-DD'),
        "endDate":moment(challengeDate, 'YYYY-MM-DD').add(data.numberOfDays-1,'days').format('YYYY-MM-DD'),
        "status":data.status === "Active" ? "Active" : "InActive",
        "phases":phases,
        "workouts":[],
        "onBoardingInfo":data.onBoardingInfo?data.onBoardingInfo:{},
        "currentProgressInfo":{},
        // "createdOn":data.createdOn?data.createdOn:moment(new Date()).format('YYYY-MM-DD'),
        "numberOfDays":data.numberOfDays,
        "numberOfWeeks":data.numberOfWeeks,
        "imageUrl":data.imageUrl,
        "isSchedule":false,
        // "recipes":{"days": currentChallengeDay, "recipeId": recipeId}
    }
    return challenge
}