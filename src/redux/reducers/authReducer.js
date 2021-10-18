import jwt from 'jsonwebtoken';
import { getCookie } from '../../utils/cookie';


const token = getCookie('authorization');
const decodedData = jwt.decode(token) || { role: '', id: '' };
const {role, id: userId} = decodedData;

const initialState = { token, role, userId };

export const authReducer = (state = initialState, action) => {
    const {type, payload} = action;
    
    switch(type){
        case 'SIGN_IN':
            return { ...state, ...payload }
        case 'SIGN_OUT':
            return { ...state}
        default:
            return {...state};
    }
}