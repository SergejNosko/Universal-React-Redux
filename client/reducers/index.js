import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import users from './users';

const rootReducer = combineReducers({users, routing: routerReducer});

export default rootReducer;