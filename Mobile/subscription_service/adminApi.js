const bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
let moment = require('moment');
const hostUrl='https://3.8.209.87';
var  admin  = require('./firebase');
const db= admin.firestore();
var jsonParser = bodyParser.json();
// exports.getUsers = async (req,res)=>{
//     res.send("admin api work")
// }
router.get('/',(req,res)=>{
    res.send("admin api work")
})

router.post('/addUser',jsonParser,async (req,res)=>{
    console.log(req.body.email)
    var data = req.body;
    if(await getUser(data.email)){
        res.status(400).json({success:false,message:"User already available with this email"});
    }else{
        admin
            .auth()
            .createUser({
                email: data.email,
                emailVerified: false,
                password: data.password,
                displayName: data.firstName,
                disabled: false,
            })
            .then(async(userRecord) => {
                console.log('Successfully created new user:', userRecord.uid);
                const userRef = await db.collection('users').doc(userRecord.uid);
                const userData = makeUserData(data,userRecord.uid)
                    userRef.set(userData,{merge:true}).then((response)=>{
                        if(data.selectedChallenge && data.selectedChallenge.length > 0){
                            Promise.all(data.selectedChallenge.map(challengeId=>{
                                return new Promise(async(resolve,reject)=>{
                                    const challengeData = await getChallengeById(challengeId);
                                    // console.log(challengeData)
                                    const makeChallengeData = createNewChallenge(challengeData);
                                    updateChallengesAgainstUser(makeChallengeData,userRecord.uid)
                                    .then(res1=>{
                                        if(!res1)
                                            console.log("failed while updating challenge")

                                        resolve();
                                    })
                                    .catch(err=>{
                                        console.log("failed while updating challenge")
                                        resolve();
                                    })
                                })
                            }))
                            .then((res1)=>{
                                res.status(200).json({success:true,message:"user added successfully with challenge "});
                            })
                            .catch(err=>{
                                res.status(200).json({success:true,message:"user added successfully but failed while adding challenge"});
                                console.log("Error",err)
                            })
                        }else{
                            res.json({ success:true,response:response,message:"user added successfully with challenge "});
                        }
                    })
                .catch((err)=>{
                    res.status(500).json({success:false,err:err})
                })
            })
            .catch((error) => {
                console.log('Error creating new user:', error);
            });
    }
})

router.post('/addUser',jsonParser,async (req,res)=>{
    console.log(req.body.email)
    var data = req.body;
        const userRef = await db.collection('users').doc(userRecord.uid);
        const userData = makeUserData(data,userRecord.uid)
            userRef.set(userData,{merge:true}).then((response)=>{
                if(data.selectedChallenge && data.selectedChallenge.length > 0){
                    Promise.all(data.selectedChallenge.map(challengeId=>{
                        return new Promise(async(resolve,reject)=>{
                            const challengeData = await getChallengeById(challengeId);
                            // console.log(challengeData)
                            const makeChallengeData = createNewChallenge(challengeData);
                            updateChallengesAgainstUser(makeChallengeData,userRecord.uid)
                            .then(res1=>{
                                if(!res1)
                                    console.log("failed while updating challenge")

                                resolve();
                            })
                            .catch(err=>{
                                console.log("failed while updating challenge")
                                resolve();
                            })
                        })
                    }))
                    .then((res1)=>{
                        res.status(200).json({success:true,message:"user added successfully with challenge "});
                    })
                    .catch(err=>{
                        res.status(200).json({success:true,message:"user added successfully but failed while adding challenge"});
                        console.log("Error",err)
                    })
                }else{
                    res.json({ success:true,response:response,message:"user added successfully with challenge "});
                }
            })
        .catch((err)=>{
            res.status(500).json({success:false,err:err})
        })
})
module.exports = router;


const makeUserData=(data,uid)=>{
    return {
        "id": uid,
        "firstName":data.firstName,
        "lastName":data.lastName,
        "email":data.email,
        "onboarded": false,
        "country":data.country,
        "signUpDate": new Date(),
        "fitnessLevel": data.fitnessLevel,
        "subscriptionInfo":{
            "expiry":new Date(data.subscriptionInfo.expiry).getTime()
        }
    }
}



const getUser = async(emailId) => {
    const userRef = await db.collection('users').where("email","==",emailId).get();
    if (userRef.size > 0) {
      return userRef.docs[0].data();
  }   
}

const createNewChallenge=(data)=>{
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
      "onBoardingInfo":{},
      "currentProgressInfo":{},
      "createdOn":data.createdOn?data.createdOn:moment(new Date()).format('YYYY-MM-DD'),
      "numberOfDays":data.numberOfDays,
      "numberOfWeeks":data.numberOfWeeks,
      "imageUrl":data.imageUrl,
      "shopifyProductId":data.shopifyProductId,
      "createdAt":data.createdAt,
      "productId":data.productId,
      "productReChargeId":data.productReChargeId,
      "isSchedule":false
      }
      return challenge
}

const getChallengeById = async(challengeId) => {
  
    const snapshot =await db.collection('challenges').where("id","==",challengeId)
     .get();
     if (snapshot.size > 0) {
      return snapshot.docs[0].data();
  }   
  }

const updateChallengesAgainstUser = async(challengeData,userId)=>{
    const challenge = db.collection('users').doc(userId).collection('challenges').doc(challengeData.id);
    challenge.set(challengeData,{merge:true})
    .then(res=>{
        return true
    })
    .catch(err=>{
        console.log("error while adding challenge against user",err);
        return false
    })
}