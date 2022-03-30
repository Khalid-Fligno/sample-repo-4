import {combineReducers} from 'redux';
import asyncReducer from './async/reducer';

const rootReducer = (state, action) => {
  const allReducers = combineReducers({
    async: asyncReducer,
  });

  return allReducers(state, action);
};

export default rootReducer;