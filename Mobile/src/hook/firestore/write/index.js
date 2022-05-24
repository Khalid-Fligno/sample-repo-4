import { db } from "../../../config/firebase";

export const addDocument = async (
  collectionName,
  id,
  data
) => {
  return await db
  .collection(collectionName)
  .doc(id)
  .set(data, { merge: true })
  .then((res) => {
    return true
  })
  .catch((err) => console.log(err));
}

export const addSubDocument = async (
  collectionName,
  collectionName1,
  id,
  id1,
  data
) => {
  return await db
    .collection(collectionName)
    .doc(id)
    .collection(collectionName1)
    .doc(id1)
    .set(data, { merge: true })
    .then((res) => {})
    .catch((err) => console.log(err));
}