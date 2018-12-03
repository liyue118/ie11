import { EventVenueReset } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { routerRedux } from 'dva/router';
import {message} from 'antd';
export default {
  namespace: 'eventVenueReset',

  state: {
    eventVenueReset: [],
  },

  effects: {
    *getEventVenueReset({ payload }, { call, put }) {
      const response = yield call(EventVenueReset, payload);
      yield put({
       type: 'changeEventVenueReset',
        payload: response,
      });
    },
  },

  reducers: {
    changeEventVenueReset(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventVenueReset: payload,
      };
    },
  },
};