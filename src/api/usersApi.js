import axios from 'axios';

export const usersApi = {

    checkUsersExists: async (body) => {
        return axios.post('http://localhost:3007/user/exists', body)
    },
    
    getAdmins: async (body) => {
        return axios.get('http://localhost:3007/admins')
    }
}