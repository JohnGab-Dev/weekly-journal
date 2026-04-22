import api from '../axiosInstance/api.js'

export function exportReport(data, role){
    let url = ""

    if(role === 'employee'){
        url = '/employee-export'
    }else{
         url = '/student-export'
    }

    return api.post(url, data, {
        responseType: 'blob'
    });
}

