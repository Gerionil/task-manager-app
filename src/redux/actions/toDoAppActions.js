export const addNewEl = data => {
    return {
        type: 'ADD_NEW_EL',
        payload: data
    }
}
export const deleteEl = data => {
    return{
        type: 'DELETE_EL',
        payload: data
    }
}

export const downloadNewEl = data => {
    return {
        type: 'DOWNLOAD_NEW_EL',
        payload: data
    }
}

export const checkEl = data => {
    return{
        type: 'CHECK_EL',
        payload: data
    }
}

export const changeTextValue = data => {
    return {
        type: 'CHANGE_TEXT_VALUE',
        payload: data
    }
}

export const changeSearchTextValue = data => {
    return {
        type: 'CHANGE_SEARCH_TEXT_VALUE',
        payload: data
    }
}
export const switchSearchActive = data => {
    return{
        type: 'SWITCH_SEARCH_ACTIVE',
        payload: data
    }
}

export const changeFoundItems = data => {
    return {
        type: 'CHANGE_FOUND_ITEMS',
        payload: data
    }
}