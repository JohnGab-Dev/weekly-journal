import api from '../axiosInstance/api.js'

export function exportReport(data){
    const res = api.post('/student-export', data);

    return res
}

