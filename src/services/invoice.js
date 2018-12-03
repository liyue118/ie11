
import request from '../utils/request';
import {Ip} from '../utils/utils';


export async function AttendeeInvoiceDetailsInfoGet(params) {
  return request(Ip + '/api/common/AttendeeInvoiceDetailsInfoGet', {
    method: 'POST',
    body: params,
  });
}
//AttendeeInvoiceDetailsInfoSave     
export async function AttendeeInvoiceDetailsInfoSave(params) {
  return request(Ip + '/api/common/AttendeeInvoiceDetailsInfoSave', {
    method: 'POST',
    body: params,
  });
}
//api/account/UserAppointStubHubGetting
export async function UserAppointStubHubGetting(params) {
  return request(Ip + '/api/account/UserAppointStubHubGetting', {
    method: 'POST',
    body: params,
  });
}
//InvoiceListByFilter
export async function InvoiceListByFilter(params) {
  return request(Ip + '/api/common/InvoiceListByFilter', {
    method: 'POST',
    body: params,
  });
}
//InvoiceDetailsInfoGet
export async function InvoiceDetailsInfoGet(params) {
  return request(Ip + '/api/common/InvoiceDetailsInfoGet', {
    method: 'POST',
    body: params,
  });
}
//InvoiceDetailsInfoSave
export async function InvoiceDetailsInfoSave(params) {
  return request(Ip + '/api/common/InvoiceDetailsInfoSave', {
    method: 'POST',
    body: params,
  });
}
//InvoiceApplyCancel
export async function InvoiceApplyCancel(params) {
  return request(Ip + '/api/common/InvoiceApplyCancel', {
    method: 'POST',
    body: params,
  });
}
//InvoiceBatch
export async function InvoiceBatch(params) {
  return request(Ip + '/api/common/InvoiceBatch', {
    method: 'POST',
    body: params,
  });
}
//InvoiceStatusUpdte
export async function InvoiceStatusUpdte(params) {
  return request(Ip + '/api/common/InvoiceStatusUpdte', {
    method: 'POST',
    body: params,
  });
} 
//api/common/InvoiceDetailsInfoSave 
 
