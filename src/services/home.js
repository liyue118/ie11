
import request from '../utils/request';
import {Ip} from '../utils/utils';

export async function Efeventlist(params) {
  return request(Ip + '/api/event/EventListByStatus', {
    method: 'POST',
    body: params,
  });
}

//api/event/EventNumStatistic
export async function EventNumStatistic(params) {
  return request(Ip + '/api/event/EventNumStatistic', {
    method: 'POST',
    body: params,
  });
}

export async function EventIndustryStatistic(params) {
  return request(Ip + '/api/event/EventIndustryStatistic', {
    method: 'POST',
    body: params,
  });
}

export async function EventCityStatistic(params) {
  return request(Ip + '/api/event/EventCityStatistic', {
    method: 'POST',
    body: params,
  });
}