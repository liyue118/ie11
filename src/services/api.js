import { stringify } from 'qs';
import request from '../utils/request';
import {Ip,getPageQuery} from '../utils/utils';
//登录

export async function fakeAccountLogin(params) {
  return request(Ip + '/api/account/Login', {
    method: 'POST',
    body: params,
  });
}
//注册
