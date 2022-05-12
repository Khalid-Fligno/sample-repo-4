import AsyncStorage from "@react-native-community/async-storage";
import { Alert } from "react-native";
import FastImage from "react-native-fast-image";
import { FileSystem } from "react-native-unimodules";
import { db } from "../config/firebase";
import { getCollection, getSpecificCollection } from "../hook/firestore/read";
import { COLLECTION_NAMES } from "../library/collections";

export const findFocus = (workoutObject) => {
  if (
    workoutObject.filters &&
    workoutObject.filters.indexOf("upperBody") > -1
  ) {
    return "Upper Body";
  } else if (
    workoutObject.filters &&
    workoutObject.filters.indexOf("lowerBody") > -1
  ) {
    return "Lower Body";
  } else if (
    workoutObject.filters &&
    workoutObject.filters.indexOf("fullBody") > -1
  ) {
    return "Full Body";
  } else if (
    workoutObject.filters &&
    workoutObject.filters.indexOf("core") > -1
  ) {
    return "Core";
  }
  return null;
};

export const findLocation = (workoutObject) => {
  if (workoutObject.gym) {
    return "Gym";
  } else if (workoutObject.home) {
    return "Home";
  } else if (workoutObject.outdoors) {
    return "Outdoors";
  }
  return null;
};

export const findFocusIcon = (workout) => {
  let focus;
  if (workout.filters && workout.filters.indexOf("fullBody") > -1) {
    focus = "full";
  } else if (workout.filters && workout.filters.indexOf("upperBody") > -1) {
    focus = "upper";
  } else if (workout.filters && workout.filters.indexOf("lowerBody") > -1) {
    focus = "lower";
  } else if (workout.filters && workout.filters.indexOf("core") > -1) {
    focus = "lower";
  } else {
    focus = "lower";
  }
  return `workouts-${focus}`;
};

export const findWorkoutType = (workout) => {
  let type = "strength";
  if (workout.filters && workout.filters.includes("interval")) {
    type = "interval";
  } else if (workout.filters && workout.filters.includes("circuit")) {
    type = "circuit";
  }
  return type;
};

export const getLastExercise = (
  exerciseList,
  currentExerciseIndex,
  workout,
  setCount
) => {
  let lastExercise = false;
  let nextExerciseName = "";
  if (
    !exerciseList[currentExerciseIndex + 1] &&
    workout.workoutProcessType === "oneByOne"
  ) {
    lastExercise = true;
    // nextExerciseName = "NEARLY DONE!";
    nextExerciseName =
      typeof workout.coolDownExercises === "undefined"
        ? "NEARLY DONE!"
        : workout.coolDownExercises[0].name;
  } else if (
    !exerciseList[currentExerciseIndex + 1] &&
    setCount === workout.workoutReps
  ) {
    lastExercise = true;
    nextExerciseName = "NEARLY DONE!";
  } else {
    if (exerciseList[currentExerciseIndex + 1]) {
      nextExerciseName = exerciseList[currentExerciseIndex + 1].displayName;
    } else {
      nextExerciseName = exerciseList[0].displayName;
    }
  }
  return {
    isLastExercise: lastExercise,
    nextExerciseName: nextExerciseName,
  };
};

export const getLastExerciseWC = (
  exerciseList,
  currentExerciseIndex,
  workout,
  setCount
) => {
  let lastExercise = false;
  let nextExerciseName = "";
  if (!exerciseList[currentExerciseIndex + 1]) {
    lastExercise = true;
    // nextExerciseName = "NEARLY DONE!";
    nextExerciseName =
      exerciseList[0].type === "coolDown"
        ? "NEARLY DONE!"
        : workout.exercises[0].name;
  } else {
    if (exerciseList[currentExerciseIndex + 1]) {
      nextExerciseName = exerciseList[currentExerciseIndex + 1].displayName;
    } else {
      nextExerciseName = exerciseList[0].displayName;
    }
  }
  return {
    isLastExercise: lastExercise,
    nextExerciseName: nextExerciseName,
  };
};

export const showNextExerciseFlag = (workout, setCount, rest) => {
  let showNextExercise = false;
  if (
    workout.workoutProcessType === "oneByOne" &&
    setCount === workout.workoutReps
  ) {
    showNextExercise = true;
  } else if (rest && !workout.count) {
    showNextExercise = true;
  } else if (workout.count && workout.workoutProcessType === "circular") {
    showNextExercise = true;
  }
  return showNextExercise;
};

export const setRestImages = async () => {
  var restImages = (
    await db.collection("RestImages").doc("WFTvMwRtK5W0krXnIT4o").get()
  ).data();
  // console.log("rest images",restImages);
  if (restImages && restImages.images.length > 0) {
    FastImage.preload(
      restImages.images.map((res) => {
        return { uri: res };
      })
    );
    await AsyncStorage.setItem("restImages", JSON.stringify(restImages.images));
  }
};

export const getRandomRestImages = async () => {
  const getRandomNumber = (length) => Math.floor(Math.random() * length + 0);
  var images = JSON.parse(await AsyncStorage.getItem("restImages"));
  // console.log("getting rest images", images[getRandomNumber(images.length)]);
  return images[getRandomNumber(images.length)];
};

