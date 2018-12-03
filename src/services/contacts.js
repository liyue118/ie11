import { stringify } from 'qs';
import request from '../utils/request';
import {Ip,getPageQuery} from '../utils/utils';

export async function ContactAllList(params) {
  return request(Ip + '/api/contact/ContactAllList', {
    method: 'POST',
    body: params,
  });
}
export async function ContactDetail(params) {
  return request(Ip + '/api/contact/ContactDetail', {
    method: 'POST',
    body: params,
  });
}
export async function EventSpeakerDetail(params) {
  return request(Ip + '/api/event/EventSpeakerDetail', {
    method: 'POST',
    body: params,
  });
}
export async function ContactAdminList(params) {
  return request(Ip + '/api/contact/ContactAdminList', {
    method: 'POST',
    body: params,
  });
}

export async function ContactGroupList(params) {
  return request(Ip + '/api/contact/ContactGroupList', {
    method: 'POST',
    body: params,
  });
}

export async function ContactAddition(params) {
  return request(Ip + '/api/contact/ContactAddition', {
    method: 'POST',
    body: params,
  });
}

export async function ContactEdit(params) {
  return request(Ip + '/api/contact/ContactEdit', {
    method: 'POST',
    body: params,
  });
}