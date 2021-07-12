const bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
let moment = require('moment');
var  admin  = require('./firebase');
const db= admin.firestore();
const storage = admin.storage();
const bucket = storage.bucket()
var jsonParser = bodyParser.json();
// exports.getUsers = async (req,res)=>{
//     res.send("admin api work")
// }
router.get('/',(req,res)=>{
    res.send("admin api work")
})

router.get('/getModels',jsonParser,async (req,res)=>{
    const data = await (await db.collection('workoutCategories').doc('modelNamesList').get()).data();
    if(data)
        res.status(200).json(data);
    else
        res.status(200).json([]);    
})
router.get('/getChallengeTag',jsonParser,async (req,res)=>{
  const Tags = [
    {label:"Subscription",value:'Subscription'},
    {label:"Challenge",value:'Challenge'},
  ];
  res.status(200).json(Tags);    

    // const challengeRef = await db.collection('challenges').get();
    // if(challengeRef.empty){
    //   res.status(200).json(Tags);    
    // }else{
    //   challengeRef.docs.forEach(challenge=>{
    //     Tags.push({label:challenge.data().displayName,value:challenge.data().tag})
    //   })
    //   res.status(200).json(Tags)
    // }
})
router.post('/addUser',jsonParser,async (req,res)=>{
    console.log(req.body.email)
    var data = req.body;
    if(await getUser(data.email)){
        res.status(200).json({success:false,message:"User already available with this email"});
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
                            res.json({ success:true,response:response,message:"user added successfully"});
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

router.post('/updateUser',jsonParser,async (req,res)=>{
    var data = req.body;
        const userRef = await db.collection('users').doc(data.id);
        const userData = data.subscriptionInfo.expiry ?{
            "subscriptionInfo":{
                "expiry":new Date(data.subscriptionInfo.expiry).getTime()
            }
        }:{}
            userRef.set(userData,{merge:true}).then((response)=>{
                console.log("user updtaed")
                if(data.selectedChallenge && data.selectedChallenge.length > 0){
                    Promise.all(data.selectedChallenge.map(challengeId=>{
                        return new Promise(async(resolve,reject)=>{
                            const challengeData = await getChallengeById(challengeId);
                            const makeChallengeData = createNewChallenge(challengeData);
                            updateChallengesAgainstUser(makeChallengeData,data.id)
                            .then(res1=>{
                                if(!res1)
                                    console.log("failed while updating challenge or already present in user collection")

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
                        res.status(200).json({success:true,message:"user added successfully but failed while adding challenge or Challenge already present in user db"});
                        console.log("Error",err)
                    })
                }else{
                    res.json({ success:true,response:response,message:"user added successfully"});
                }
            })
        .catch((err)=>{
            res.status(500).json({success:false,err:err})
        })
})

router.post('/deleteUser',jsonParser,async(req,res)=>{
    const uid = req.body.id
    console.log("mmmm",uid)
    db.collection('users').doc(uid).delete()
    .then((res1)=>{
        console.log("success")
        admin
            .auth()
            .deleteUser(uid)
            .then(() => {
                console.log('Successfully deleted user');
            })
            .catch((error) => {
                console.log('Error deleting user:', error);
            });
        bucket.deleteFiles({
          prefix: `user-photos/${uid}`
        }, function(err) {
          if (!err) {
            console.log("file deleted")
          }
        });
      res.send({success:true})
    })
    .catch((err)=>{
        console.log(err)
      res.status(500).json({success:false,err:err})
    })
  })
  
//Exercise------
router.post('/addEditExercise',jsonParser, async(req, res) => {
    console.log(req.body)
    const recipeRef = await db.collection('Exercises').doc(req.body.id);
      recipeRef.set(req.body,{merge:true}).then((response)=>{
        res.json({ success:true,response:response});
      })
      .catch((err)=>{
        res.status(500).json({success:false,err:err})
      })
  });
  
  router.post('/deleteExercise',jsonParser,async(req,res)=>{
    db.collection('Exercises').doc(req.body.id).delete()
    .then((res)=>{
        bucket.deleteFiles({
          prefix: `Exercises/${req.body.id}`
        }, function(err) {
          if (!err) {
            console.log("file deleted")
          }
        });
      res.send({success:true})
    })
    .catch((err)=>{
      res.status(500).json({success:false,err:err})
    })
  
  })

//Warm Up And Cool Down Exercise
router.post('/addEditWCExercise',jsonParser, async(req, res) => {
    console.log(req.body)
    const recipeRef = await db.collection('WarmUpCoolDownExercises').doc(req.body.id);
      recipeRef.set(req.body,{merge:true}).then((response)=>{
        res.json({ success:true,response:response});
      })
      .catch((err)=>{
        res.status(500).json({success:false,err:err})
      })
  });
  
  router.post('/deleteWCExercise',jsonParser,async(req,res)=>{
    db.collection('WarmUpCoolDownExercises').doc(req.body.id).delete()
    .then((res)=>{
        bucket.deleteFiles({
          prefix: `WarmUpCoolDownExercises/${req.body.id}`
        }, function(err) {
          if (!err) {
            console.log("file deleted")
          }
        });
      res.send({success:true})
    })
    .catch((err)=>{
      res.status(500).json({success:false,err:err})
    })
  
  })

  //Workout
router.post('/addEditWorkout',jsonParser, async(req, res) => {
  console.log(req.body)
  const recipeRef = await db.collection('newWorkouts').doc(req.body.id);
    recipeRef.set(req.body,{merge:true}).then((response)=>{
      res.json({ success:true,response:response});
    })
    .catch((err)=>{
      res.status(500).json({success:false,err:err})
    })
});

router.post('/deleteWorkout',jsonParser,async(req,res)=>{
  db.collection('newWorkouts').doc(req.body.id).delete()
  .then((res)=>{
    res.send({success:true})
  })
  .catch((err)=>{
    res.status(500).json({success:false,err:err})
  })

})


//program------
router.post('/addEditChallenge',jsonParser,async(req,res)=>{
  const workoutRef = await db.collection('challenges').doc(req.body.id);
  workoutRef.set(req.body,{merge:true}).then((response)=>{
    res.json({ success:true,response:response});
  })
  .catch((err)=>{
    res.status(500).json({success:false,err:err})
  })
})

router.post('/deleteChallenge',jsonParser,async(req,res)=>{
  db.collection('challenges').doc(req.body.id).delete()
  .then((res)=>{
      bucket.deleteFiles({
        prefix: `Challenges/${req.body.id}`
      }, function(err) {
        if (!err) {
          console.log("file deleted")
        }
      });
    res.send({success:true})
  })
  .catch((err)=>{
    res.status(500).json({success:false,err:err})
  })
})

//Recipe----- 
router.post('/addEditRecipe', jsonParser,async(req, res) => {
  console.log(req.body)
  const recipeRef = await db.collection('recipes').doc(req.body.id);
    recipeRef.set(req.body,{merge:true}).then((response)=>{
      res.status(200).json({ success:true,response:response});
    }).catch(err=>res.status(500).json(err))
});

router.get('/getRecipes',jsonParser,async (req,res)=>{
  var data = []
  const recipeRef = db.collection('recipes');
  const snapshot = await recipeRef.get();
  snapshot.forEach(doc => {
    data.push(doc.data());
  });
  res.json({success:true,data:data})
})

router.post('/deleteRecipe',jsonParser,async(req,res)=>{
  db.collection('recipes').doc(req.body.id).delete()
  .then((res)=>{
      bucket.deleteFiles({
        prefix: `Recipes/${req.body.id}`
      }, function(err) {
        if (!err) {
          console.log("file deleted")
        }
      });
    res.send({success:true})
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
      "productReChargeId":data.productReChargeId?data.productReChargeId:null,
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
    getUserChallenge(userId,challengeData.id)
    .then((res)=>{
        if(res){
            return false
        }else{
          console.log("Heree....",challengeData)
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
    })

}

const getUserChallenge = async(userId,challengeId)=>{
    console.log(">>>/",userId,challengeId)
    const snapshot=await db.collection('users').doc(userId).collection('challenges').where("id","==",challengeId)
    .get();
    if (snapshot.size > 0) {
     return true
    }else{
        return false
    }
  }