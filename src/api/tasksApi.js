import axios from 'axios';


export const tasksApi = {

    // getTasks: async (accessToken) => {
    //     return axios.get('http://localhost:3007/tasks',{
    //         headers:{
    //             authorization: `Bearer ${accessToken}`
    //         }
    //     })
    // },
    getTasks: async (accessToken,number) => {
        return axios.get(`http://localhost:3007/tasks?pageSize=1&pageNumber=${number}`,{
            headers:{
                authorization: `Bearer ${accessToken}`
            }
        })
    },

    getTasksForAdmin: async (accessToken, id) => {
        return axios.get(`http://localhost:3007/tasks/${id}`,{
            headers:{
                authorization: `Bearer ${accessToken}`
            }
        })
    },

    createTask: async (body,accessToken) => {
        return axios.post('http://localhost:3007/tasks',body, {
            headers:{
                authorization: `Bearer ${accessToken}`
            }
        })
    },

    changeTask: async(body, accessToken) => {
        return axios.patch('http://localhost:3007/tasks', body, {
            headers:{
                authorization: `Bearer ${accessToken}`
            }
        })
    },

    deleteTask: async(id, userId, accessToken) => {

        const options = { 
            data:{
                id:id,
                userId: userId,
            },
            headers:{
                authorization: `Bearer ${accessToken}`
            }
        }

        return axios.delete(`http://localhost:3007/tasks`, options)
    }
}