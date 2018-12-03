import { stringify } from 'qs';
import request from '../utils/request';
import {Ip} from '../utils/utils';
//create event
export async function EventAddition(params) {
  return request(Ip + '/api/event/EventAddition', {
    method: 'POST',
    body: params,
  });
}
//GeneralEventDetails
export async function GeneralEventDetails(params) {
  return request(Ip + '/api/event/EventGeneralDetails', {
    method: 'POST',
    body: params,
  });
}
//EventType
export async function EventType(params) {
  return request(Ip + '/api/common/EventType', {
    method: 'POST',
    body: params,
  });
}
//AllTeamMember
export async function AllTeamMember(params) {
  return request(Ip + '/api/event/AllTeamMember', {
    method: 'POST',
    body: params,
  });
}
//EventBasicEdit
export async function EventBasicEdit(params) {
  return request(Ip + '/api/event/EventBasicEdit', {
    method: 'POST',
    body: params,
  });
}
//EventDelete
export async function EventDelete(params) {
  return request(Ip + '/api/event/EventDelete', {
    method: 'POST',
    body: params,
  });
}
//注册模块
//RegisterLayout
export async function RegisterLayout(params) {
  return request(Ip + '/api/event/EventRegisterLayout', {
    method: 'POST',
    body: params,
  });
}

export async function EventRegisterLayoutDetail(params) {
  return request(Ip + '/api/event/EventRegisterLayoutDetail', {
    method: 'POST',
    body: params,
  });
}
//票务设置 
//添加票
export async function EventTicketAddition(params) {
  return request(Ip + '/api/event/EventTicketAddition', {
    method: 'POST',
    body: params,
  });
}
//编辑票
export async function EventTicketEdit(params) {
  return request(Ip + '/api/event/EventTicketEdit', {
    method: 'POST',
    body: params,
  });
}
//删除票
export async function EventTicketDelete(params) {
  return request(Ip + '/api/event/EventTicketDelete', {
    method: 'POST',
    body: params,
  });
}
//票列表
export async function EventTicketList(params) {
  return request(Ip + '/api/event/EventTicketList', {
    method: 'POST',
    body: params,
  });
}
//票务设置-优惠
//添加优惠
export async function EventDiscountAddition(params) {
  return request(Ip + '/api/event/EventDiscountAddition', {
    method: 'POST',
    body: params,
  });
}
//编辑优惠
export async function EventDiscountEdit(params) {
  return request(Ip + '/api/event/EventDiscountEdit', {
    method: 'POST',
    body: params,
  });
}
//EventDiscountDelete
export async function EventDiscountDelete(params) {
  return request(Ip + '/api/event/EventDiscountDelete', {
    method: 'POST',
    body: params,
  });
}
//优惠列表
export async function EventDiscountList(params) {
  return request(Ip + '/api/event/EventDiscountList', {
    method: 'POST',
    body: params,
  });
}

//管理=邀请者
export async function EventInvitationList(params) {
  return request(Ip + '/api/event/EventInvitationList', {
    method: 'POST',
    body: params,
  });
}
export async function EventInvitationAddition(params) {
  return request(Ip + '/api/event/EventInvitationAddition', {
    method: 'POST',
    body: params,
  });
}
export async function EventInvitationEdit(params) {
  return request(Ip + '/api/event/EventInvitationEdit', {
    method: 'POST',
    body: params,
  });
}
export async function EventInvitationDelete(params) {
  return request(Ip + '/api/event/EventInvitationDelete', {
    method: 'POST',
    body: params,
  });
}
export async function EventInvitationDetail(params) {
  return request(Ip + '/api/event/EventInvitationDetail', {
    method: 'POST',
    body: params,
  });
}
//api/common/AllCurrency 币种
export async function AllCurrency(params) {
  return request(Ip + '/api/common/AllCurrency', {
    method: 'POST',
    body: params,
  });
}
//收款账户设置DttEntityDetail
export async function AllDttEntity(params) {
  return request(Ip + '/api/common/AllDttEntity', {
    method: 'POST',
    body: params,
  });
}
//layout
export async function EventLayout(params) {
  return request(Ip + '/api/event/EventLayout', {
    method: 'POST',
    body: params,
  });
}
//EventLayoutDetail
export async function EventLayoutDetail(params) {
  return request(Ip + '/api/event/EventLayoutDetail', {
    method: 'POST',
    body: params,
  });
}
//DeloitteEntityBankAccount
export async function DeloitteEntityBankAccount(params) {
  return request(Ip + '/api/event/DeloitteEntityBankAccount', {
    method: 'POST',
    body: params,
  });
}
//EventBankAccountDetail
export async function EventBankAccountDetail(params) {
  return request(Ip + '/api/event/EventBankAccountDetail', {
    method: 'POST',
    body: params,
  });
}
//EventBankAccountEdit 
export async function EventBankAccountEdit(params) {
  return request(Ip + '/api/event/EventBankAccountEdit', {
    method: 'POST',
    body: params,
  });
}
//api/event/EventPublish
export async function EventPublish(params) {
  return request(Ip + '/api/event/EventPublish', {
    method: 'POST',
    body: params,
  });
}