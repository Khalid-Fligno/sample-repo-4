import { getDocument } from "../../hook/firestore/read";
import { useStorage } from "../../hook/storage";
import {
    asyncActionError,
    asyncActionFinish,
    asyncActionStart
} from "../async/action";
import { SET_USER } from "./event";
import { navigate } from '../../navigation/RootNavigation';

export const init = () => {

    return async function (dispatch) {
        dispatch(asyncActionStart());
        try {
            const uid = await useStorage.getItem('uid');
            console.log('UID: ', uid)
            if (uid) {
                dispatch(checkUserAuthorization(uid));
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
                    navigate('OnboardingStack', { screen: 'Subscription' });
                } else {
                    console.log('Onboard!')
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