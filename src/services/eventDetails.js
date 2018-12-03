import request from '../utils/request';
import qs from 'qs';
import  { Ip }  from  '../utils/utils'; 
export async function query() {
    return request('/api/users');
}

export async function queryCurrent() {
    return request('/api/currentUser');
}

// export async function getCurrentInProgressList(params) {
//     return request(Ip + '/api/event/GetEventList', {
//         method: 'POST',
//         body: params,
//     });
// }

export async function getEventDetails(params) {
    return request(Ip + '/api/event/EventDetails', {
        method: 'POST',
        body: params,
    });
}

export async function domShowOrHidden(params) {
    return request(Ip + '/api/event/EventLayoutDetail', {
        method: 'POST',
        body: params,
    });
}

export async function documentDownload(params) {
    return request(Ip + '/api/common/DownloadAttachment', {
        method: 'POST',
        body: params,
    });
}