export const loadExercise = async (workoutData, setFiles) => {
  console.log('workoutData: ', workoutData)

  await FileSystem.readDirectoryAsync(`${FileSystem.cacheDirectory}`).then(
    (res) => {
      Promise.all(
        res.map(async (item, index) => {
          console.log('item: ', item)
          if (
            item.includes("exercise-")
          ) {
            FileSystem.deleteAsync(`${FileSystem.cacheDirectory}${item}`, {
              idempotent: true,
            })
              .then((item) => {
                console.log('item: ', item)
              })
              .catch((err) => {
                console.log('Error Reading Filesystem: ', err)
              })
          }
        })
      );
    }
  );

  if (workoutData.newWorkout) {
    let exercises = [];
    let tempExerciseData = [];
    let workoutExercises = [];
    const exerciseRef = await getCollection(
      COLLECTION_NAMES.EXERCISES
    )

    if (!exerciseRef) {
      console.log('Error exerciseRef')
    }

    if (
      workoutData.filters.includes('interval') &&
      workoutData.filters &&
      workoutData.filters.length > 0
    ) {
      exerciseRef.forEach((exercise) => {
        if (workoutData.exercises && workoutData.exercises?.length > 0) {
          workoutData.exercises.forEach((resExercise) => {
            if (resExercise.id === exercise.id) {
              const exerciseDuration = Object.assign({}, exercise.data(), {
                duration: resExercise.duration,
              });
              tempExerciseData.push(exerciseDuration);
            }
            workoutExercises = workoutData.exercises.map((id) => {
              return tempExerciseData.find((res) => res.id === id);
            });
          });
        }
      });
    } else {
      exerciseRef.forEach((exercise) => {
        if (workoutData.exercises && workoutData.exercises?.length > 0) {
          workoutData.exercises.forEach((resExercise) => {
            if (resExercise === exercise.id) {
              tempExerciseData.push(exercise.data());
            }
            workoutExercises = workoutData.exercises.map((id) => {
              return tempExerciseData.find((res) => res.id === id);
            });
          });
        }
      });
    }

    exercises =
      workoutData.exercises &&
      workoutData.exercises?.length > 0 &&
      workoutData.exercises.map((id) => {
        if (id.id) {
          return tempExerciseData.find((res) => res.id === id.id);
        } else {
          return tempExerciseData.find((res) => res.id === id);
        }
      });

    if (exercises?.length > 0) {
      workoutData = Object.assign({}, workoutData, { exercises: exercises });
      const res = await downloadExercise(workoutData, setFiles);
      if (res) return workoutData;
      else return false;
    } else {
      return false;
    }
  } else {
    const res = await downloadExercise(workoutData, setFiles);
    if (res) return workoutData;
    else return false;
  }
};

const downloadExercise = async (workout, setFiles) => {
  try {
    const exercises =
      workout?.exercises && workout?.exercises?.length > 0
        ? workout?.exercises
        : [];

    return Promise.all(
      exercises.map(async (exercise, index) => {
        return new Promise(async (resolve, reject) => {
          let videoIndex = 0;
          if (workout.newWorkout) {
            if (exercise.videoUrls && exercise.videoUrls?.length > 0) {
              videoIndex = exercise.videoUrls.findIndex(
                (res) => res.model === workout.exerciseModel
              );
            }
          }
          if (exercise.videoUrls && exercise.videoUrls[0].url !== "") {
            const downloadResumable = FileSystem.createDownloadResumable(
              exercise.videoUrls[videoIndex].url,
              `${FileSystem.cacheDirectory}exercise-${index + 1}.mp4`,
              {}
            );

            await downloadResumable
              .downloadAsync()
              .then((res) => {
                if(res.status === 200){
                  resolve(exercise);
                  setFiles(res.complete)
                }
              })
              .catch(() => resolve("Error Download"));
          } else {
            resolve("no video found");
          }
        });
      }),
    );
  } catch (err) {
    console.log(err);
    Alert.alert("Something went wrong", "Workout Not Available");
    return "false";
  }
};

export const downloadExerciseWC = async (
  workout,
  exerciseIds,
  exerciseModel,
  type,
  setFiles
) => {
  try {
    let exercises = [];
    const exerciseRef = (
      await db
        .collection("WarmUpCoolDownExercises")
        .where("id", "in", exerciseIds)
        .get()
    ).docs;
    const tempExerciseData =
      exerciseRef.map((exercise) => {
        return exercise.data();
      }) || [];

    exercises =
      exerciseIds.map((id) => {
        return tempExerciseData.find((res) => res.id === id);
      }) || [];

    return Promise.all(
      exercises.map(async (exercise, index) => {
        return new Promise(async (resolve, reject) => {
          let videoIndex = 0;
          if (workout.newWorkout)
            videoIndex = exercise.videoUrls.findIndex(
              (res) => res.model === exerciseModel
            );
          if (exercise.videoUrls && exercise.videoUrls[0].url !== "") {
            const downloadResumable = FileSystem.createDownloadResumable(
              exercise.videoUrls[videoIndex].url,
              `${FileSystem.cacheDirectory}exercise-${type}-${index + 1}.mp4`,
              {}
            );
            await downloadResumable
              .downloadAsync()
              .then((res) => {
                if(res.status === 200){
                  resolve(exercise);
                  setFiles(res.complete)
                }
              })
              .catch(() => resolve("Error Download"));
          }
        });
      })
    );
  } catch (err) {
    console.log(err);
    Alert.alert("Something went wrong", "Workout Not Available");
    return "false";
  }
};

export const convertDuration = (exerciseDur) => {
  var mins = Math.trunc(exerciseDur / 60);
  var sec = exerciseDur % 60;
  return mins + "min " + sec + "s";
};
