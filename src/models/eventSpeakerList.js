import { routerRedux } from 'dva/router';
import {message, Alert} from 'antd';
import { EventSpeakerList } from '../services/api';
//import { setAuthority } from '../utils/authority';
//import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'eventSpeakerList',

  state: {
    eventSpeakerList: [],
  },

  effects: {
    *eventSpeakerList({ payload }, { call, put }) {
      const response = yield call(EventSpeakerList, payload);
      yield put({
       type: 'changeEventSpeakerList',
        payload: response,
      });
      //successfully
    },
  },

  reducers: {
    changeEventSpeakerList(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventSpeakerList: payload,
      };
    },
  },
};