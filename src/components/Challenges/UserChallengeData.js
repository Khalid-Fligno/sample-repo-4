import moment from 'moment';
import momentTimezone from 'moment-timezone';

export default createUserChallengeData =(data)=>{
    const phases = data.phases.map((res)=>{
      return (
        {
          "name":res.name,
          "displayName":res.displayName,
          "startDate":moment(new Date(), 'YYYY-MM-DD').add(res.startDay-1,'days').format('YYYY-MM-DD'),
          "endDate":moment(new Date(), 'YYYY-MM-DD').add(res.endDay-1,'days').format('YYYY-MM-DD'),
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
      "startDate":moment(new Date()).format('YYYY-MM-DD'), 
      "endDate":moment(new Date(), 'YYYY-MM-DD').add(data.numberOfDays-1,'days').format('YYYY-MM-DD'),
      "status":data.status?data.status:"InActive",
      "phases":phases,
      "workouts":[],
      "onBoardingInfo":data.onBoardingInfo?data.onBoardingInfo:{},
      "currentProgressInfo":{},
      "createdOn":data.createdOn?data.createdOn:moment(new Date()).format('YYYY-MM-DD'),
      "numberOfDays":data.numberOfDays,
      "numberOfWeeks":data.numberOfWeeks,
      "imageUrl":data.imageUrl
    }
    return challenge
  }