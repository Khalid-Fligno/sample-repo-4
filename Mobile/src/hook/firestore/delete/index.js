import { db } from "../../../config/firebase";

export const deleteDocument = async (
  collectionName,
  id,
) => {
  await db
  .collection(collectionName)
  .doc(id)
  .delete();
}

export const deleteSubDocument = async (
  collectionName,
  collectionName1,
  id,
  id1,
) => {
  await db
    .collection(collectionName)
    .doc(id)
    .collection(collectionName1)
    .doc(id1)
    .delete()
}