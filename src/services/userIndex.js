import request from '../utils/request';
import qs from 'qs';
import  { Ip }  from  '../utils/utils'; 

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function getEventListByStatus(params) {
  return request(Ip + '/api/event/EventListByStatus', {
    method: 'POST',
    body: params,
  });
}

export async function getDraftList(params){
    return request('/api/currentUser', {
      method: 'post',
      headers:{
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body:qs.stringify(params)
    });
  }

  export async function getCompletedList(params){
    return request('/api/currentUser', {
      method: 'post',
      headers:{
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body:qs.stringify(params)
    });
  }
  
  export async function getGetTop5Event(params) {
    return request(Ip + '/api/event/EventListTop5', {
      method: 'POST',
      body: params,
    });
  }
  export async function eventMineAddition(params) {
    return request(Ip + '/api/event/EventMineAddition', {
      method: 'POST',
      body: params,
    });
  }
  export async function eventMineAttendee(params) {
    return request(Ip + '/api/event/EventMineAttendee', {
      method: 'POST',
      body: params,
    });
  }
  export async function eventMineStarting(params) {
    return request(Ip + '/api/event/EventMineStarting', {
      method: 'POST',
      body: params,
    });
  }