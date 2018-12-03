import { routerRedux } from 'dva/router';
import {
  AttendeeInvoiceDetailsInfoGet,
  UserAppointStubHubGetting,
  AttendeeInvoiceDetailsInfoSave,
  InvoiceListByFilter,
  InvoiceDetailsInfoGet,
  InvoiceDetailsInfoSave,
  InvoiceApplyCancel,
  InvoiceBatch,
  InvoiceStatusUpdte
} from '../services/invoice'

export default {
  namespace: 'invoice',

  state: {
    invoicelistData:[]
  },

  effects: {
      *AttendeeInvoiceDetailsInfoGet({ payload,callback }, { call, put }) {
        const response = yield call(AttendeeInvoiceDetailsInfoGet, payload);
        callback(response);
      },
      *InvoiceDetailsInfoGet({ payload,callback }, { call, put }) {
        const response = yield call(InvoiceDetailsInfoGet, payload);
        callback(response);
      },
      *UserAppointStubHubGetting({ payload,callback }, { call, put }) {
        const response = yield call(UserAppointStubHubGetting, payload);
        callback(response);
      },
      *AttendeeInvoiceDetailsInfoSave({ payload,callback }, { call, put }) {
        const response = yield call(AttendeeInvoiceDetailsInfoSave, payload);
        callback(response);
      },
      *InvoiceDetailsInfoSave({ payload,callback }, { call, put }) {
        const response = yield call(InvoiceDetailsInfoSave, payload);
        callback(response);
      },
      *InvoiceListByFilter({ payload,callback}, { call, put }) {
        const response = yield call(InvoiceListByFilter, payload);
        let value=[];
        callback(response);
        response.forEach(element => {
          value.push({
            ...element,
            key:element.Key,
            application:element.FirstName+element.LastName,
            SendType:element.SendType=="1012001"?'快递':'现场',
            InvoiceType:element.InvoiceType=="1011001"?'增值税普通票':'增值税专用票',
            InvoiceStatus:element.InvoiceStatus=="1013003"?'已开票':'申请中',
            action:element
          })
        });
        yield put({
          type: "reducersInvoicelistData",
          payload: value
        });
      },
      *InvoiceApplyCancel({ payload,callback }, { call, put }) {
        const response = yield call(InvoiceApplyCancel, payload);
        callback(response);
      },
      *InvoiceBatch({ payload,callback }, { call, put }) {
        const response = yield call(InvoiceBatch, payload);
        callback(response);
      },
      *InvoiceStatusUpdte({ payload,callback }, { call, put }) {
        const response = yield call(InvoiceStatusUpdte, payload);
        callback(response);
      },
    
  },

  reducers: {
    reducersInvoicelistData(state, { payload }) {
      return { ...state, invoicelistData:payload,};
    },
  },
};