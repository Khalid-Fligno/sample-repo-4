import moment from 'moment';
import momentTimezone from 'moment-timezone';

export default createUserChallengeData =(data,challengeDate)=>{
  // console.log("Active Challenge data",data)
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
    const challenge = {
      "name":data.name,
      "displayName":data.displayName,
      "id":data.id,
      "tag":data.tag,
      "startDate":moment(challengeDate).format('YYYY-MM-DD'), 
      "endDate":moment(challengeDate, 'YYYY-MM-DD').add(data.numberOfDays-1,'days').format('YYYY-MM-DD'),
      "status":data.status?data.status:"InActive",
      "phases":phases,
      "workouts":[],
      "onBoardingInfo":data.onBoardingInfo?data.onBoardingInfo:{},
      "currentProgressInfo":{},
      // "createdOn":data.createdOn?data.createdOn:moment(new Date()).format('YYYY-MM-DD'),
      "numberOfDays":data.numberOfDays,
      "numberOfWeeks":data.numberOfWeeks,
      "imageUrl":data.imageUrl,
      "isSchedule":false
    }
    return challenge
  }