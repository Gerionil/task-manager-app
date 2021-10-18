import { combineReducers } from 'redux';

import { toDoAppReducer } from './toDoAppReducer'
import { authReducer } from './authReducer'

const rootReducer = combineReducers({ toDoAppReducer, authReducer });

export default rootReducer;