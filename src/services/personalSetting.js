import request from '../utils/request';
import qs from 'qs';
import { Ip } from '../utils/utils';

export async function getPersonInfo(params) {
    return request(Ip + '/api/account/PersonInfo', {
        method: 'POST',
        body: params,
    });
}
export async function passwordReset(params) {
    return request(Ip + '/api/account/PasswordReset', {
        method: 'POST',
        body: params,
    });
}

// export async function eventAttendeeSettings(params) {
//     return request(Ip + '/api/event/EventAttendeeSettings', {
//         method: 'POST',
//         body: params,
//     });
// }