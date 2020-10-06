import moment from 'moment';
import momentTimezone from 'moment-timezone';

export default createUserChallengeData =(data)=>{
    const phases = data.phases.map((res)=>{
      return (
        {
          "name":res.name,
          "displayName":res.displayName,
          "startDate":moment(new Date(), 'YYYY-MM-DD').add(res.startDay-1,'days').format('YYYY-MM-DD'),
          "endDate":moment(new Date(), 'YYYY-MM-DD').add(res.endDay-1,'days').format('YYYY-MM-DD')
        }
      )
    })
    const challenge = {
      "name":data.name,
      "displayName":data.displayName,
      "id":data.id,
      "startDate":moment(new Date()).format('YYYY-MM-DD'), 
      "endDate":moment(new Date(), 'YYYY-MM-DD').add(data.numberOfDays-1,'days').format('YYYY-MM-DD'),
      "status":"InActive",
      "phases":phases,
      "workouts":[],
      "onBoardingInfo":{},
      "currentProgressInfo":{}
    }
    return challenge
  }