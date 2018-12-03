import { stringify } from 'qs';
import request from '../utils/request';
import {Ip,getPageQuery} from '../utils/utils';
//登录

export async function getPersonInfo(params) {
  return request(Ip + '/api/account/PersonInfo', {
    method: 'POST',
    body: params,
  });
}

export async function PersonLoginAuthCodeResult(params) {
  return request(Ip + '/api/account/SendSMSGetAuthCode', {
    method: 'POST',
    body: params,
  });
}
export async function fakeAccountLogin(params) {
  return request(Ip + '/api/account/Login', {
    method: 'POST',
    body: params,
  });
}
//注册
export async function RegisterAccount(params) {
  return request(Ip + '/api/account/AccountRegistration', {
    method: 'POST',
    body: params,
  });
}

export async function getEventListByStatus(params) {
  return request(Ip + '/api/event/EventListByStatus', {
    method: 'POST',
    body: params,
  });
}
//summary
export async function EventSummaryDetails(params) {
  return request(Ip + '/api/event/EventSummaryDetails', {
    method: 'POST',
    body: params,
  });
}
export async function EventSummaryAddition(params) {
  return request(Ip + '/api/event/EventSummaryAddition', {
    method: 'POST',
    body: params,
  });
}

//speakers
export async function EventSpeakerList(params) {
  return request(Ip + '/api/event/EventSpeakerList', {
    method: 'POST',
    body: params,
  });
}
export async function EventSpeakerManuallyAddition(params) {
  return request(Ip + '/api/event/EventSpeakerManuallyAddition', {
    method: 'POST',
    body: params,
  });
}
export async function EventSpeakerAddition(params) {
  return request(Ip + '/api/event/EventSpeakerAddition', {
    method: 'POST',
    body: params,
  });
}
export async function SpeakerSearch(params) {
  return request(Ip + '/api/event/SpeakerSearch', {
    method: 'POST',
    body: params,
  });
}
export async function EventSpeakerDelete(params) {
  return request(Ip + '/api/event/EventSpeakerDelete', {
    method: 'POST',
    body: params,
  });
}
export async function EventSpeakerEdit(params) {
  return request(Ip + '/api/event/EventSpeakerEdit', {
    method: 'POST',
    body: params,
  });
}
export async function SpeakerDetail(params) {
  return request(Ip + '/api/event/EventSpeakerDetail', {
    method: 'POST',
    body: params,
  });
}
//venue
export async function EventVenueManuallyAddition(params) {
  return request(Ip + '/api/event/EventVenueManuallyAddition', {
    method: 'POST',
    body: params,
  });
}
export async function EventVenueAddition(params) {
  return request(Ip + '/api/event/EventVenueAddition', {
    method: 'POST',
    body: params,
  });
}
export async function EventVenueList(params) {
  return request(Ip + '/api/event/EventVenueDetail', {
    method: 'POST',
    body: params,
  });
}
export async function EventVenueEdit(params) {
  return request(Ip + '/api/event/EventVenueEdit', {
    method: 'POST',
    body: params,
  });
}
export async function EventVenueReset(params) {
  return request(Ip + '/api/event/EventVenueReset', {
    method: 'POST',
    body: params,
  });
}
export async function VenueAllList(params) {
  return request(Ip + '/api/event/VenueAllList', {
    method: 'POST',
    body: params,
  });
}
//Agenda
export async function EventDuration(params) {
  return request(Ip + '/api/event/EventDuration', {
    method: 'POST',
    body: params,
  });EventDuration
}
export async function AllCurrency(params) {
  return request(Ip + '/api/common/AllCurrency', {
    method: 'POST',
    body: params,
  });
}
export async function EventAgendaDates(params) {
  return request(Ip + '/api/event/EventAgendaDates', {
    method: 'POST',
    body: params,
  });
}
export async function EventAgendaList(params) {
  return request(Ip + '/api/event/EventAgendaList', {
    method: 'POST',
    body: params,
  });
}

