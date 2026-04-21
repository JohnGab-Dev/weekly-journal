import api from '../axiosInstance/api.js'

export const login = (data) => {
    const res = api.post('/login', data);

    return res
}

export const signup = (data) => {
     const res = api.post('/signup', data);

     return res
}

export const logout = () => {
    console.log(localStorage.getItem('token'))
    const res = api.post('/logout');
    
    return res
}