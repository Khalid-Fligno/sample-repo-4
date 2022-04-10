import { db } from "../../../config/firebase";

export const getDocument = async ({
    collectionName,
    documentId,
}) => {
    const document = await db
        .collection(collectionName)
        .doc(documentId)
        .get();

    if (!document.exists) {
        return null
    }
    
    return document.data();
};