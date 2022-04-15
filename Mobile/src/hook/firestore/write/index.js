import { db } from "../../../config/firebase";

export const addDocument = async (
    collectionName,
    id,
    data
) => {
    const docRef = await db
        .collection(collectionName)
        .doc(id)

    if (docRef) {
        return docRef.set(data, { merge: true });
    } else {
        return undefined
    }
}

export const addSubDocument = async (
    collectionName,
    collectionName1,
    id,
    id1,
    data
) => {
    const docRef = await db
        .collection(collectionName)
        .doc(id)
        .collection(collectionName1)
        .doc(id1)

    if (docRef) {
        return docRef.set(data, { merge: true });
    } else {
        return undefined
    }
}