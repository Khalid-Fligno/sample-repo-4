export const addDocument = async (
    collectionName,
    data
) => {
    const docRef = await firestore
        .collection(collectionName)
        .doc(data.id)

    docRef
        .set(data)
        .then((res) => { })
        .catch((error) => {
            console.log("new user added error", error);
        });
};