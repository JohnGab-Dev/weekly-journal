import api from '../axiosInstance/api.js'

//user management
export function AddUser(data){
    const res = api.post('/users-add', data);

    return res
}

export function EditUser(data, id){
    const res = api.post(`/users-edit?id=${id}`, data);

    return res
}

export function changePass(data, id){
    const res = api.post(`/users-cpass?id=${id}`, data);

    return res
}

export function DelUser(id){
    const res = api.post(`/users-delete?id=${id}`);

    return res
}

//event management
export function AddEvent(data){
    const res = api.post('/events-add', data);

    return res
}

export function EditEvent(data, id){
    const res = api.post(`/events-edit?id=${id}`, data);

    return res
}
export function DelEvent(id){
    const res = api.post(`/events-delete?id=${id}`);

    return res
}

//account settings
export function UpdateProfile(data){
    const res = api.post(`/edit-profile`, data);

    return res
}

export function ChangePassword(data){
    const res = api.post(`/change-password`, data);

    return res
}

//retrieve account
export function RetriveAccount(id){
    const res = api.post(`/users-retrieve?id=${id}`);

    return res
}
