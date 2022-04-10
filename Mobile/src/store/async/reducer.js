import {
  ASYNC_ACTION_ERROR,
  ASYNC_ACTION_FINISH,
  ASYNC_ACTION_START,
} from './event';

const initialState = {
  isLoading: false,
  error: null,
  initialized: false,
};

export default function reducer(
  state = initialState,
  action,
) {
  console.log('action: ', action.type)
  switch (action.type) {
    case ASYNC_ACTION_START:
      return {
        ...state,
        isLoading: true,
      };
    case ASYNC_ACTION_FINISH:
      return {
        ...state,
        isLoading: false,
      };
    case ASYNC_ACTION_ERROR:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
}
