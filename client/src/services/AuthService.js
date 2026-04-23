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
    const res = api.post('/logout');
    
    return res
}


export const emailVerify = (data) => {
    const res = api.post('/verify-email', data, { 'Content-Type': 'application/json' });
    
    return res
}


export const verifyOtp = (email, data) => {
    const res = api.post(`/verify-otp?email=${email}`, data, { 'Content-Type': 'application/json' });
    
    return res
}

export const changePass = (userId, data) => {
    const res = api.post(`/change-pass?id=${userId}`, data);
    
    return res
}