import { db } from "../../../config/firebase";

export const addDocument = async (
    collectionName,
    id,
    data
) => {
    const docRef = await db
        .collection(collectionName)
        .doc(id)

    docRef.set(data, { merge: true });
}