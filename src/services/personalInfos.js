import request from '../utils/request';
import qs from 'qs';
import { Ip } from '../utils/utils';

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
export async function getCategoryType(params) {
    return request(Ip + '/api/common/CategoryType', {
        method: 'POST',
        body: params,
    });
}
export async function AccountInfoUpdate(params) {
    return request(Ip + '/api/account/AccountInfoUpdate', {
        method: 'POST',
        body: params,
    });
}
export async function PersonContactSave(params) {
    return request(Ip + '/api/account/PersonContactSave', {
        method: 'POST',
        body: params,
    });
}
export async function PersonContactDelete(params) {
    return request(Ip + '/api/account/PersonContactDelete', {
        method: 'POST',
        body: params,
    });
}
export async function getAddressDropDownList(params) {
    return request(Ip + '/api/common/AddressDropDownList', {
        method: 'POST',
        body: params,
    });
}
// export async function GetCityDropdownList(params) {
//     return request(Ip + '/api/common/GetCityDropdownList', {
//         method: 'POST',
//         body: params,
//     });
// }
// export async function GetDistrictList(params) {
//     return request(Ip + '/api/common/GetDistrictList', {
//         method: 'POST',
//         body: params,
//     });
// }
export async function uploadAvatar(params) {
    return request(Ip + '/api/account/AvataSettings', {
        method: 'POST',
        body: params,
    });
}
export async function getAvataGettings(params) {
    return request(Ip + '/api/account/AvataGettings', {
        method: 'POST',
        body: params,
    });
}
export async function companyStubHubGetting(params) {
    return request(Ip + '/api/account/CompanyStubHubGetting', {
        method: 'POST',
        body: params,
    });
}
export async function saveStubHub(params) {
    return request(Ip + '/api/account/CompanyStubHubSetting', {
        method: 'POST',
        body: params,
    });
}
export async function userStubHubGetting(params) {
    return request(Ip + '/api/account/UserStubHubGetting', {
        method: 'POST',
        body: params,
    });
}
export async function industryDropdownList(params) {
    return request(Ip + '/api/common/IndustryDropdownList', {
        method: 'POST',
        body: params,
    });
}