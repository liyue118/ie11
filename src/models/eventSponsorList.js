import { routerRedux } from 'dva/router';
import {message, Alert} from 'antd';
import { EventSponsorList } from '../services/api';
//import { setAuthority } from '../utils/authority';
//import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'eventSponsorList',

  state: {
    eventSponsorList: [],
  },

  effects: {
    *getEventSponsorList({ payload }, { call, put }) {
      const response = yield call(EventSponsorList, payload);
      yield put({
       type: 'changeEventSponsorList',
        payload: response,
      });
      //successfully
    },
  },

  reducers: {
    changeEventSponsorList(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventSponsorList: payload,
      };
    },
  },
};