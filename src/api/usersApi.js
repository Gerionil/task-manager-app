import axios from 'axios';



export const usersApi = {

    getUsers: async (accessToken) => {
        return axios.get('http://localhost:3007/users',{
            headers:{
                authorization: `Bearer ${accessToken}`
            }
        })
    },

    checkUsersExists: async (body) => {
        return axios.post('http://localhost:3007/user/exists', body)
    },
    
    getAdmins: async () => {
        return axios.get('http://localhost:3007/admins')
    }
}