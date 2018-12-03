import { EventDuration } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import {message} from 'antd';
export default {
  namespace: 'eventDuration',

  state: {
    eventDuration: [],
  },

  effects: {
    *getEventDuration({ payload }, { call, put }) {
      const response = yield call(EventDuration, payload);
      yield put({
       type: 'changeEventDuration',
        payload: response,
      });
    },
  },

  reducers: {
    changeEventDuration(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventDuration: payload,
      };
    },
  },
};