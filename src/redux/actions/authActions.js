export const restoreAuth = data => {
    console.log('RESTORE_AUTH', data);

    return {
        type: 'RESTORE_AUTH',
        payload: data
    }
}

export const signIn = data => {
    console.log('signIn', data);
    return {
        type: 'SIGN_IN',
        payload: data
    }
}
export const signOut = data => {
    
    return {
        type: 'SIGN_OUT',
        payload: data
    }
}