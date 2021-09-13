const initialState = {
   items: [],
   text: '',
   searchText: '',
   searchActive: false,
   foundItems: []


};
export const toDoAppReducer = (state = initialState, action) => {
    const { type, payload } = action;
    const { items }= state;
    switch(type){
        case 'ADD_NEW_EL':
            return {...state, items: items.concat(payload)}
            break;
        case 'DELETE_EL':
            return {...state, items: payload}
            break;
        case 'DOWNLOAD_NEW_EL':
            return {...state, items: payload}
            break;
        case 'CHECK_EL':
            return {...state, items: payload}
            break;
        case 'CHANGE_TEXT_VALUE':
            return {...state, text: payload}
            break;
        case 'CHANGE_SEARCH_TEXT_VALUE':
            return {...state, searchText: payload}
            break
        case 'SWITCH_SEARCH_ACTIVE':
            return {...state, searchActive: payload}
            break;
        case 'CHANGE_FOUND_ITEMS':
            return{...state, foundItems: payload}
            break;
        default:
            return {...state};
        
    }

    
    
}  