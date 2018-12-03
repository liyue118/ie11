import {Efeventlist} from '../services/home';
import { stringify } from 'qs';
import { routerRedux } from 'dva/router';
import {
  AllTeamMember,
  EventTeamMember,
  EventTeamMemberAddition,
  EventTeamMemberDelete,
  EventSpeakerList,
  EventSpeakerChecked,
  EventSponsorList,
  EventDiscountList,
  EventAttendeeListByStatus,
  EventAttendeeDelete,
  EventAttendeeListByFilter,
  EventAllPaymentList,
  EventAttendeeStatusUpdate,
  EventAttendeeAddition,
  ContactAllList,
  EventAttendeeCancelUpdate,
  EventAttendeeRegisterDetail,
  EventAttendeeStatusBatchUpdate,
  EventAttendeeCheck,
  EventAttendeePaymentUpdate,
  EventAttendeeBatchCheck,
  EventAttendeePaymentBatchUpdate,
  EventAttendeeCancelBatchUpdate,
  EventAttendeeDiscountBatchUpdate,
  EventAttendeeEdit,
  EventAttendeeDetail,
  EventAttendeeRecoverUpdate,
  RegistraionIsFull
} from '../services/eventManage'
import {message} from 'antd';
import moment from 'moment';

export default {
    namespace: 'eventManage',
    state: {
        AllTeamMember:[],
        EventTeamMember:[],
        DiscountList:[],
        AttendeeList:[],
        EventSpeakerListDate:[],
        EventSponsorList:[],
        AllPaymentList:[],
        AttendeeListByStatus:[],
        ContactAllList:[]
    },
    reducers: {
      reducersAllTeamMember(state, { payload }) {
        return {
          ...state,
          AllTeamMember: payload,
          }
      },
      reducersEventTeamMember(state, { payload }) {
        return {
          ...state,
          EventTeamMember: payload,
          }
      },
      reducersEventDiscountList(state, { payload }) {
        return {
          ...state,
          DiscountList: payload,
          }
      },
      reducersAttendeeList(state, { payload }) {
        return {
          ...state,
          AttendeeList: payload,
          }
      },
      reducersEventSpeakerList(state, { payload }) {
        return {
          ...state,
          EventSpeakerListDate: payload,
          }
      },
      reducersEventSponsorList(state, { payload }) {
        return {
          ...state,
          EventSponsorList: payload,
          }
      },
      reducersEventAllPaymentList(state, { payload }) {
        return {
          ...state,
          AllPaymentList: payload,
          }
      },
      reducersAttendeeListByStatus(state, { payload }) {
        return {
          ...state,
          AttendeeListByStatus: payload,
          }
      },
      reducersContactAllList(state, { payload }) {
        return {
          ...state,
          ContactAllList: payload,
          }
      },
    },
    effects: {
    *AllTeamMember({ payload }, { call, put }){
            const response = yield call(AllTeamMember);
            yield put({
              type:"reducersAllTeamMember",
              payload:response
            })
    },
    *EventSponsorList({ payload }, { call, put }){
      const response = yield call(EventSponsorList,payload);
      var date=[];
      if(response!=null){
        response.forEach(element=>{
          date.push({
            ...element,
            key:element.Id,
            action:element.Id
          })
        })
      }
      yield put({
        type:"reducersEventSponsorList",
        payload:date
      })
    },
   *EventSpeakerList({ payload,callback }, { call, put }){
    const response = yield call(EventSpeakerList,payload);
    console.log('嘉宾列表',response)
    const date=[];
    if(response!=null){
        response.forEach((element,index) => {
          date.push({
            ...element,
            CreateDate:moment(element.CreateDate).format('YYYY-MM-DD'),
            key:element.Id,
            CheckStatus: (!!element.CheckStatus&&element.CheckStatus == 1002) ? '已签到' :'未签到',
            action:element.Id,
          })
        })
    }
    yield put({
      type:"reducersEventSpeakerList",
      payload:date
    })
    callback(response)
  },
  *EventSpeakerChecked({ payload,callback}, { call, put }){
    let response = yield call(EventSpeakerChecked,payload);
    response==null?response=[]:null;
    if(callback) callback(response)
  },
  *EventAttendeeBatchCheck({ payload,callback}, { call, put }){
    let response = yield call(EventAttendeeBatchCheck,payload);
    response==null?response=[]:null;
    if(callback) callback(response)
  },
  *EventAttendeePaymentUpdate({ payload,callback}, { call, put }){
    let response = yield call(EventAttendeePaymentUpdate,payload);
    response==null?response=[]:null;
    if(callback) callback(response)
  },
  *EventAttendeePaymentBatchUpdate({ payload,callback}, { call, put }){
    let response = yield call(EventAttendeePaymentBatchUpdate,payload);
    response==null?response=[]:null;
    if(callback) callback(response)
  },
  *EventAttendeeCancelBatchUpdate({ payload,callback}, { call, put }){
    let response = yield call(EventAttendeeCancelBatchUpdate,payload);
    response==null?response=[]:null;
    if(callback) callback(response)
  },
  *EventAttendeeDiscountBatchUpdate({ payload,callback}, { call, put }){
    let response = yield call(EventAttendeeDiscountBatchUpdate,payload);
    response==null?response=[]:null;
    if(callback) callback(response)
  },
  *RegistraionIsFull({ payload,callback}, { call, put }){
    let response = yield call(RegistraionIsFull,payload);
    response==null?response=[]:null;
    if(callback) callback(response)
  },
  *EventTeamMember({ payload }, { call, put }){
        const response = yield call(EventTeamMember,payload);
        const IdArr=[];
        if(response!=[]){
            response.forEach(element => {
                IdArr.push(element.Id);
            });
        }
        yield put({
          type:"reducersEventTeamMember",
          payload:IdArr
        })
    },
    
    *EventTeamMemberDelete({ payload,callback}, { call, put }){
      let response = yield call(EventTeamMemberDelete,payload);
      response==null?response=[]:null;
      if(callback) callback(response)
      //The event was successfully published
    },
    *EventTeamMemberAddition({ payload,callback}, { call, put }){
        let response = yield call(EventTeamMemberAddition,payload);
        response==null?response=[]:null;
        if(callback) callback(response)
        //The event was successfully published
      },
    *EventAttendeeCheck({ payload,callback}, { call, put }){
        let response = yield call(EventAttendeeCheck,payload);
        callback(response)
        //The event was successfully published
    },
    *EventAttendeeListByStatus({ payload,callback}, { call, put }){
        const response = yield call(EventAttendeeListByStatus,payload);
        callback(true)
        const data=[];
        if(response!=null){
          response.forEach(element=>{
            let PaymentType='';
            switch(element.PaymentType){
              case 1000:
                PaymentType='未支付'
              break;     
              case 1005003:
                PaymentType='现金支付'
              break;
              case 1005002:
                PaymentType='扫码支付'
              break;
              case 1005001:
                PaymentType='转账支付'
              break;
            }
            data.push({
              ...element,
              RegisterDate:moment(element.RegisterDate).format('YYYY-MM-DD'),
              TicketType:element.TicketType=="1007001" ?'标准票价':'免费票价',
              PaymentType:PaymentType,
              key:element.AttendeeId,
              action:{Id:element.Id,AttendeeId:element.AttendeeId}
            })
          })
        }
        yield put({
          type:"reducersAttendeeListByStatus",
          payload:data
        })
    },
    *EventAttendeeDelete({ payload, callback }, { call, put }){
      const response = yield call(EventAttendeeDelete,payload);
      if (!!response && response.ReturnCode===1001){
        callback(response)
      }
    },
    *EventDiscountList({ payload }, { call, put }){
        const response = yield call(EventDiscountList,payload);
        yield put({
          type:"reducersEventDiscountList",
          payload:response
        })
    },
    *EventAttendeeCancelUpdate({ payload,callback }, { call, put }){
      const response = yield call(EventAttendeeCancelUpdate,payload);
      callback(response)
    },
    
    *EventAttendeeListByFilter({ payload,callback }, { call, put }){
      // console.log('payload', payload)
      const response = yield call(EventAttendeeListByFilter,payload);
      // console.log('参与者列表', response);
      const checkAttendeeId=[];
      const data=[];
      if(response!=null){
        response.forEach(element=>{
          let PaymentType='';
          switch(element.PaymentType){
            case 1000:
              PaymentType='未支付'
            break;
            case 1005003:
              PaymentType='现金支付'
            break;
            case 1005002:
              PaymentType='扫码支付'
            break;
            case 1005001:
              PaymentType='转账支付'
            break;
          }
          checkAttendeeId.push(element.AttendeeId);
          data.push({
            ...element,
            RegisterDate: moment(element.RegisterDate).format('YYYY-MM-DD'),
            TicketType:element.TicketType=="1007001" ?'标准票价':'免费票价',
            PaymentStatus:element.PaymentStatus=="1002"?'已支付':"未支付",
            CheckStatus:element.CheckStatus=="1001" ?"未签到":'已签到',
            PaymentType:PaymentType,
            DiscountName:element.DiscountName || 'Default discount',
            key:element.AttendeeId,
            action:{Id:element.Id,AttendeeId:element.AttendeeId,PaymentStatus:element.PaymentStatus,CheckStatus:element.CheckStatus}
          })
        })
      }
      yield put({
        type:"reducersAttendeeList",
        payload:data
      })
      callback(response, checkAttendeeId);
    },
    *EventAllPaymentList({ payload }, { call, put }){
      const response = yield call(EventAllPaymentList,payload);
      response==null?response=[]:null;
      yield put({
        type:"reducersEventAllPaymentList",
        payload:response
      })
    },
    *EventAttendeeStatusUpdate({ payload,callback}, { call, put }){
      const response = yield call(EventAttendeeStatusUpdate,payload);
      response==null?response=[]:null;
      if(callback) callback(response)
    },
    *EventAttendeeStatusBatchUpdate({ payload,callback}, { call, put }){
      const response = yield call(EventAttendeeStatusBatchUpdate,payload);
      if(callback) callback(response)
    },
    *EventAttendeeAddition({ payload,callback}, { call, put }){
      let response = yield call(EventAttendeeAddition,payload);
      if(response.ReturnCode=='1001'){
        callback(response)
        message.success('Add success!');
      }else{
        message.success('Add fail!');
      }
    },
    *EventAttendeeEdit({ payload,callback}, { call, put }){
      let response = yield call(EventAttendeeEdit,payload);
      if(response.ReturnCode=='1001'){
        callback(response)
        message.success('Add success!');
      }else{
        message.success('Add fail!');
      }
    },
    *EventAttendeeRecoverUpdate({ payload,callback}, { call, put }){
      let response = yield call(EventAttendeeRecoverUpdate,payload);
      callback(response)
    },
    *ContactAllList({ payload,callback}, { call, put }){
      const response = yield call(ContactAllList,payload);
      callback(response)
    },
    *EventAttendeeRegisterDetail({ payload,callback}, { call, put }){
      const response = yield call(EventAttendeeRegisterDetail,payload);
      callback(response);
    },
    *EventAttendeeDetail({ payload,callback}, { call, put }){
      const response = yield call(EventAttendeeDetail,payload);
      callback(response);
    },
    
}}