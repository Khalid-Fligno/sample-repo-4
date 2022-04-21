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
  value,
) => {
  const userRef = await db
    .collection(collectionName)
    .where(fieldName, "==", value)
    .get();

  if (userRef.size > 0) {
    return userRef.docs[0].data();
  } else {
    return undefined;
  }
}

export const getUserChallenge = async (
  collectionName,
  collectionName1,
  value
) => {
  const userRef = await db
    .collection(collectionName)
    .doc(value.id)
    .collection(collectionName1)
    .get();

  if (userRef.size > 0) {
    return userRef.docs[0].data();
  } else {
    return undefined;
  }
}

export const getUserSpecificField = async (
  collectionName,
  fieldName,
  fieldName1,
  value,
  value1
) => {
  const userRef = await db
    .collection(collectionName)
    .where(fieldName, "==", value)
    .where(fieldName1, "==", value1)
    .get();

  if (userRef.size > 0) {
    return userRef.docs[0].data();
  } else {
    return undefined;
  }
}

export const getSpecificSubCollection = async (
  collectionName,
  collectionName1,
  fieldName,
  value,
  value1
) => {
  const docsRef = await db
  .collection(collectionName)
  .doc(value)
  .collection(collectionName1)
  .where(fieldName, "in", [value1])
  .get()

  if (docsRef.size > 0) {
    return docsRef
  } else {
    return undefined;
  }
}