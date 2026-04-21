import api from '../axiosInstance/api.js'

export function addReport(data){
    const res = api.post('/add-report', data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res
}

export function editReport(id, data){
    const res = api.post(`/edit-report?id=${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res
}

export function delReportDate(id){
    const res = api.post(`/del-report-date?id=${id}`);
    return res
}

export function delReport(id){
    const res = api.post(`/del-report?id=${id}`);
    return res
}