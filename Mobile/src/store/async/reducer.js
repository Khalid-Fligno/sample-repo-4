import {
  ASYNC_ACTION_ERROR,
  ASYNC_ACTION_FINISH,
  ASYNC_ACTION_START,
} from './constants';

const initialState = {
  isLoading: false,
  error: null,
  initialized: false,
};

export default function reducer(
  state = initialState,
  action,
) {
  switch (action.type) {
    case ASYNC_ACTION_START:
      return {
        ...state,
        isLoading: true,
        error,
      };
    case ASYNC_ACTION_FINISH:
      return {
        ...state,
        isLoading: false,
        error,
      };
    case ASYNC_ACTION_ERROR:
      return {
        ...state,
        isLoading: false,
        error,
      };
    default:
      return state;
  }
}
