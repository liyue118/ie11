import request from '../utils/request';
import qs from 'qs';
import  { Ip }  from  '../utils/utils'; 

export async function query() {
    return request('/api/users');
}

export async function queryCurrent() {
    return request('/api/currentUser');
}

export async function getPersonInfo(params) {
    return request(Ip + '/api/account/PersonInfo', {
        method: 'POST',
        body: params,
    });
}
export async function getPersonContactList(params) {
    return request(Ip + '/api/account/PersonContactList', {
        method: 'POST',
        body: params,
    });
}
export async function eventAttendeeSettings(params) {
    return request(Ip + '/api/event/EventAttendeeApply', {
        method: 'POST',
        body: params,
    });
}
export async function eventRegisterLayoutDetail(params) {
    return request(Ip + '/api/event/EventRegisterLayoutDetail', {
        method: 'POST',
        body: params,
    });
}
export async function getTransactionTypeDropdownList(params) {
    return request(Ip + '/api/common/TransactionTypeDropdownList', {
        method: 'POST',
        body: params,
    });
}
export async function getCompanyTypeDropdownList(params) {
    return request(Ip + '/api/common/CompanyTypeDropdownList', {
        method: 'POST',
        body: params,
    });
}
// export async function getGetTop5Event(params) {
//     return request(Ip + '/api/event/EventListTop5', {
//         method: 'POST',
//         body: params,
//     });
// }
// export async function getGetTop5Event(params) {
//     return request(Ip + '/api/event/GetTop5Event', {
//         method: 'POST',
//         body: params,
//     });
// }