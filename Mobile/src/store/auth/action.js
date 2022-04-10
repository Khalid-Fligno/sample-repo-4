import { getDocument } from "../../hook/firestore/read";
import { useStorage } from "../../hook/storage";
import {
    asyncActionError,
    asyncActionFinish,
    asyncActionStart
} from "../async/action";
import { SET_USER } from "./event";
import { navigate } from '../../navigation/Router';
import { isActiveChallenge } from "../../utils/challenges";

export const init = () => {

    return async function (dispatch) {
        dispatch(asyncActionStart());
        try {
            const uid = await useStorage.getItem('uid');
            console.log('UID: ', uid)
            if (uid) {
                dispatch(checkUserAuthorization("x7rilqmxCHh87un9lmNNIT7P02t1"));
            } else {
                navigate('AuthStack');
            }
            dispatch(asyncActionFinish());
        } catch (error) {
            console.log('error: ', error)
            dispatch(asyncActionError());
        } finally {
            dispatch(asyncActionFinish());
        }
    };
}

export const checkUserAuthorization = (uid) => {

    return async function (dispatch) {
        dispatch(asyncActionStart());
        try {
            const userDoc = await getDocument({
                collectionName: COLLECTION_NAMES.USERS,
                documentId: uid,
            });
            console.log('userDoc: ', userDoc)

            if (userDoc) {
                if (!userDoc?.onboarded) {
                    navigate('Onboarding1');
                } else {
                    isActiveChallenge().then((res) => {
                        if (res) navigate("Calendar");
                        else navigate("App");
                    });
                }
                dispatch({ type: SET_USER, payload: userDoc });
            }
            dispatch(asyncActionFinish());
        } catch (error) {
            dispatch(asyncActionError());
        } finally {
            dispatch(asyncActionFinish());
        }
    };
};