import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from './rootReducer';
import thunk from 'redux-thunk';

let composeEnhancers = compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk)),
);

export default store;