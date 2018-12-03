import { EventVenueList } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { routerRedux } from 'dva/router';
import {message} from 'antd';
export default {
  namespace: 'eventVenueList',

  state: {
    eventVenueList: [],
  },

  effects: {
    *getEventVenueList({ payload }, { call, put }) {
      const response = yield call(EventVenueList, payload);
      yield put({
       type: 'changeEventVenueList',
        payload: response,
      });
      if(response === undefined || response === null){
        //message.warn('未获取到venue列表数据!')
      }
    },
  },

  reducers: {
    changeEventVenueList(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventVenueList: payload,
      };
    },
  },
};