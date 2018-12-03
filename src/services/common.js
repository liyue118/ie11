import { stringify } from 'qs';
import request from '../utils/request';
import {Ip,getPageQuery} from '../utils/utils';

export async function IndustryDropdownList(params) {
  return request(Ip + '/api/common/IndustryDropdownList', {
    method: 'POST',
    body: params,
  });
}
export async function AddressDropDownList(params) {
  return request(Ip + '/api/common/AddressDropDownList', {
    method: 'POST',
    body: params,
  });
}

