import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import username from './users';

const rootReducer = combineReducers({username, routing: routerReducer});

export default rootReducer;