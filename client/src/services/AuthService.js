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
    const res = api.post('/email-verify', data);
    
    return res
}


export const verifyOtp = (data) => {
    const res = api.post('/otp-verify', data);
    
    return res
}

export const changePass = (data) => {
    const res = api.post('/change-pass', data);
    
    return res
}