import {
    ASYNC_ACTION_START,
    ASYNC_ACTION_ERROR,
    ASYNC_ACTION_FINISH,
} from './event';

export function asyncActionStart() {
    return {
        type: ASYNC_ACTION_START,
    };
}

export function asyncActionFinish() {
    return {
        type: ASYNC_ACTION_FINISH,
    };
}

export function asyncActionError() {
    return {
        type: ASYNC_ACTION_ERROR,
    };
}
