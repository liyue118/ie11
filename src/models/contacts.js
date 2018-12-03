import {ContactAllList,ContactDetail,EventSpeakerDetail,ContactGroupList,ContactAdminList,ContactAddition,ContactEdit} from '../services/contacts';
import {IndustryDropdownList} from '../services/common'
import { stringify } from 'qs';
import { routerRedux } from 'dva/router';
import {getLocale} from '../utils/utils';
import {message} from 'antd';
import moment from 'moment';
export default {
    namespace: 'contacts',
  
    state: {
      ContactAllList: [],
      IndustryList:[],
      ContactGroupList:[],
    },
  
    effects: {
      
      *ContactAllList({ payload,callback }, { call, put }) { 
        const response = yield call(ContactAllList,payload);
        const data=[];
        if(response.Contacts!=null){
          response.Contacts.forEach(element => {
            data.push({
              ...element,
              key:element.PersonId,
              IsSpeaker:element.IsSpeaker?"演讲嘉宾":'-',
              action:{PersonId:element.PersonId,IsSpeaker:element.IsSpeaker}
            })
          });
        }
        const res={
          ItemsPerPage: response.ItemsPerPage,
          Page:response.Page,
          TotalPages:response.TotalPages,
          TotalRecords: response.TotalRecords
        }
        callback(res)
        yield put({
          type: 'reducersContactAllList',
          payload:data
        });
      },

      *IndustryDropdownList({ payload }, { call, put }) { 
        const response = yield call(IndustryDropdownList,payload);
        const data=[],lang=(getLocale()=='en-US');
        if(response!=null){
          response.forEach(element=>{
              data.push({
                Id:element.Value,
                Name:element.Label,
                Children:element.Children
              })
          })
        }  
        yield put({
          type: 'reducersIndustryList',
          payload:data
        });      
      },
      
      *ContactDetail({ payload,callback }, { call, put }) { 
        const response = yield call(ContactDetail,payload);
        callback(response) 
      },
      *EventSpeakerDetail({ payload,callback }, { call, put }) { 
        const response = yield call(EventSpeakerDetail,payload);
        callback(response) 
      },
      *ContactGroupList({ payload }, { call, put }) { 
        const response = yield call(ContactGroupList,payload);
        yield put({
          type: 'reducersContactGroupList',
          payload:response
        }); 
      },
      *ContactAdminList({ payload,callback }, { call, put }) { 
        const response = yield call(ContactAdminList,payload);
        callback(response)
      },
      *ContactAddition({ payload,callback }, { call, put }) { 
        const response = yield call(ContactAddition,payload);
        callback(response)
      },
      *ContactEdit({ payload,callback }, { call, put }) { 
        const response = yield call(ContactEdit,payload);
        callback(response)
      },
    },
  
    reducers: {
      reducersContactAllList(state, {payload}) {
        return { ...state,ContactAllList:payload,
        };
      },
      reducersIndustryList(state, {payload}) {
        return { ...state,IndustryList:payload,
        };
      },
      reducersContactGroupList(state, {payload}) {
        return { ...state,ContactGroupList:payload,
        };
      },
    },
    subscriptions: {
        setup({ history, dispatch }) {
          return history.listen(({ pathname }) => {
           
          });
        
        },
      },
  };