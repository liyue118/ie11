import { EventSummaryAddition } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { routerRedux } from 'dva/router';
export default {
  namespace: 'eventSummaryAddition',

  state: {
    eventSummaryAddition: [],
  },

  effects: {
    *getEventSummaryAddition({ payload }, { call, put }) {
      const response = yield call(EventSummaryAddition, payload);
      yield put({
       type: 'changeEventSummaryAddition',
        payload: response,
      });
    },
  },

  reducers: {
    changeEventSummaryAddition(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        eventSummaryAddition: payload,
      };
    },
  },
};