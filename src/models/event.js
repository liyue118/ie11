import {Efeventlist} from '../services/home';
import{EventAddition,GeneralEventDetails,EventType,AllTeamMember,EventBasicEdit,EventDelete,RegisterLayout,
  EventRegisterLayoutDetail,EventTicketEdit,EventTicketList,EventTicketAddition,
  AllCurrency,EventTicketDelete,EventDiscountList,EventDiscountAddition,EventDiscountEdit,EventDiscountDelete,
  AllDttEntity,EventLayout,EventLayoutDetail,DeloitteEntityBankAccount,EventBankAccountDetail,EventBankAccountEdit,EventPublish} from '../services/event';
import {IndustryDropdownList} from '../services/common'
import { stringify } from 'qs';
import { routerRedux } from 'dva/router';
import {message} from 'antd';
import moment from 'moment';

export default {
    namespace: 'event',
    state: {
      eventlistDate:[],
      generalInitDate:[],
      IndustryList:[],
      eventType:[],
      teamMember:[],
      IsRegHideList:[],
      ticketListDate:[],
      currencyList:[],
      discountList:[],
      DttEntityList:[],
      ContentLayoutList:[],
      BankList:[],
      EventDelete: [],
      pageSize: 15,
    },
    reducers: {
      reducersEventlistDate(state, { payload }) {
        return {
          ...state,
          eventlistDate: payload,
          }
      },
      reducersGeneralEventDetails(state, { payload }) {
        return {
          ...state,
          generalInitDate: payload,
          }
      },
      reducersIndustryList(state, {payload}) {
        return { 
          ...state,
          IndustryList:payload,
        };
      },
      reducersEventDelete(state, {payload}) {
        return { 
          ...state,
          EventDelete:payload,
        };
      },
      reducersEventType(state, { payload }) {
        return {
          ...state,
          eventType: payload,
          }
      },
      reducersTeamMember(state, { payload }) {
        return {
          ...state,
          teamMember: payload,
          }
      },
      reducersRegisterLayout(state, { payload }) {
        return {
          ...state,
          IsRegHideList: payload,
          }
      },
      reducersEventTicketList(state, { payload }) {
        return {
          ...state,
          ticketListDate: payload,
          }
      },
      reducersAllCurrency(state, { payload }) {
        return {
          ...state,
          currencyList: payload,
          }
      },
      reducersDiscountList(state, { payload }) {
        return {
          ...state,
          discountList: payload,
          }
      },
      reducersAllDttEntity(state, { payload }) {
        return {
          ...state,
          DttEntityList: payload,
          }
      },
      reducersLayoutList(state, { payload }) {
        return {
          ...state,
          ContentLayoutList: payload,
          }
      },
      reducersBankList(state, { payload }) {
        return {
          ...state,
          BankList: payload,
          }
      },
      savePageSize(state, action) {
        return { ...state, ...action.payload };
      },
    },
    effects: {
     *changePageSize({payload,callback},{put}){
      yield put({
        type:"savePageSize",
        payload:{
          pageSize: payload
        }
      })
       callback(payload);
     },
     *Efeventlist({ payload,callback}, { call, put }) { 
       const response = yield call(Efeventlist,payload);
       const data = [];
       if (response != null && !!response.Events){
         let page = {
           ItemsPerPage: response.ItemsPerPage,
           Page: response.Page,
           TotalPages: response.TotalPages,
           TotalRecords: response.TotalRecords,
         }
         response.Events.forEach((element,index) => {
            data.push({//item.Title.length>28?item.Title.substr(0,28)+"...":item.Title
              key: element.EventId,
              number:element.EventIndex,
              title: { title: element.Title.length>28?element.Title.substr(0,28)+"...":element.Title,
                 id: element.EventId},
              location:element.Venue!=null?(element.Venue.length>12?element.Venue.substr(0,12):element.Venue):'--',
              start:moment(element.StartDate).format('YYYY年MM月DD日'),
              creation:moment(element.CreatedDate).format('YYYY年MM月DD日'),
              attendance: element.Attendance,
              checkedIn: element.CheckedIn,
              action: element.EventId
            });
          });
         callback(data, page);
         yield put({
           type: "savePage",
           payload: {
             page: page
           }
         })
          yield put({
            type:"reducersEventlistDate",
            payload:data
          })
        }
      },
      *EventAddition({ payload,callback }, { call, put }) { 
        const response = yield call(EventAddition,payload);
        callback(response)
        if(response.ReturnCode=='1001'){
          yield put(routerRedux.push({
            pathname: '/createEvent/setUp/general',
            search:stringify({
              id: response.EventId,
              eventstatus:1009001
            })})
          );
        }
        
       },
       *GeneralEventDetails({ payload }, { call, put }){
          const response = yield call(GeneralEventDetails,payload);
          response==null?response=[]:'';
          yield put({
            type:"reducersGeneralEventDetails",
            payload:response
          })
          const responseIndustry = yield call(IndustryDropdownList, payload);
          if(!!responseIndustry && !!responseIndustry.length){
            const data = [];
            responseIndustry.map((item, index) => {
              if (!!item.Children && item.Children.length) {
                let children = [];
                item.Children.map((i, j) => {
                  children.push({
                    "value": i.Value,
                    "label": i.Label,
                  })
                })
                data.push({
                  "value": item.Value,
                  "label": item.Label,
                  'children': children
                });
              } 
              else {
                data.push({
                  "value": item.Value,
                  "label": item.Label,
                });
              }
            }) 
            yield put({
              type:"reducersIndustryList",
              payload:data
            })
          } 
          const responseET = yield call(EventType);
          yield put({
            type:"reducersEventType",
            payload:responseET
          })
          const response2 = yield call(AllTeamMember);
          yield put({
            type:"reducersTeamMember",
            payload:response2
          })
       },
       *EfEventType({ payload }, { call, put }){
          const response = yield call(EventType);
          yield put({
            type:"reducersEventType",
            payload:response
          })
       },
       *AllTeamMember({ payload }, { call, put }){
          const response = yield call(AllTeamMember);
          yield put({
            type:"reducersTeamMember",
            payload:response
          })
       },
       *EventBasicEdit({ payload,callback}, { call, put }){
          const response = yield call(EventBasicEdit,payload);
          callback(response)
          if(response.ReturnCode=='1001'){
            yield put(routerRedux.push({
              pathname: '/createEvent/setUp/content/step-form/summary',
              search:stringify({
                id: payload.EventId,
                eventstatus:1009001
              })})
            );
          }
       },
       *EventDelete({ payload, callback }, { call, put }){
          const response = yield call(EventDelete,payload);
          if (!!response && response.ReturnCode===1001){
            yield put({
              type: 'reducersEventDelete',
               payload: response,
             });
            if (response.ReturnCode == '1001') {
              message.success('删除成功！')
            }else{
              message.warn('删除失败~')
            }
          }
        },
       *RegisterLayout({ payload,callback }, { call, put }){
            const response = yield call(RegisterLayout,payload);
            callback(response)
            if(response.ReturnCode=='1001'){
              yield put(routerRedux.push({
                pathname: '/createEvent/setUp/tickets',
                search:stringify({
                  id: payload.EventId,
                  eventstatus:1009001
                })})
              );
            }
       },
       *EventRegisterLayoutDetail({ payload }, { call, put }){
          let response = yield call(EventRegisterLayoutDetail,payload);
          response==null?response=[]:'';
          yield put({
            type:"reducersRegisterLayout",
            payload:response
          })
       },
       *EventTicketList({ payload }, { call, put }){
          let response = yield call(EventTicketList,payload);
          yield put({
            type:"reducersEventTicketList",
            payload:response
          })
       },
       *EventTicketAddition({ payload,callback }, { call, put }){
          let response = yield call(EventTicketAddition,payload);
          if(response.ReturnCode=="1001"){
            if(callback) callback(true)
          }else{
            if(callback) callback(false)
          }
       },
       *EventTicketEdit({ payload,callback }, { call, put }){
        let response = yield call(EventTicketEdit,payload);
        if(response.ReturnCode=="1001"){
          if(callback) callback(true)
        }else{
          if(callback) callback(false)
        }
     },
      *EventTicketDelete({ payload,callback }, { call, put }){
        let response = yield call(EventTicketDelete,payload);
        if(response.ReturnCode=="1001"){
          if(callback) callback(true)
        }else{
          if(callback) callback(false)
        }
    },
       *AllCurrency({ payload }, { call, put }){
        let response = yield call(AllCurrency);
        yield put({
          type:"reducersAllCurrency",
          payload:response
        })
     },
      *EventDiscountList({ payload}, { call, put }){
        let response = yield call(EventDiscountList,payload);
        yield put({
          type:"reducersDiscountList",
          payload:response
        })
      },
      *EventDiscountAddition({ payload,callback }, { call, put }){
        let response = yield call(EventDiscountAddition,payload);
        if(response.ReturnCode=="1001"){
          if(callback) callback(true)
        }else{
          if(callback) callback(false)
        }
      },
      *EventDiscountEdit({ payload,callback }, { call, put }){
        let response = yield call(EventDiscountEdit,payload);
        if(response.ReturnCode=="1001"){
          if(callback) callback(true)
        }else{
          if(callback) callback(false)
        }
     },
     *EventDiscountDelete({ payload,callback }, { call, put }){
      let response = yield call(EventDiscountDelete,payload);
      if(response.ReturnCode=="1001"){
        if(callback) callback(true)
      }else{
        if(callback) callback(false)
      }
    },
    *AllDttEntity({ payload}, { call, put }){
      let response = yield call(AllDttEntity,payload);
      yield put({
        type:"reducersAllDttEntity",
        payload:response
      })
    },
    *EventLayout({ payload,callback}, { call, put }){
      console.log('payload', payload)
      let response = yield call(EventLayout,payload);
      if(response.ReturnCode=="1001"){
        if(callback) callback(true)
      }else{
        if(callback) callback(false)
      }
    },
    *EventLayoutDetail({ payload}, { call, put }){
      let response = yield call(EventLayoutDetail,payload);
      response==null?response=[]:null
      yield put({
        type:"reducersLayoutList",
        payload:response
      })
    },
    *DeloitteEntityBankAccount({ payload}, { call, put }){
      let response = yield call(DeloitteEntityBankAccount);
      response==null?response=[]:null
      yield put({
        type:"reducersBankList",
        payload:response
      })
    },
    *EventBankAccountDetail({ payload,callback }, { call, put }){
      let response = yield call(EventBankAccountDetail,payload);
      response.AccountName=null?response=[]:null;
      if(callback) callback(response)
      
    },
    *EventBankAccountEdit({ payload,callback}, { call, put }){
      let response = yield call(EventBankAccountEdit,payload);
      response==null?response=[]:null;
      if(callback) callback(response)
    },
    *EventPublish({ payload,callback}, { call, put }){
      let response = yield call(EventPublish,payload);
      response==null?response=[]:null;
      if(callback) callback(response)
      //The event was successfully published
    },
    },
    subscriptions: {
      setup({ history, dispatch }) {
        return history.listen(({ pathname }) => {
          if (pathname === '/') {
          }
        });
      
      },
    },
  }