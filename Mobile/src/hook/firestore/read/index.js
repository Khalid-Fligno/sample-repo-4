import { db } from "../../../config/firebase";

export const getDocument = async (
    collectionName,
    documentId
) => {
    const docRef = await db
        .collection(collectionName)
        .doc(documentId)
        .get();

    if (docRef.exists) {
        return docRef.data();
    } else {
        return undefined
    }
};

export const getUser = async (
    collectionName,
    fieldName,    
    email,
) => {
    const userRef = await db
        .collection(collectionName)
        .where(fieldName, "==", email)
        .get();

    if (userRef.size > 0) {
        return userRef.docs[0].data();
    } else {
        return undefined;
    }
}