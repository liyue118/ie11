import { 
  getEventListByStatus,
  getDraftList,
  getCompletedList,
  getGetTop5Event,
  eventMineAddition,
  eventMineStarting,
  eventMineAttendee,
} from "../services/userIndex";
import { parse } from 'qs';
import { getPageQuery } from '../utils/utils';
const initState = {
  //控制表格组件
  count: 0,
  defaultActiveKey: 'Home',
  dataList: [],
  top5Events: [],
  visible: false,
  currentEventState: "Home",
  domLoading: false,
  pageSize: 15,
  page: {
    ItemsPerPage: 15,
    Page: 1,
    TotalPages: 1,
    TotalRecords: 0,
  }
}
export default {
  namespace: 'userIndex',
  state:initState,
  reducers: {
    initSetState(state, { payload }) {
      return { ...state, ...initState };
    },
    resetPage(state,action) {
      return {...state,...action.payload};
    },
    changeDomLoading(state,action) {
      return {...state,...action.payload};
    },
    savePage(state,action) {
      return {...state,...action.payload};
    },
    ChangeActiveKey(state,action) {
      return {...state,...action.payload};
    },
    changePageSize(state,action) {
      return {...state,...action.payload};
    },
    onCountChange(state,action) {
      return {...state,...action.payload};
    },
    renderDataList(state,action){
      return {...state,...action.payload};
    },
    changeModalState(state,action){
      return {...state,...action.payload};
    },
    renderTop5Events(state, action){
      return {...state,...action.payload};
    },
    changeEventState(state, action){
      return {...state,...action.payload};
    },
  },
  effects: {
    *getGetTop5Event({ payload }, {call, put }){
      const response  = yield call(getGetTop5Event, parse(payload));
      console.log('top5List',response);
      yield put({
        type:"renderTop5Events",
        payload:{
          top5Events:response
        }
      })
    },
    *getEventListByStatus({ payload }, { call, put }) {
      yield put({
        type:"changeDomLoading",
        payload:{
          domLoading: true
        }
      })
      console.log('getEventListByStatus', payload)
      const response = yield call(getEventListByStatus, parse(payload));
      console.log('根据状态加载EventList',response)
      if (!!response && !!response.Events){
        let page={
          ItemsPerPage: response.ItemsPerPage,
          Page: response.Page,
          TotalPages: response.TotalPages,
          TotalRecords: response.TotalRecords,
        }
        yield put({
          type: "renderDataList",
          payload: {
            dataList: response.Events
          }
        });
        yield put({
          type:"savePage",
          payload:{
            page: page
          }
        })
        yield put({
          type: "changeDomLoading",
          payload: {
            domLoading: false
          }
        });
      }else{
        yield put({
          type: "changeDomLoading",
          payload: {
            domLoading: false
          }
        })
      }
    },
    *eventMineAddition({ payload }, { call, put }) {
      yield put({
        type: "changeDomLoading",
        payload: {
          domLoading: true
        }
      });
      console.log('payload', payload);
      const response = yield call(eventMineAddition, parse(payload));
      console.log('我参加的会议', response);
      // response[0].ApprovalStatus = 1003004;
      // ApprovalStatus:{
      //   提交待审核:1003001,=>submitted
      //   审核通过待付款:1003002,=>Approved
      //   已付款:1003003,=>Paid
      //   已参加会议:1003004,=>Attended
      //   审核被拒绝:1003005,=>Rejected
      //   已取消:1003006,=>Canceled
      // }
      if (!!response && !!response.EventListInfo && response.EventListInfo.length){
        let page = {
          ItemsPerPage: response.ItemsPerPage,
          Page: response.Page,
          TotalPages: response.TotalPages,
          TotalRecords: response.TotalRecords,
        }
        yield put({
          type: "savePage",
          payload: {
            page: page
          }
        })
        yield put({
          type: "renderDataList",
          payload: {
            dataList: response.EventListInfo
          }
        });
        yield put({
          type:"changeDomLoading",
          payload:{
            domLoading:false
          }
        })
      }else{
        yield put({
          type: "changeDomLoading",
          payload: {
            domLoading: false
          }
        })
      }
    },
    *eventMineStarting({ payload }, { call, put }) {
      yield put({
        type: "changeDomLoading",
        payload: {
          domLoading: true
        }
      });
      const response = yield call(eventMineStarting, parse(payload));
      console.log('我参加的正在进行的会议', response);
      // response[0].ApprovalStatus = 1003004;
      // ApprovalStatus:{
      //   提交待审核:1003001,=>submitted
      //   审核通过待付款:1003002,=>Approved
      //   已付款:1003003,=>Paid
      //   已参加会议:1003004,=>Attended
      //   审核被拒绝:1003005,=>Rejected
      //   已取消:1003006,=>Canceled
      // }
      if (!!response && !!response.EventListInfo && response.EventListInfo.length){
        let page = {
          ItemsPerPage: response.ItemsPerPage,
          Page: response.Page,
          TotalPages: response.TotalPages,
          TotalRecords: response.TotalRecords,
        }
        yield put({
          type: "savePage",
          payload: {
            page: page
          }
        })
        yield put({
          type: "renderDataList",
          payload: {
            dataList: response.EventListInfo
          }
        });
        yield put({
          type:"changeDomLoading",
          payload:{
            domLoading:false
          }
        })
      }else{
        yield put({
          type: "changeDomLoading",
          payload: {
            domLoading: false
          }
        })
      }
    },
    *eventMineAttendee({ payload }, { call, put }) {
      yield put({
        type: "changeDomLoading",
        payload: {
          domLoading: true
        }
      })
      const response = yield call(eventMineAttendee, parse(payload));
      console.log('我结束的会议', response);
      if (!!response && !!response.EventListInfo && response.EventListInfo.length) {
        let page = {
          ItemsPerPage: response.ItemsPerPage,
          Page: response.Page,
          TotalPages: response.TotalPages,
          TotalRecords: response.TotalRecords,
        }
        yield put({
          type: "savePage",
          payload: {
            page: page
          }
        })
        yield put({
          type: "renderDataList",
          payload: {
            dataList: response.EventListInfo
          }
        });
        yield put({
          type:"changeDomLoading",
          payload:{
            domLoading:false
          }
        })
      }else{
        yield put({
          type: "changeDomLoading",
          payload: {
            domLoading: false
          }
        })
      }
    },
    *getDraftList({ payload }, { call, put }) {
			const response  = yield call(getDraftList, parse(payload));
    },
    *getCompletedList({ payload }, { call, put }) {
			const response  = yield call(getCompletedList, parse(payload));
    },
  },
  subscriptions:{
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/userInterface/userIndex') {
          dispatch({ type: "initSetState" })
          // console.log('location', getPageQuery(location.search).id)
          console.log('location',location);
          if (!!location.state && !!location.state.showMyEvent && location.state.showMyEvent==="showMyEvent"){
            dispatch({
              type:"changeEventState",
              payload:{
                currentEventState:"MyEvent"
              }
            })
            dispatch({
              type:"ChangeActiveKey",
              payload:{
                defaultActiveKey:"MyEvent"
              }
            })
            dispatch({
              type:"eventMineAddition",
              payload: {
                'Filter': '',
                'QueryClause': null,
                'OrderBy': '',
                'Page': 1,
                'ItemsPerPage': '15',
                'IsExport': false
              }
            })
          }else{
            // 默认调用tabs第一项
            dispatch({
              type: "changeEventState",
              payload: {
                currentEventState: "Home"
              }
            })
            dispatch({
              type: "ChangeActiveKey",
              payload: {
                defaultActiveKey: "Home"
              }
            })
            dispatch({
              type: 'getEventListByStatus',
              payload: {
                'Filter': 1009002,
                'QueryClause': null,
                'OrderBy': '',
                'Page': 1,
                'ItemsPerPage': '15',
                'IsExport': false
              }
            });
          }
          // 调用EventImgList
          dispatch({
            type: "getGetTop5Event",
            payload: {}
          })
        } else if (location.pathname === '/userInterface/userIndexPhone'){
          dispatch({ type: "initSetState" })
          // console.log('location', getPageQuery(location.search).id)
          dispatch({
            type: 'getEventListByStatus',
            payload: {
              'Filter': 1009001,
              'QueryClause': null,
              'OrderBy': '',
              'Page': 1,
              'ItemsPerPage': '15',
              'IsExport': false
            }
          });
          dispatch({
            type: "getGetTop5Event",
            payload: {}
          })
        }
      });
    },
  }
}
