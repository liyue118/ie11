import { 
  getPersonInfo, 
  getPersonContactList, 
  eventAttendeeSettings,
  eventRegisterLayoutDetail,
  getTransactionTypeDropdownList,
} from "../services/registerEvent";
import {
  getEventDetails,
} from "../services/eventDetails";
import {
  getAddressDropDownList,
  industryDropdownList,
  getCategoryType
} from "../services/personalInfos";
import { parse } from 'qs';
import { getCookie, getPageQuery} from '../utils/utils';
export default {
  namespace: 'registerEvent',
  state: {
    currentEvent:{},
    participantsNum:1,  //初始化参会人数
    ticketLimit : 10, //默认最大票数为10
    contactList : [], //初始化联系人
    participantInfo : {}, //初始化默认参与者信息
    currentUserInfo: {},
    registerObj: {},
    modalVisible: false,
    showOrHiddenObj:{},
    transactionTypeDropdownList:[], //交易类型下拉框data
    cascaderOptions: [],
    industryArr: [],
    industryOptions: [],
  },
  reducers: {
    changeOption(state, action) {
      return { ...state, ...action.payload };
    },
    changeState(state,action) {
      return {...state,...action.payload};
    },
    changeVisible(state,action) {
      return {...state,...action.payload};
    },
    saveTickes(state,action) {
      return {...state,...action.payload};
    },
    changeEvent(state,action) {
      return {...state,...action.payload};
    },
    participantsNumChange(state,action) {
      return {...state,...action.payload};
    },
    renderTicketLimit(state,action) {
      return {...state,...action.payload};
    },
    saveContactList(state,action) {
      return {...state,...action.payload};
    },
    saveParticipantInfo(state,action) {
      return {...state,...action.payload};
    },
    saveCurrentUserInfo(state,action) {
      return {...state,...action.payload};
    },
    saveContactList(state,action) {
      return {...state,...action.payload};
    },
    saveRegisterObj(state,action) {
      return {...state,...action.payload};
    },
    saveIndustryArr(state,action) {
      return {...state,...action.payload};
    },
  },
  effects: {
    *getPersonInfo({ payload }, {call, put }){
      const response = yield call(getPersonInfo, parse(payload));
      console.log('用户信息', response)
      yield put({
        type: "saveCurrentUserInfo",
        payload: {
          currentUserInfo: response
        }
      })
    },
    *getPersonContactList({ payload }, {call, put ,select}){
      const response = yield call(getPersonContactList, parse(payload));
      // console.log('用户联系人信息', response)
      if (!!response && !!response.length){
        yield put({
          type: "saveContactList",
          payload: {
            contactList: response
          }
        })
      }else{
        yield put({
          type: "saveContactList",
          payload: {
            contactList: ['1']
          }
        })
      }
    },
    *getTransactionTypeDropdownList({ payload }, {call, put }){
      const response = yield call(getTransactionTypeDropdownList, parse(payload));
      if (!!response && response.length) {
        console.log('TransactionTypeDropdownList',response)
        yield put({
          type: "changeState",
          payload: {
            transactionTypeDropdownList: response
          }
        })
      }
    },
    *eventAttendeeSettings({ payload }, {call, put }){
      console.log('payload', payload)
      const response = yield call(eventAttendeeSettings, parse(payload));
      console.log('response', response)
      if (response.Message === null && response.ReturnCode === 1001 && !!response.EventId){
        yield put({
          type: "saveRegisterObj",
          payload: {
            registerObj: response
          }
        })
        yield put({
          type: "changeVisible",
          payload: {
            modalVisible: true
          }
        })
      }
    },
    *formItemShowOrHidden({ payload },{ call , put }){
      const response = yield call(eventRegisterLayoutDetail, parse(payload));
      console.log('showOrFalse', response)
      yield put({
        type:"changeState",
        payload:{
          showOrHiddenObj:response
        }
      })
    },
    *renderCascader({ payload }, { call, put }) {
      const response = yield call(getAddressDropDownList, parse(payload));
      // console.log("城市级联菜单", response);
      if (!!response && !!response.ProvinceList && !!response.ProvinceList.length) {
        const provinceList = response.ProvinceList;
        let values = [];
        provinceList.map((item, index) => {
          if (!!item.CityList && !!item.CityList.length) {
            let children = [];
            item.CityList.map((i, j) => {
              let arr = [];
              if (!!i.DistrictName && !!i.DistrictName.length) {
                i.DistrictName.map((k, l) => {
                  arr.push({
                    "value": k,
                    "label": k,
                  })
                })
              }
              children.push({
                "value": i.CityName,
                "label": i.CityName,
                'children': arr
              });
            })
            values.push({
              "value": item.ProvinceName,
              "label": item.ProvinceName,
              'children': children
            });
          }
        });
        yield put({
          type: "changeOption",
          payload: {
            cascaderOptions: values
          }
        })
      }
    },
    *industryDropdownList({ payload }, { call, put }) {
      const response = yield call(industryDropdownList, parse(payload));
      if (!!response && !!response.length) {
        // console.log('industryDropdownList', response)
        let values = [];
        let children = [];
        response.map((item, index) => {
          if (!!item.Children && item.Children.length) {
            let children = [];
            item.Children.map((i, j) => {
              children.push({
                "value": i.Value,
                "label": i.Label,
              })
            })
            values.push({
              "value": item.Value,
              "label": item.Label,
              'children': children
            });
          } else {
            values.push({
              "value": item.Value,
              "label": item.Label,
            });
          }
        })
        yield put({
          type: "changeOption",
          payload: {
            industryOptions: values
          }
        })
      }
    },
    *getCategoryType({ payload }, { call, put }) {
      const response = yield call(getCategoryType, parse(payload));
      if (!!response && response.length) {
        yield put({
          type: "saveIndustryArr",
          payload: {
            industryArr: response
          }
        })
      }
    },
    *getEventDetails({ payload }, { call, put }) {
      const response = yield call(getEventDetails, parse(payload));
      console.log('活动详情', response)
      if(!!response){
        if (!!response.OneTicketPerRegistant){
          yield put({
            type:"saveTickes",
            payload:{
              ticketLimit:1
            }
          })
        } else if (response.OneRegistantTicketLimit){
          yield put({
            type: "saveTickes",
            payload: {
              ticketLimit: response.OneRegistantTicket
            }
          })
        }
        yield put({
          type: "changeEvent",
          payload: {
            currentEvent: response
          }
        })
      }
    },
  },
  subscriptions:{
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/userInterface/registerEvent' || location.pathname === '/userInterface/registerEventPhone') {
            const sk= getCookie("sk") != null ? getCookie("sk") : '';
            if(!!sk){
              dispatch({
                type: "getPersonInfo",
                payload: {}
              })
              dispatch({
                type: "getPersonContactList",
                payload: {}
              })
            }
          const eventId = getPageQuery(location.search).id;
          if (!!eventId && eventId !== "") {
            dispatch({
              type: "getEventDetails",
              payload: {
                EventId: eventId
              }
            })
            dispatch({
              type: "formItemShowOrHidden",
              payload: {
                EventId: eventId
              }
            })
          }
          
            dispatch({
              type: "getTransactionTypeDropdownList",
              payload:{}
            })
            dispatch({
              type: "renderCascader",
              payload: {
                Country: "中国"
              }
            })
            dispatch({
              type: "industryDropdownList",
              payload: {}
            })
            dispatch({
              type: "getCategoryType",
              payload: {}
            })
            // const data = localStorage.getItem("currentEvent");  //上级页面传入参数
            // if (!!location.state && !!location.state.currentEvent.Id){
            //   dispatch({
            //     type: 'changeEvent',
            //     payload: {
            //       currentEvent: location.state.currentEvent
            //     }
            //   });
            //   dispatch({
            //     type:"formItemShowOrHidden",
            //     payload:{
            //       EventId: location.state.currentEvent.Id
            //     }
            //   })
            // } else if (!!data && data!==""){
            //   const currentEvent = JSON.parse(data);
            //   if (!!currentEvent && !!currentEvent.GroupTicketLimit){
            //     dispatch({
            //       type: 'renderTicketLimit',
            //       payload: {
            //         ticketLimit: currentEvent.GroupTicketLimit
            //       }
            //     });
            //   }
            //   dispatch({
            //     type: "formItemShowOrHidden",
            //     payload: {
            //       EventId: currentEvent.Id
            //     }
            //   })
            //   dispatch({
            //     type: 'changeEvent',
            //     payload: {
            //       currentEvent: currentEvent
            //     }
            //   });
            // } 
        };
      });
    },
  }
}