export async function EventAgendaDetail(params) {
  return request(Ip + '/api/event/EventAgendaDetail', {
    method: 'POST',
    body: params,
  });
}
export async function EventAgendaDateUnique(params) {
  return request(Ip + '/api/event/EventAgendaDateUnique', {
    method: 'POST',
    body: params,
  });
}
export async function EventAgendaDateDelete(params) {
  return request(Ip + '/api/event/EventAgendaDateDelete', {
    method: 'POST',
    body: params,
  });
}
export async function EventAgendaAddition(params) {
  return request(Ip + '/api/event/EventAgendaAddition', {
    method: 'POST',
    body: params,
  });
}
export async function EventAgendaDelete(params) {
  return request(Ip + '/api/event/EventAgendaDelete', {
    method: 'POST',
    body: params,
  });
}
export async function EventAgendaEdit(params) {
  return request(Ip + '/api/event/EventAgendaEdit', {
    method: 'POST',
    body: params,
  });
}
//sponser
export async function EventOrganizationList(params) {
  return request(Ip + '/api/event/EventOrganizationList', {
    method: 'POST',
    body: params,
  });
}
export async function EventOrganizationAddition(params) {
  return request(Ip + '/api/event/EventOrganizationAddition', {
    method: 'POST',
    body: params,
  });
}
export async function DttEntitySearch(params) {
  return request(Ip + '/api/common/DttEntitySearch', {
    method: 'POST',
    body: params,
  });
}
export async function EventSponsorList(params) {
  return request(Ip + '/api/event/EventSponsorList', {
    method: 'POST',
    body: params,
  });
}
export async function EventSponsorManuallyAddition(params) {
  return request(Ip + '/api/event/EventSponsorManuallyAddition', {
    method: 'POST',
    body: params,
  });
}
export async function SponsorSearch(params) {
  return request(Ip + '/api/event/SponsorSearch', {
    method: 'POST',
    body: params,
  });
}
export async function EventSponsorAddition(params) {
  return request(Ip + '/api/event/EventSponsorAddition', {
    method: 'POST',
    body: params,
  });
}
export async function EventSponsorDelete(params) {
  return request(Ip + '/api/event/EventSponsorDelete', {
    method: 'POST',
    body: params,
  });
}
export async function EventOrganizationDelete(params) {
  return request(Ip + '/api/event/EventOrganizationDelete', {
    method: 'POST',
    body: params,
  });
}
//document
export async function EventDocumentList(params) {
  return request(Ip + '/api/event/EventDocumentList', {
    method: 'POST',
    body: params,
  });
}
export async function EventDocumentDelete(params) {
  return request(Ip + '/api/event/EventDocumentDelete', {
    method: 'POST',
    body: params,
  });
}
//upload
export async function UploadAttachemnt(params) {
  return request(Ip + '/api/common/UploadAttachemnt', {
    method: 'POST',
    body: params,
  });
}
//Invitation
export async function EventDiscountList(params) {
  return request(Ip + '/api/event/EventDiscountList', {
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
export async function EventInvitationAddition(params) {
  return request(Ip + '/api/event/EventInvitationAddition', {
    method: 'POST',
    body: params,
  });
}
export async function EventInvitationList(params) {
  return request(Ip + '/api/event/EventInvitationList', {
    method: 'POST',
    body: params,
  });
}
export async function ContactAllList(params) {
  return request(Ip + '/api/contact/ContactAllList', {
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
export async function EventInvitationDetail(params) {
  return request(Ip + '/api/event/EventInvitationDetail', {
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
export async function SendInvitation(params) {
  return request(Ip + '/api/event/SendInvitation ', {
    method: 'POST',
    body: params,
  });
}
//退出登录
export async function LoginOut() {
  return request(Ip + '/api/account/LoginOut', {
    method: 'POST',
  });
}

//语言设置
export async function onLanguageSetting(params) {
  return request(Ip + '/api/common/LanguageSetting', {
    method: 'POST',
    body: params,
  });
}
//获取语言设置
export async function getLanguage(params) {
  return request(Ip + '/api/common/PersonPreferLanguage', {
    method: 'POST',
    body: params,
  });
}
export async function queryNotices() {
  return request('/api/notices');
}
