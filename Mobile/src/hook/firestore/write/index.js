import { db } from "../../../config/firebase";

export const addDocument = async (
    collectionName,
    id,
    data
) => {
    await db.collection(collectionName).doc(id).set(data, { merge: true })
}

export const addSubDocument = async (
    collectionName,
    collectionName1,
    id,
    id1,
    data
) => {
    await db
        .collection(collectionName)
        .doc(id)
        .collection(collectionName1)
        .doc(id1)
        .set(data, { merge: true });
}