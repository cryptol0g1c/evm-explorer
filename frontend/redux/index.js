import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import {
    loading
} from './reducers';

export default createStore(
    combineReducers({
        loading
    }),
    composeWithDevTools(
        applyMiddleware(
            thunk
        )
    )
);
