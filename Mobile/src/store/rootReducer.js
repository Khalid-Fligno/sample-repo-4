import {combineReducers} from 'redux';
import asyncReducer from './async/reducer';
import authReducer from './auth/reducer';

const rootReducer = (state, action) => {
  const allReducers = combineReducers({
    auth: authReducer,
    async: asyncReducer,
  });

  return allReducers(state, action);
};

export default rootReducer;