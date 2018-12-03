import { EventSponsorAddition } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { routerRedux } from 'dva/router';
import {message} from 'antd';
export default {
  namespace: 'eventSponsorAddition',

  state: {
    eventSponsorAddition: [],
  },

  effects: {
    *getEventSponsorAddition({ payload }, { call, put }) {
      const response = yield call(EventSponsorAddition, payload);
      yield put({
       type: 'changeEventSponsorAddition',
        payload: response,
      });
    },
  },

  reducers: {
    changeEventSponsorAddition(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventSponsorAddition: payload,
      };
    },
  },
};