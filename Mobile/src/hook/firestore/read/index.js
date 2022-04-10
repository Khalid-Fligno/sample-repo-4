import { db } from "../../../config/firebase";

export const getDocument = async ({
    collectionName,
    documentId,
}) => {
    const document = await db
        .collection(collectionName)
        .doc(documentId)
        .get();

    if (document) {
        return document.data();
    } else {
        return undefined
    }
    
};